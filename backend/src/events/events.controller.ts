// File: src/events/events.controller.ts

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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { EventStatus } from './enums/event-status.enum';

// TODO: Uncomment when auth module is ready
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * CREATE EVENT - Organizer only
   * POST /events
   */
  @Post()
  @ApiOperation({ summary: 'Create a new event (Organizer only)' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  // TODO: Uncomment when auth is ready
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ORGANIZER')
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: any // TODO: Replace with proper Request type
  ) {
    // TODO: Get organizerId from JWT token
    // const organizerId = req.user.id;
    const organizerId = 'temp-organizer-id'; // Temporary for testing

    return await this.eventsService.create(createEventDto, organizerId);
  }

  /**
   * GET ALL EVENTS - Public marketplace with filters
   * GET /events
   */
  @Get()
  @ApiOperation({ summary: 'Get all published events (Public marketplace)' })
  @ApiResponse({ status: 200, description: 'Events retrieved successfully' })
  async findAll(@Query() filterDto: FilterEventDto) {
    return await this.eventsService.findAll(filterDto);
  }

  /**
   * GET ORGANIZER'S EVENTS - Dashboard
   * GET /events/my-events
   */
  @Get('my-events')
  @ApiOperation({ summary: 'Get all events by organizer (Dashboard)' })
  @ApiResponse({ status: 200, description: 'Organizer events retrieved' })
  @ApiBearerAuth()
  // TODO: Uncomment when auth is ready
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ORGANIZER')
  async findMyEvents(
    @Query() filterDto: FilterEventDto,
    @Req() req: any
  ) {
    // TODO: Get organizerId from JWT token
    // const organizerId = req.user.id;
    const organizerId = 'temp-organizer-id'; // Temporary

    return await this.eventsService.findByOrganizer(organizerId, filterDto);
  }

  /**
   * GET FEATURED EVENTS - Homepage
   * GET /events/featured
   */
  @Get('featured')
  @ApiOperation({ summary: 'Get featured events for homepage' })
  @ApiResponse({ status: 200, description: 'Featured events retrieved' })
  async getFeatured(@Query('limit') limit?: number) {
    return await this.eventsService.getFeaturedEvents(limit || 6);
  }

  /**
   * GET SINGLE EVENT - Details page
   * GET /events/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID (Public)' })
  @ApiResponse({ status: 200, description: 'Event retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: string) {
    return await this.eventsService.findOne(id);
  }

  /**
   * UPDATE EVENT - Organizer only
   * PATCH /events/:id
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update event (Organizer only)' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the organizer' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiBearerAuth()
  // TODO: Uncomment when auth is ready
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ORGANIZER')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: any
  ) {
    // TODO: Get organizerId from JWT token
    const organizerId = 'temp-organizer-id'; // Temporary

    return await this.eventsService.update(id, updateEventDto, organizerId);
  }

  /**
   * UPDATE EVENT STATUS - Publish/Cancel/Complete
   * PATCH /events/:id/status
   */
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update event status (Organizer only)' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiBearerAuth()
  // TODO: Uncomment when auth is ready
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ORGANIZER')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: EventStatus,
    @Req() req: any
  ) {
    const organizerId = 'temp-organizer-id'; // Temporary
    return await this.eventsService.updateStatus(id, status, organizerId);
  }

  /**
   * GET EVENT STATISTICS - Dashboard analytics
   * GET /events/:id/stats
   */
  @Get(':id/stats')
  @ApiOperation({ summary: 'Get event statistics (Organizer only)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  @ApiBearerAuth()
  // TODO: Uncomment when auth is ready
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ORGANIZER')
  async getStats(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const organizerId = 'temp-organizer-id'; // Temporary
    return await this.eventsService.getEventStats(id, organizerId);
  }

  /**
   * DELETE EVENT - Organizer only (only if no reservations)
   * DELETE /events/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete event (Organizer only, no reservations)' })
  @ApiResponse({ status: 204, description: 'Event deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete - has reservations' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the organizer' })
  @ApiBearerAuth()
  // TODO: Uncomment when auth is ready
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ORGANIZER')
  async remove(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const organizerId = 'temp-organizer-id'; // Temporary
    return await this.eventsService.remove(id, organizerId);
  }

  // TODO
  /**
   * INTERNAL ENDPOINT - Update available seats (Called by Reservations module)
   * PATCH /events/:id/seats/reserve
   */
  @Patch(':id/seats/reserve')
  @ApiOperation({ summary: 'Reserve seats (Internal use by Reservations module)' })
  async reserveSeats(
    @Param('id') id: string,
    @Body('seats') seats: number
  ) {
    return await this.eventsService.updateAvailableSeats(id, seats);
  }

  /**
   * INTERNAL ENDPOINT - Release seats (Called by Reservations module)
   * PATCH /events/:id/seats/release
   */
  @Patch(':id/seats/release')
  @ApiOperation({ summary: 'Release seats (Internal use by Reservations module)' })
  async releaseSeats(
    @Param('id') id: string,
    @Body('seats') seats: number
  ) {
    return await this.eventsService.releaseSeats(id, seats);
  }
}