import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScanLog } from './entities/scan-log.entity';
import { ScanStatus } from './enums/scan-status.enum';
import { GetScanLogsDto } from './dto/get-scan-logs.dto';
import { ScanLogResponseDto } from './dto/scan-log-response.dto';

@Injectable()
export class ScanlogService {
  constructor(
    @InjectRepository(ScanLog)
    private scanLogRepository: Repository<ScanLog>,
  ) {}

  /**
   * Get scan logs with optional filters
   */
  async getScanLogs(filters: GetScanLogsDto): Promise<ScanLogResponseDto[]> {
    const queryBuilder = this.scanLogRepository.createQueryBuilder('scanLog');

    if (filters.ticketId) {
      queryBuilder.andWhere('scanLog.ticketId = :ticketId', { ticketId: filters.ticketId });
    }

    if (filters.eventId) {
      queryBuilder.andWhere('scanLog.eventId = :eventId', { eventId: filters.eventId });
    }

    if (filters.scannedBy) {
      queryBuilder.andWhere('scanLog.scannedBy = :scannedBy', { scannedBy: filters.scannedBy });
    }

    if (filters.status) {
      queryBuilder.andWhere('scanLog.status = :status', { status: filters.status });
    }

    if (filters.startDate && filters.endDate) {
      queryBuilder.andWhere('scanLog.scannedAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    } else if (filters.startDate) {
      queryBuilder.andWhere('scanLog.scannedAt >= :startDate', { startDate: filters.startDate });
    } else if (filters.endDate) {
      queryBuilder.andWhere('scanLog.scannedAt <= :endDate', { endDate: filters.endDate });
    }

    queryBuilder.orderBy('scanLog.scannedAt', 'DESC');

    return queryBuilder.getMany();
  }

  /**
   * Get a specific scan log by ID
   */
  async getScanLogById(id: string): Promise<ScanLogResponseDto> {
    const scanLog = await this.scanLogRepository.findOne({ where: { id } });
    
    if (!scanLog) {
      throw new NotFoundException(`Scan log with ID ${id} not found`);
    }

    return scanLog;
  }

  /**
   * Get all scan logs for a specific ticket
   */
  async getScanLogsByTicket(ticketId: string): Promise<ScanLogResponseDto[]> {
    return this.scanLogRepository.find({
      where: { ticketId },
      order: { scannedAt: 'DESC' },
    });
  }

  /**
   * Get all scan logs for a specific event
   */
  async getScanLogsByEvent(eventId: string): Promise<ScanLogResponseDto[]> {
    return this.scanLogRepository.find({
      where: { eventId },
      order: { scannedAt: 'DESC' },
    });
  }

  /**
   * Get all scan logs for a specific scanner/controller
   */
  async getScanLogsByScanner(scannedBy: string): Promise<ScanLogResponseDto[]> {
    return this.scanLogRepository.find({
      where: { scannedBy },
      order: { scannedAt: 'DESC' },
    });
  }

  /**
   * Create a new scan log entry
   */
  async createScanLog(scanLogData: Partial<ScanLog>): Promise<ScanLog> {
    const scanLog = this.scanLogRepository.create(scanLogData);
    return this.scanLogRepository.save(scanLog);
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
    const allLogs = await this.scanLogRepository.find({
      order: { scannedAt: 'DESC' },
    });
    
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
}
