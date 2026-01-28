// File: src/events/events.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual, Like } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { EventStatus } from './enums/event-status.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  /**
   * Create a new event (organizer only)
   */
  async create(createEventDto: CreateEventDto, organizerId: string): Promise<Event> {
    // Validate seating plan capacity matches total capacity
    const totalSeatsInPlan = this.calculateTotalCapacity(createEventDto.seatingPlan);

    if (totalSeatsInPlan !== createEventDto.totalCapacity) {
      throw new BadRequestException(
        `Seating plan capacity (${totalSeatsInPlan}) doesn't match total capacity (${createEventDto.totalCapacity})`
      );
    }

    // Validate sales dates
    if (createEventDto.salesStartDate && createEventDto.salesEndDate) {
      if (createEventDto.salesStartDate >= createEventDto.salesEndDate) {
        throw new BadRequestException('Sales start date must be before sales end date');
      }
    }

    const event = this.eventRepository.create({
      ...createEventDto,
      organizerId,
      availableSeats: createEventDto.totalCapacity,
      status: EventStatus.DRAFT,
    });

    return await this.eventRepository.save(event);
  }

  /**
   * Get all events with filters (public marketplace)
   */
  async findAll(filterDto: FilterEventDto) {
    const {
      search,
      category,
      status,
      city,
      dateFrom,
      dateTo,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10
    } = filterDto;

    const queryBuilder = this.eventRepository.createQueryBuilder('event');

    // Only show published events in public marketplace
    queryBuilder.where('event.status = :status', { status: EventStatus.PUBLISHED });

    // Search in title and description
    if (search) {
      queryBuilder.andWhere(
        '(LOWER(event.title) LIKE LOWER(:search) OR LOWER(event.description) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    // Filter by category
    if (category) {
      queryBuilder.andWhere('event.category = :category', { category });
    }

    // Filter by city
    if (city) {
      queryBuilder.andWhere('LOWER(event.city) = LOWER(:city)', { city });
    }

    // Filter by date range
    if (dateFrom) {
      queryBuilder.andWhere('event.date >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      queryBuilder.andWhere('event.date <= :dateTo', { dateTo });
    }

    // Filter by price range
    if (minPrice !== undefined) {
      queryBuilder.andWhere('event.basePrice >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('event.basePrice <= :maxPrice', { maxPrice });
    }

    // Order by date (upcoming events first)
    queryBuilder.orderBy('event.date', 'ASC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [events, total] = await queryBuilder.getManyAndCount();

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all events by organizer (dashboard)
   */
  async findByOrganizer(organizerId: string, filterDto: FilterEventDto) {
    const { status, page = 1, limit = 10 } = filterDto;

    const queryBuilder = this.eventRepository.createQueryBuilder('event');

    queryBuilder.where('event.organizerId = :organizerId', { organizerId });

    if (status) {
      queryBuilder.andWhere('event.status = :status', { status });
    }

    queryBuilder.orderBy('event.createdAt', 'DESC');

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [events, total] = await queryBuilder.getManyAndCount();

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single event by ID
   */
  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  /**
   * Update an event (organizer only)
   */
  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    organizerId: string
  ): Promise<Event> {
    const event = await this.findOne(id);

    // Check if the organizer owns this event
    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You are not authorized to update this event');
    }

    // If updating seating plan, validate capacity
    if (updateEventDto.seatingPlan) {
      const totalSeatsInPlan = this.calculateTotalCapacity(updateEventDto.seatingPlan);
      const newTotalCapacity = updateEventDto.totalCapacity || event.totalCapacity;

      if (totalSeatsInPlan !== newTotalCapacity) {
        throw new BadRequestException(
          `Seating plan capacity (${totalSeatsInPlan}) doesn't match total capacity (${newTotalCapacity})`
        );
      }
    }

    // Don't allow changing capacity if there are reservations
    if (updateEventDto.totalCapacity && event.availableSeats !== event.totalCapacity) {
      throw new BadRequestException(
        'Cannot change capacity after reservations have been made'
      );
    }

    Object.assign(event, updateEventDto);

    return await this.eventRepository.save(event);
  }

  /**
   * Update event status (publish, cancel, etc.)
   */
  async updateStatus(
    id: string,
    status: EventStatus,
    organizerId: string
  ): Promise<Event> {
    const event = await this.findOne(id);

    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You are not authorized to update this event');
    }

    // Validate status transitions
    if (status === EventStatus.PUBLISHED && event.status === EventStatus.DRAFT) {
      // Check if event has all required information
      if (!event.seatingPlan || !event.date || !event.basePrice) {
        throw new BadRequestException(
          'Event must have seating plan, date, and price before publishing'
        );
      }
    }

    event.status = status;
    return await this.eventRepository.save(event);
  }

  /**
   * Delete an event (soft delete or prevent if has reservations)
   */
  async remove(id: string, organizerId: string): Promise<void> {
    const event = await this.findOne(id);

    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You are not authorized to delete this event');
    }

    // Only allow deletion if no tickets sold
    if (event.availableSeats !== event.totalCapacity) {
      throw new BadRequestException(
        'Cannot delete event with existing reservations. Cancel the event instead.'
      );
    }

    await this.eventRepository.remove(event);
  }

  /**
   * Update available seats (called by reservations module)
   */
  async updateAvailableSeats(eventId: string, seatsToReserve: number): Promise<Event> {
    const event = await this.findOne(eventId);

    if (event.availableSeats < seatsToReserve) {
      throw new BadRequestException('Not enough seats available');
    }

    event.availableSeats -= seatsToReserve;

    // Auto-update status to sold out if no seats left
    if (event.availableSeats === 0) {
      event.status = EventStatus.SOLD_OUT;
    }

    return await this.eventRepository.save(event);
  }

  /**
   * Release seats (called when reservation is cancelled)
   */
  async releaseSeats(eventId: string, seatsToRelease: number): Promise<Event> {
    const event = await this.findOne(eventId);

    event.availableSeats += seatsToRelease;

    // Remove sold_out status if seats become available again
    if (event.status === EventStatus.SOLD_OUT && event.availableSeats > 0) {
      event.status = EventStatus.PUBLISHED;
    }

    return await this.eventRepository.save(event);
  }

  /**
   * Get event statistics (for organizer dashboard)
   */
  async getEventStats(eventId: string, organizerId: string) {
    const event = await this.findOne(eventId);

    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You are not authorized to view this event stats');
    }

    const soldSeats = event.totalCapacity - event.availableSeats;
    const occupancyRate = (soldSeats / event.totalCapacity) * 100;

    return {
      eventId: event.id,
      title: event.title,
      status: event.status,
      totalCapacity: event.totalCapacity,
      availableSeats: event.availableSeats,
      soldSeats,
      occupancyRate: occupancyRate.toFixed(2),
      revenue: (soldSeats * event.basePrice).toFixed(2), // Simplified calculation
    };
  }

  /**
   * Get top/featured events (for marketplace homepage)
   */
  async getFeaturedEvents(limit: number = 6): Promise<Event[]> {
    return await this.eventRepository.find({
      where: { status: EventStatus.PUBLISHED },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Calculate total capacity from seating plan
   */
  private calculateTotalCapacity(seatingPlan: any): number {
    if (!seatingPlan || !seatingPlan.sections) {
      return 0;
    }

    return seatingPlan.sections.reduce((total: number, section: any) => {
      return total + (section.capacity || 0);
    }, 0);
  }
}