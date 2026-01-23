import { Injectable } from '@nestjs/common';
import { EventsService } from '../events/events.service';

@Injectable()
export class SeedService {
  constructor(private eventsService: EventsService) {}

  async seed(): Promise<void> {
    console.log('🌱 Starting database seeding...');
    
    try {
      await this.eventsService.seed();
      console.log('✓ Database seeding completed successfully');
    } catch (error) {
      console.error('✗ Error seeding database:', error);
      throw error;
    }
  }
}
