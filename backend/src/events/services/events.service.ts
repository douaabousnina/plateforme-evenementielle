import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { EventStatus } from '../../common/enums/event.enum';
import { FilterEventDto } from '../dto/filter-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) { }

  async create(createEventDto: CreateEventDto, organizerId: string): Promise<Event> {
    this.validateDates(
      createEventDto.startDate,
      createEventDto.startTime,
      createEventDto.endDate,
      createEventDto.endTime,
    );

    if (createEventDto.hasSeatingPlan) {
      if (createEventDto.availableCapacity > createEventDto.totalCapacity)
        throw new BadRequestException("Availabe capacity should not be bigger than total capacity.");
    }

    return this.eventRepository.save({
      ...createEventDto,
      organizerId,
      status: EventStatus.DRAFT,
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto, organizerId): Promise<Event> {
    const event = await this.findOne(id);

    if (event.organizerId !== organizerId)
      throw new BadRequestException("Only the organizer of this event can update it.")

    if (updateEventDto.startDate || updateEventDto.endDate || updateEventDto.startTime || updateEventDto.endTime) {
      this.validateDates(
        updateEventDto.startDate || event.startDate,
        updateEventDto.startTime || event.startTime,
        updateEventDto.endDate || event.endDate,
        updateEventDto.endTime || event.endTime,
      );
    }

    if (updateEventDto.hasSeatingPlan || event.hasSeatingPlan)
      if ((updateEventDto.availableCapacity || event.availableCapacity) > (updateEventDto.totalCapacity || event.totalCapacity))
        throw new BadRequestException("Availabe capacity should not be bigger than total capacity.");

    return this.eventRepository.save({ ...event, ...updateEventDto });
  }

  async updateStatus(id: string, status:EventStatus, organizerId:string) : Promise<Event> {
    const event = await this.findOne(id);

    if (event.organizerId !== organizerId)
      throw new BadRequestException("Only the organizer of this event can update it.")

    return this.eventRepository.save({ ...event, status });
  }

  async remove(id: string, organizerId: string) {
    const event = await this.findOne(id);

    if (event.organizerId !== organizerId)
      throw new BadRequestException("Only the organizer of this event can delete it.")

    if (event.hasSeatingPlan && event.availableCapacity !== event.totalCapacity) {
      throw new BadRequestException('Cannot delete event with existing reservations. Cancel it instead.');
    }

    await this.eventRepository.remove(event);
  }

  async updateCapacity(eventId: string, quantity: number): Promise<Event> {
    const event = await this.findOne(eventId);

    if (!event.hasSeatingPlan) {
      throw new BadRequestException('This event has no seating plan / capacity limits');
    }

    if (event.availableCapacity < quantity) {
      throw new BadRequestException('Not enough capacity available');
    }

    event.availableCapacity -= quantity;
    return this.eventRepository.save(event);
  }

  async releaseCapacity(eventId: string, quantity: number): Promise<Event> {
    const event = await this.findOne(eventId);

    if (!event.hasSeatingPlan) {
      throw new BadRequestException('This event has no seating plan / capacity limits');
    }

    if (event.availableCapacity + quantity > event.totalCapacity) {
      throw new BadRequestException(
        `Cannot release ${quantity} seats: it would exceed the event's total capacity of ${event.totalCapacity}`
      );
    }

    event.availableCapacity += quantity;

    return this.eventRepository.save(event);
  }


  async getStats(eventId: string, organizerId: string) {
    const event = await this.findOne(eventId);

    if (event.organizerId !== organizerId)
      throw new BadRequestException("Only the organizer of this event can see its stats")

    if (!event.hasSeatingPlan) {
      return {
        eventId: event.id,
        title: event.title,
        status: event.status,
        message: 'No capacity tracking for this event type',
      };
    }

    const sold = event.totalCapacity - event.availableCapacity;
    const occupancyRate = (sold / event.totalCapacity) * 100;

    return {
      eventId: event.id,
      title: event.title,
      status: event.status,
      totalCapacity: event.totalCapacity,
      availableCapacity: event.availableCapacity,
      sold,
      occupancyRate: occupancyRate.toFixed(2),
    };
  }


  async findAll( filterDto: FilterEventDto, organizerId?: string): Promise<Event[]> {
    const {
      search,
      category,
      status,
      city,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
    } = filterDto;

    const skip = (page - 1) * limit;

    const baseWhere: any = {};
    if (organizerId) baseWhere.organizerId = organizerId;
    baseWhere.status = status || EventStatus.PUBLISHED;
    if (category) baseWhere.category = category;
    if (city) baseWhere.location = { city };

    if (dateFrom && dateTo) {
      baseWhere.startDate = Between(dateFrom, dateTo);
    } else if (dateFrom) {
      baseWhere.startDate = Between(dateFrom, new Date('9999-12-31'));
    } else if (dateTo) {
      baseWhere.startDate = Between(new Date('1900-01-01'), dateTo);
    }

    let where = baseWhere;
    if (search) {
      where = [
        { ...baseWhere, title: ILike(`%${search}%`) },
        { ...baseWhere, description: ILike(`%${search}%`) },
      ];
    }

    return this.eventRepository.find({
      where,
      relations: ['location', 'seats'],
      order: { startDate: 'ASC' },
      take: limit,
      skip,
    });
  }


  // for users:
  async getFeatured(limit = 6): Promise<Event[]> {
    return this.eventRepository.find({
      where: { status: EventStatus.PUBLISHED },
      relations: ['location', 'seats'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }


  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['location', 'seats'],
    });

    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);

    return event;
  }

  private validateDates(startDate: Date, startTime: Date, endDate: Date, endTime: Date): void {
    const start = new Date(`${startDate.toISOString().split('T')[0]}T${startTime.toISOString().split('T')[1]}`);
    const end = new Date(`${endDate.toISOString().split('T')[0]}T${endTime.toISOString().split('T')[1]}`);

    if (start >= end) {
      throw new BadRequestException('Event start date/time must be before end date/time');
    }
  }
}
