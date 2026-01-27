import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { AccessService } from './access.service';
import { ScanStatus } from './entities/scan-log.entity';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  /**
   * Generate QR code for a ticket
   */
  @Post('generate-qr')
  async generateQR(
    @Body() body: { ticketId: string; eventId: string; userId: string },
  ) {
    return this.accessService.generateQRCode(
      body.ticketId,
      body.eventId,
      body.userId,
    );
  }

  /**
   * Validate and check-in a ticket
   */
  @Post('check-in')
  async checkIn(
    @Body()
    body: {
      qrData: string;
      scannedBy: string;
      location?: string;
      deviceInfo?: string;
    },
  ) {
    return this.accessService.validateAndCheckIn(
      body.qrData,
      body.scannedBy,
      body.location,
      body.deviceInfo,
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
  async createTicket(
    @Body()
    body: {
      eventId: string;
      userId: string;
      orderId: string;
      seat?: string;
      category: string;
      price: number;
    },
  ) {
    return this.accessService.createTicket(body);
  }
}
