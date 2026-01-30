import { DataSource } from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { Location } from '../../events/entities/location.entity';
import { User } from '../../users/entities/user.entity';
import { EventCategory, EventStatus, EventType } from '../../common/enums/event.enum';
import { Role } from 'src/common/enums/role.enum';

export async function seedEvents(
  dataSource: DataSource,
  locations: Location[],
  users: User[],
): Promise<Event[]> {
  const repo = dataSource.getRepository(Event);
  const [loc0, loc1, loc2, loc3, loc4] = locations;

  // Find an organizer user (role: ORGANIZER)
  const organizer = users.find((u) => u.role === Role.ORGANIZER) || users[0];
  const organizerId = organizer?.id?.toString() || '1';

  const baseDate = new Date('2026-06-01T19:00:00');
  const events = repo.create([
    {
      title: 'Summer Music Festival 2026',
      description: 'Annual outdoor music festival with multiple stages.',
      type: EventType.FESTIVAL,
      category: EventCategory.FESTIVAL,
      startDate: baseDate,
      startTime: baseDate,
      endDate: new Date('2026-06-03T23:00:00'),
      endTime: new Date('2026-06-03T23:00:00'),
      locationId: loc0?.id,
      coverImage: 'https://example.com/festival.jpg',
      gallery: [],
      totalCapacity: 135,
      availableCapacity: 135,
      hasSeatingPlan: true,
      status: EventStatus.PUBLISHED,
      organizerId,
    },
    {
      title: 'Tech Conference 2026',
      description: 'Two-day tech conference with keynotes and workshops.',
      type: EventType.CONFERENCE,
      category: EventCategory.CONFERENCE,
      startDate: new Date('2026-03-20T09:00:00'),
      startTime: new Date('2026-03-20T09:00:00'),
      endDate: new Date('2026-03-21T18:00:00'),
      endTime: new Date('2026-03-21T18:00:00'),
      locationId: loc1?.id,
      totalCapacity: 200,
      availableCapacity: 200,
      hasSeatingPlan: true,
      status: EventStatus.PUBLISHED,
      organizerId,
    },
    {
      title: 'Jazz Night',
      description: 'An evening of live jazz at Blue Note.',
      type: EventType.CONCERT,
      category: EventCategory.CONCERT,
      startDate: new Date('2026-04-10T20:00:00'),
      startTime: new Date('2026-04-10T20:00:00'),
      endDate: new Date('2026-04-10T23:00:00'),
      endTime: new Date('2026-04-10T23:00:00'),
      locationId: loc2?.id,
      totalCapacity: 135,
      availableCapacity: 135,
      hasSeatingPlan: true,
      status: EventStatus.PUBLISHED,
      organizerId,
    },
    {
      title: 'Comedy Show Spectacular',
      description: 'Stand-up comedy night with top comedians.',
      type: EventType.OTHER,
      category: EventCategory.THEATER,
      startDate: new Date('2026-05-05T20:00:00'),
      startTime: new Date('2026-05-05T20:00:00'),
      endDate: new Date('2026-05-05T22:30:00'),
      endTime: new Date('2026-05-05T22:30:00'),
      locationId: loc3?.id,
      totalCapacity: 135,
      availableCapacity: 135,
      hasSeatingPlan: true,
      status: EventStatus.PUBLISHED,
      organizerId,
    },
    {
      title: 'Classical Orchestra Performance',
      description: 'An evening of classical music.',
      type: EventType.CONCERT,
      category: EventCategory.CONCERT,
      startDate: new Date('2026-07-22T19:30:00'),
      startTime: new Date('2026-07-22T19:30:00'),
      endDate: new Date('2026-07-22T22:00:00'),
      endTime: new Date('2026-07-22T22:00:00'),
      locationId: loc4?.id,
      totalCapacity: 150,
      availableCapacity: 150,
      hasSeatingPlan: true,
      status: EventStatus.PUBLISHED,
      organizerId,
    },
  ]);
  return repo.save(events);
}
