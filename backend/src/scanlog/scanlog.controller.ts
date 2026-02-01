import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScanlogService } from './scanlog.service';
import { GetScanLogsDto } from './dto/get-scan-logs.dto';
import { ScanLogResponseDto } from './dto/scan-log-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('scanlog')
@Controller('scanlog')
export class ScanlogController {
  constructor(private readonly scanlogService: ScanlogService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiOperation({ summary: 'Get scan statistics for all events' })
  @ApiResponse({ status: 200, description: 'Returns statistics grouped by event' })
  async getAllEventStats() {
    return this.scanlogService.getAllEventStats();
  }

  @Get('ticket/:ticketId')
  @ApiOperation({ summary: 'Get all scan logs for a specific ticket' })
  @ApiResponse({ status: 200, description: 'Returns scan logs for the ticket', type: [ScanLogResponseDto] })
  async getScanLogsByTicket(@Param('ticketId') ticketId: string): Promise<ScanLogResponseDto[]> {
    return this.scanlogService.getScanLogsByTicket(ticketId);
  }

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiOperation({ summary: 'Get all scan logs for a specific event' })
  @ApiResponse({ status: 200, description: 'Returns scan logs for the event', type: [ScanLogResponseDto] })
  async getScanLogsByEvent(@Param('eventId') eventId: string): Promise<ScanLogResponseDto[]> {
    return this.scanlogService.getScanLogsByEvent(eventId);
  }

  @Get('scanner/:scannedBy')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiOperation({ summary: 'Get all scan logs for a specific scanner/controller' })
  @ApiResponse({ status: 200, description: 'Returns scan logs for the scanner', type: [ScanLogResponseDto] })
  async getScanLogsByScanner(@Param('scannedBy') scannedBy: string): Promise<ScanLogResponseDto[]> {
    return this.scanlogService.getScanLogsByScanner(scannedBy);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific scan log by ID' })
  @ApiResponse({ status: 200, description: 'Returns the scan log', type: ScanLogResponseDto })
  @ApiResponse({ status: 404, description: 'Scan log not found' })
  async getScanLogById(@Param('id') id: string): Promise<ScanLogResponseDto> {
    return this.scanlogService.getScanLogById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiOperation({ summary: 'Get scan logs with optional filters' })
  @ApiResponse({ status: 200, description: 'Returns filtered scan logs', type: [ScanLogResponseDto] })
  async getScanLogs(@Query() filters: GetScanLogsDto): Promise<ScanLogResponseDto[]> {
    return this.scanlogService.getScanLogs(filters);
  }
}
