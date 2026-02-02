// Enums matching backend
export enum EventType {
  CONFERENCE = 'conference',
  CONCERT = 'concert',
  WORKSHOP = 'workshop',
  FESTIVAL = 'festival',
  SEMINAR = 'seminar',
  EXHIBITION = 'exhibition',
  NETWORKING = 'networking',
  SPORTS = 'sports',
  OTHER = 'other',
}

export enum EventCategory {
  CONCERT = 'concert',
  CONFERENCE = 'conference',
  SPORT = 'sport',
  THEATER = 'theater',
  FESTIVAL = 'festival',
  EXHIBITION = 'exhibition',
  WORKSHOP = 'workshop',
  NETWORKING = 'networking',
  OTHER = 'other',
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SOLD_OUT = 'sold_out',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum LocationType {
  PHYSICAL = 'physical',
  ONLINE = 'online',
  TBD = 'tbd',
}

// COMMENTED OUT - Tickets managed via Seats after event creation
// export enum TicketTypeEnum {
//   VIP = 'vip',
//   REGULAR = 'regular',
//   EARLY_BIRD = 'early_bird',
// }

export interface CreateLocationRequest {
  type: LocationType | string;
  address?: string;
  venueName?: string;
  city?: string;
  country?: string;
  onlineUrl?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  type: string;
  category: string;
  startDate: string; // ISO datetime string
  startTime: string; // ISO datetime string
  endDate: string; // ISO datetime string
  endTime: string; // ISO datetime string
  location: CreateLocationRequest;
  coverImage?: string;
  gallery?: string[];
  totalCapacity: number;
  availableCapacity: number;
  hasSeatingPlan: boolean;
  organizerId: string;
}

export enum CreationStep {
  GENERAL_INFO = 1,
  TICKETING = 2
}


