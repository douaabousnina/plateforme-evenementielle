import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessService } from './access.service';
import { GenerateQrCodeDto } from './dto/generate-qr-code.dto';
import { CheckInDto } from './dto/check-in.dto';
import { CheckInResponseDto } from './dto/check-in-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('access')
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post('generate-qr')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate QR code for a ticket' })
  @ApiResponse({ status: 201, description: 'QR code generated successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async generateQrCode(@Body() dto: GenerateQrCodeDto) {
    return this.accessService.generateQrCode(dto.ticketId);
  }

  @Post('check-in')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiOperation({ summary: 'Check in a ticket using QR code' })
  @ApiResponse({ status: 201, description: 'Check-in processed', type: CheckInResponseDto })
  async checkIn(@Body() dto: CheckInDto): Promise<CheckInResponseDto> {
    return this.accessService.checkIn(dto);
  }

  @Post('refresh-qr/:ticketId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refresh QR code for a ticket (generates new token)' })
  @ApiResponse({ status: 201, description: 'QR code refreshed successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async refreshQrCode(@Param('ticketId') ticketId: string) {
    return this.accessService.refreshQrCode(ticketId);
  }

  @Get('tickets/user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all tickets for a user' })
  @ApiResponse({ status: 200, description: 'User tickets retrieved successfully' })
  async getUserTickets(@Param('userId') userId: string) {
    return this.accessService.getUserTickets(userId);
  }
}

