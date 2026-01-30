import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EventsService } from './services/events.service';
import { SeatsService } from './services/seats.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly seatsService: SeatsService,
  ) {}

  /**
   * CREATE EVENT - Organizer only
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: any
  ) {
    const organizerId = req.user.id;
    return await this.eventsService.create(createEventDto, organizerId);
  }

  /**
   * GET ALL EVENTS - Public marketplace with filters
   * No auth required - public access
   */
  @Get()
  async findAll(@Query() filterDto: FilterEventDto) {
    return await this.eventsService.findAll(filterDto);
  }

  /**
   * GET ORGANIZER'S EVENTS - Dashboard
   * Organizer only - view own events
   */
  @Get('my-events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  async findMyEvents(
    @Query() filterDto: FilterEventDto,
    @Req() req: any
  ) {
    const organizerId = req.user.id;
    return await this.eventsService.findAll(filterDto, organizerId);
  }

  /**
   * GET FEATURED EVENTS - Homepage
   * No auth required - public access
   */
  @Get('featured')
  async getFeatured(@Query('limit') limit?: number) {
    return await this.eventsService.getFeatured(limit || 6);
  }

  /**
   * GET SINGLE EVENT - Details page
   * No auth required - public access
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.eventsService.findOne(id);
  }

  /**
   * GET EVENT SEATS - View available seats for booking
   * No auth required - public access for seat map viewing
   */
  @Get(':id/seats')
  async getEventSeats(@Param('id') id: string) {
    const seats = await this.seatsService.findByEventId(id);
    return {
      eventId: id,
      totalSeats: seats.length,
      seats,
    };
  }

  /**
   * GET SEAT STATISTICS - Dashboard analytics for organizers
   * Organizer only - must own the event
   */
  @Get(':id/seats/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  async getSeatStatistics(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const organizerId = req.user.id;
    
    // Verify ownership
    const event = await this.eventsService.findOne(id);
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You can only view statistics for your own events');
    }

    return await this.seatsService.getSeatStatistics(id);
  }

  /**
   * GET EVENT STATISTICS - Dashboard analytics
   * Organizer only - must own the event
   */
  @Get(':id/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  async getStats(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const organizerId = req.user.id;

    // Verify ownership
    const event = await this.eventsService.findOne(id);
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You can only view statistics for your own events');
    }

    return await this.eventsService.getStats(id, organizerId);
  }

  /**
   * UPDATE EVENT - Organizer only
   * Must own the event to update it
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: any
  ) {
    const organizerId = req.user.id;
    return await this.eventsService.update(id, updateEventDto, organizerId);
  }

  /**
   * UPDATE EVENT STATUS - Publish/Cancel/Complete
   * Organizer only - must own the event
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateEventStatusDto,
    @Req() req: any
  ) {
    const organizerId = req.user.id;
    
    if (dto.status == null) {
      throw new BadRequestException('status is required');
    }
    
    return await this.eventsService.updateStatus(id, dto.status, organizerId);
  }

  /**
   * DELETE EVENT - Organizer only (only if no reservations)
   * Must own the event to delete it
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  async remove(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const organizerId = req.user.id;
    return await this.eventsService.remove(id, organizerId);
  }
}