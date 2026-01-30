import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketStatus } from './enums/ticket-status.enum';
import { CheckInDto } from './dto/check-in.dto';
import { CheckInResponseDto } from './dto/check-in-response.dto';
import { ScanStatus } from '../scanlog/enums/scan-status.enum';
import { ScanLog } from '../scanlog/entities/scan-log.entity';
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
  async generateQrCode(ticketId: string): Promise<{ qrCode: string; qrToken: string }> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    const qrToken = this.generateSecureToken(ticketId);
    
    const qrData = JSON.stringify({
      ticketId,
      eventId: ticket.eventId,
      userId: ticket.userId,
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

    // Update ticket with new token
    ticket.qrToken = qrToken;
    await this.ticketRepository.save(ticket);

    return { qrCode, qrToken };
  }

  /**
   * Validate QR code and perform check-in
   */
  async checkIn(dto: CheckInDto): Promise<CheckInResponseDto> {
    try {
      const data = JSON.parse(dto.qrCode);
      const { ticketId, eventId, userId, token, timestamp } = data;

      // Check if ticket exists
      const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
      if (!ticket) {
        // Log invalid scan attempt
        await this.scanLogRepository.save({
          ticketId,
          eventId: eventId || 'unknown',
          scannedBy: dto.scannedBy,
          status: ScanStatus.FAKE,
          location: dto.location,
          deviceInfo: dto.deviceInfo,
        });
        
        return {
          success: false,
          message: 'Ticket invalide',
          status: ScanStatus.FAKE,
        };
      }

      // Check if ticket is expired
      if (new Date() > ticket.expiresAt) {
        // Log expired scan attempt
        await this.scanLogRepository.save({
          ticketId,
          eventId: ticket.eventId,
          eventName: ticket.eventName,
          scannedBy: dto.scannedBy,
          status: ScanStatus.EXPIRED,
          location: dto.location,
          deviceInfo: dto.deviceInfo,
        });
        
        return {
          success: false,
          message: 'Billet expiré',
          status: ScanStatus.EXPIRED,
          ticketId,
          eventName: ticket.eventName,
          ticket,
        };
      }

      // Check if already scanned
      if (ticket.status === TicketStatus.SCANNED) {
        // Log duplicate scan attempt
        await this.scanLogRepository.save({
          ticketId,
          eventId: ticket.eventId,
          eventName: ticket.eventName,
          scannedBy: dto.scannedBy,
          status: ScanStatus.ALREADY_SCANNED,
          location: dto.location,
          deviceInfo: dto.deviceInfo,
        });
        
        return {
          success: false,
          message: `Déjà scanné le ${ticket.scannedAt?.toLocaleString('fr-FR')}`,
          status: ScanStatus.ALREADY_SCANNED,
          ticketId,
          eventName: ticket.eventName,
          scannedAt: ticket.scannedAt,
          ticket,
        };
      }

      // Validate token
      if (token !== ticket.qrToken) {
        // Log invalid token scan attempt
        await this.scanLogRepository.save({
          ticketId,
          eventId: ticket.eventId,
          eventName: ticket.eventName,
          scannedBy: dto.scannedBy,
          status: ScanStatus.INVALID,
          location: dto.location,
          deviceInfo: dto.deviceInfo,
        });
        
        return {
          success: false,
          message: 'Token invalide',
          status: ScanStatus.INVALID,
          ticket,
        };
      }

      // Check timestamp (QR valid for 5 minutes)
      const now = Date.now();
      if (now - timestamp > 5 * 60 * 1000) {
        // Log expired QR scan attempt
        await this.scanLogRepository.save({
          ticketId,
          eventId: ticket.eventId,
          eventName: ticket.eventName,
          scannedBy: dto.scannedBy,
          status: ScanStatus.EXPIRED,
          location: dto.location,
          deviceInfo: dto.deviceInfo,
        });
        
        return {
          success: false,
          message: 'QR code expiré, veuillez rafraîchir',
          status: ScanStatus.EXPIRED,
          ticket,
        };
      }

      // Valid check-in
      ticket.status = TicketStatus.SCANNED;
      ticket.scannedAt = new Date();
      await this.ticketRepository.save(ticket);

      // Log successful scan
      await this.scanLogRepository.save({
        ticketId,
        eventId: ticket.eventId,
        eventName: ticket.eventName,
        scannedBy: dto.scannedBy,
        status: ScanStatus.VALID,
        location: dto.location,
        deviceInfo: dto.deviceInfo,
      });

      return {
        success: true,
        message: 'Accès autorisé',
        status: ScanStatus.VALID,
        ticketId,
        eventName: ticket.eventName,
        scannedAt: ticket.scannedAt,
        ticket,
      };
    } catch (error) {
      // Log invalid QR format scan attempt
      try {
        await this.scanLogRepository.save({
          ticketId: 'unknown',
          eventId: 'unknown',
          scannedBy: dto.scannedBy,
          status: ScanStatus.INVALID,
          location: dto.location,
          deviceInfo: dto.deviceInfo,
        });
      } catch (logError) {
        console.error('Failed to log invalid scan:', logError);
      }
      
      return {
        success: false,
        message: 'QR code invalide',
        status: ScanStatus.INVALID,
      };
    }
  }

  /**
   * Refresh QR code (generate new token) - Used when QR expires after 5 minutes
   */
  async refreshQrCode(ticketId: string): Promise<{ qrCode: string; qrToken: string }> {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    const qrToken = this.generateSecureToken(ticketId);
    
    const qrData = JSON.stringify({
      ticketId,
      eventId: ticket.eventId,
      userId: ticket.userId,
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

    // Update ticket with new token
    ticket.qrToken = qrToken;
    await this.ticketRepository.save(ticket);

    return { qrCode, qrToken };
  }

  /**
   * Get all tickets for a specific user
   */
  async getUserTickets(userId: string) {
    const tickets = await this.ticketRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return tickets;
  }

  /**
   * Generate tickets for a confirmed reservation
   */
  async generateTicketsForReservation(reservation: any, event: any): Promise<Ticket[]> {
    const tickets: Ticket[] = [];

    // Create a ticket for each reserved seat
    for (const seat of reservation.seats) {
      // Generate UUID upfront to avoid double-save
      const ticketId = crypto.randomUUID();
      const qrToken = this.generateSecureToken(`${reservation.id}-${seat.id}`);
      
      const qrData = JSON.stringify({
        ticketId,
        eventId: event.id,
        userId: reservation.userId,
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

      const ticket = this.ticketRepository.create({
        id: ticketId,
        eventId: event.id,
        eventName: event.title,
        eventDate: event.date,
        eventLocation: `${event.venueName || ''}, ${event.city}`,
        eventImage: event.image,
        userId: reservation.userId,
        orderId: reservation.id,
        qrCode,
        qrToken,
        gate: seat.section,
        row: seat.row,
        seat: seat.number?.toString(),
        zone: seat.section,
        access: 'Standard',
        category: seat.category || 'General',
        price: seat.price,
        status: TicketStatus.CONFIRMED,
        expiresAt: new Date(event.date.getTime() + 24 * 60 * 60 * 1000), // Event date + 1 day
      });

      const savedTicket = await this.ticketRepository.save(ticket);
      tickets.push(savedTicket);
    }

    return tickets;
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
