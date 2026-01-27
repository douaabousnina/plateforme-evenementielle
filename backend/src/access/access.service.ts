import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { ScanLog, ScanStatus } from './entities/scan-log.entity';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(ScanLog)
    private scanLogRepository: Repository<ScanLog>,
  ) {}

  /**
   * Generate a secure QR code for a ticket
   */
  async generateQRCode(ticketId: string, eventId: string, userId: string): Promise<{ qrCode: string; qrToken: string }> {
    const qrToken = this.generateSecureToken(ticketId);
    
    const qrData = JSON.stringify({
      ticketId,
      eventId,
      userId,
      token: qrToken,
      timestamp: Date.now(),
    });

    const qrCode = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 2,
      color: {
        dark: '#5B47FB',
        light: '#FFFFFF',
      },
    });

    return { qrCode, qrToken };
  }

  

  /**
   * Validate QR code and perform check-in
   */
  async validateAndCheckIn(
    qrData: string,
    scannedBy: string,
    location?: string,
    deviceInfo?: string,
  ): Promise<{ status: ScanStatus; message: string; ticket?: Ticket }> {
    try {
      const data = JSON.parse(qrData);
      const { ticketId, eventId, userId, token, timestamp } = data;

      // Check if ticket exists
      const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
      if (!ticket) {
        await this.logScan(ticketId, eventId, scannedBy, ScanStatus.FAKE, location, deviceInfo);
        return { status: ScanStatus.FAKE, message: 'Ticket invalide' };
      }

      // Check if ticket is expired
      if (new Date() > ticket.expiresAt) {
        await this.logScan(ticketId, eventId, scannedBy, ScanStatus.EXPIRED, location, deviceInfo);
        return { status: ScanStatus.EXPIRED, message: 'Billet expiré' };
      }

      // Check if already scanned
      if (ticket.status === TicketStatus.SCANNED) {
        await this.logScan(ticketId, eventId, scannedBy, ScanStatus.ALREADY_SCANNED, location, deviceInfo);
        return { 
          status: ScanStatus.ALREADY_SCANNED, 
          message: `Déjà scanné le ${ticket.scannedAt?.toLocaleString('fr-FR')}`,
          ticket 
        };
      }

      // Validate token
      if (token !== ticket.qrToken) {
        await this.logScan(ticketId, eventId, scannedBy, ScanStatus.INVALID, location, deviceInfo);
        return { status: ScanStatus.INVALID, message: 'Token invalide' };
      }

      // Check timestamp (QR valid for 5 minutes)
      const now = Date.now();
      if (now - timestamp > 5 * 60 * 1000) {
        await this.logScan(ticketId, eventId, scannedBy, ScanStatus.EXPIRED, location, deviceInfo);
        return { status: ScanStatus.EXPIRED, message: 'QR code expiré, veuillez rafraîchir' };
      }

      // Valid check-in
      ticket.status = TicketStatus.SCANNED;
      ticket.scannedAt = new Date();
      await this.ticketRepository.save(ticket);

      await this.logScan(ticketId, eventId, scannedBy, ScanStatus.VALID, location, deviceInfo);

      return { 
        status: ScanStatus.VALID, 
        message: 'Accès autorisé', 
        ticket 
      };
    } catch (error) {
      return { status: ScanStatus.INVALID, message: 'QR code invalide' };
    }
  }

  /**
   * Log scan attempt
   */
  private async logScan(
    ticketId: string,
    eventId: string,
    scannedBy: string,
    status: ScanStatus,
    location?: string,
    deviceInfo?: string,
  ): Promise<void> {
    const scanLog = this.scanLogRepository.create({
      ticketId,
      eventId,
      scannedBy,
      status,
      location,
      deviceInfo,
    });

    await this.scanLogRepository.save(scanLog);
  }

  /**
   * Get scan history for an event
   */
  async getScanHistory(eventId: string): Promise<ScanLog[]> {
    return this.scanLogRepository.find({ where: { eventId }, order: { scannedAt: 'DESC' } });
  }

  /**
   * Get scan history for a controller
   */
  async getScanHistoryByController(scannedBy: string): Promise<ScanLog[]> {
    return this.scanLogRepository.find({ where: { scannedBy }, order: { scannedAt: 'DESC' } });
  }

  /**
   * Get all scan logs
   */
  async getAllScanLogs(): Promise<ScanLog[]> {
    return this.scanLogRepository.find({ order: { scannedAt: 'DESC' } });
  }



  /**
   * Get scan statistics for all events
   */
  async getAllEventStats(): Promise<Array<{
    eventId: string;
    eventName: string;
    total: number;
    valid: number;
    alreadyScanned: number;
    invalid: number;
    fake: number;
    expired: number;
    uniqueTickets: number;
    lastScan: Date | null;
  }>> {
    const allLogs = await this.getAllScanLogs();
    const eventMap = new Map<string, ScanLog[]>();
    
    // Group logs by eventId
    allLogs.forEach(log => {
      const eventId = log.eventId || 'unknown';
      if (!eventMap.has(eventId)) {
        eventMap.set(eventId, []);
      }
      eventMap.get(eventId)!.push(log);
    });

    // Calculate stats for each event
    return Array.from(eventMap.entries()).map(([eventId, logs]) => {
      const sortedLogs = logs.sort((a, b) => b.scannedAt.getTime() - a.scannedAt.getTime());
      const uniqueTickets = new Set(logs.map(l => l.ticketId));
      
      return {
        eventId,
        eventName: logs[0].eventName || `Event ${eventId}`,
        total: logs.length,
        valid: logs.filter(l => l.status === ScanStatus.VALID).length,
        alreadyScanned: logs.filter(l => l.status === ScanStatus.ALREADY_SCANNED).length,
        invalid: logs.filter(l => l.status === ScanStatus.INVALID).length,
        fake: logs.filter(l => l.status === ScanStatus.FAKE).length,
        expired: logs.filter(l => l.status === ScanStatus.EXPIRED).length,
        uniqueTickets: uniqueTickets.size,
        lastScan: sortedLogs[0]?.scannedAt || null,
      };
    }).sort((a, b) => {
      if (!a.lastScan) return 1;
      if (!b.lastScan) return -1;
      return b.lastScan.getTime() - a.lastScan.getTime();
    });
  }

  /**
   * Create a ticket (mock - normally handled by Person 3)
   */
  async createTicket(ticketData: Partial<Ticket>): Promise<Ticket> {
    const ticketId = crypto.randomUUID();
    const { qrCode, qrToken } = await this.generateQRCode(ticketId, ticketData.eventId!, ticketData.userId!);

    const ticket = this.ticketRepository.create({
      id: ticketId,
      ...ticketData,
      qrCode,
      qrToken,
      status: TicketStatus.CONFIRMED,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    });

    return this.ticketRepository.save(ticket);
  }

  /**
   * Get ticket by ID
   */
  async getTicket(ticketId: string): Promise<Ticket | null> {
    return this.ticketRepository.findOne({ where: { id: ticketId } });
  }

  /**
   * Get tickets by user
   */
  async getTicketsByUser(userId: string): Promise<Ticket[]> {
    return this.ticketRepository.find({ where: { userId } });
  }

  /**
   * Refresh QR code (generate new token)
   */
  async refreshQRCode(ticketId: string): Promise<{ qrCode: string; qrToken: string }> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { qrCode, qrToken } = await this.generateQRCode(ticketId, ticket.eventId, ticket.userId);
    
    // Update the ticket with the new token
    ticket.qrToken = qrToken;
    await this.ticketRepository.save(ticket);

    return { qrCode, qrToken };
  }

  /**
   * Generate secure token
   */
  private generateSecureToken(ticketId: string): string {
    return crypto
      .createHash('sha256')
      .update(`${ticketId}-${Date.now()}-${Math.random()}`)
      .digest('hex');
  }
}
