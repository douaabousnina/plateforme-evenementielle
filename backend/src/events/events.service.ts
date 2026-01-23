import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { SeatsService } from './seats.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private seatsService: SeatsService,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  async findById(id: string): Promise<Event | null> {
    return this.eventsRepository.findOne({ where: { id } });
  }

  async create(event: Partial<Event>): Promise<Event> {
    const newEvent = this.eventsRepository.create(event);
    return this.eventsRepository.save(newEvent);
  }

  async update(id: string, event: Partial<Event>): Promise<Event | null> {
    await this.eventsRepository.update(id, event);
    return this.findById(id);
  }

  async seed(): Promise<void> {
    const count = await this.eventsRepository.count();
    
    if (count === 0) {
      const mockEvents = [
        {
          name: 'The Weeknd Concert',
          description: 'Live performance featuring hits from After Hours and Dawn FM',
          date: new Date('2024-06-15'),
          location: 'Madison Square Garden, New York',
          totalSeats: 20000,
          sections: ['Cat1', 'Cat2', 'Balcony'],
          imageUrl: 'https://via.placeholder.com/400x300?text=The+Weeknd',
        },
        {
          name: 'Taylor Swift Eras Tour',
          description: 'Epic concert celebrating all eras of Taylor Swift\'s career',
          date: new Date('2024-07-22'),
          location: 'MetLife Stadium, New Jersey',
          totalSeats: 82500,
          sections: ['Cat1', 'Cat2', 'Balcony', 'Pit'],
          imageUrl: 'https://via.placeholder.com/400x300?text=Taylor+Swift',
        },
        {
          name: 'Coldplay Live',
          description: 'Music of the Spheres World Tour - An epic performance',
          date: new Date('2024-08-10'),
          location: 'Soldier Field, Chicago',
          totalSeats: 61500,
          sections: ['Cat1', 'Cat2', 'Balcony'],
          imageUrl: 'https://via.placeholder.com/400x300?text=Coldplay',
        },
        {
          name: 'Billie Eilish Happier Tour',
          description: 'Intimate and powerful performances from Billie Eilish',
          date: new Date('2024-09-05'),
          location: 'Crypto.com Arena, Los Angeles',
          totalSeats: 20000,
          sections: ['Cat1', 'Cat2', 'Balcony'],
          imageUrl: 'https://via.placeholder.com/400x300?text=Billie+Eilish',
        },
        {
          name: 'The Rolling Stones Celebration',
          description: 'A celebration of decades of iconic music and performances',
          date: new Date('2024-10-12'),
          location: 'Oracle Park, San Francisco',
          totalSeats: 41915,
          sections: ['Cat1', 'Cat2', 'Balcony'],
          imageUrl: 'https://via.placeholder.com/400x300?text=Rolling+Stones',
        },
      ];

      for (const event of mockEvents) {
        const savedEvent = await this.create({
          ...event,
          availableSeats: event.totalSeats,
        });
        await this.seatsService.generateSeatsForEvent(savedEvent);
      }

      console.log('✓ Seeded 5 mock events with all seats');
    }
  }
}
