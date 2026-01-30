import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AccessService } from './access.service';
import { GenerateQrDto } from './dto/generate-qr.dto';
import { CheckInDto } from './dto/check-in.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  /**
   * Generate QR code for a ticket
   */
  @Post('generate-qr')
  async generateQR(@Body() dto: GenerateQrDto) {
    return this.accessService.generateQRCode(
      dto.ticketId,
      dto.eventId,
      dto.userId,
    );
  }

  /**
   * Validate and check-in a ticket
   */
  @Post('check-in')
  async checkIn(@Body() dto: CheckInDto) {
    return this.accessService.validateAndCheckIn(
      dto.qrData,
      dto.scannedBy,
      dto.location,
      dto.deviceInfo,
    );
  }

  /**
   * Get scan history for an event
   */
  @Get('scan-history/event/:eventId')
  async getEventScanHistory(@Param('eventId') eventId: string) {
    return this.accessService.getScanHistory(eventId);
  }

  /**
   * Get scan history for a controller
   */
  @Get('scan-history/controller/:controllerId')
  async getControllerScanHistory(@Param('controllerId') controllerId: string) {
    return this.accessService.getScanHistoryByController(controllerId);
  }

  /**
   * Get all scan logs
   */
  @Get('scan-history')
  async getAllScanHistory() {
    return this.accessService.getAllScanLogs();
  }



  /**
   * Get scan statistics for all events
   */
  @Get('stats')
  async getAllEventStats() {
    return this.accessService.getAllEventStats();
  }

  /**
   * Get ticket by ID
   */
  @Get('ticket/:ticketId')
  async getTicket(@Param('ticketId') ticketId: string) {
    return this.accessService.getTicket(ticketId);
  }

  /**
   * Get tickets by user
   */
  @Get('tickets/user/:userId')
  async getUserTickets(@Param('userId') userId: string) {
    return this.accessService.getTicketsByUser(userId);
  }

  /**
   * Refresh QR code
   */
  @Post('refresh-qr/:ticketId')
  async refreshQR(@Param('ticketId') ticketId: string) {
    return this.accessService.refreshQRCode(ticketId);
  }

  /**
   * Create ticket (mock endpoint for testing)
   */
  @Post('ticket')
  async createTicket(@Body() dto: CreateTicketDto) {
    return this.accessService.createTicket(dto);
  }
}
