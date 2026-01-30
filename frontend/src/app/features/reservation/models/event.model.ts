// Event enums matching backend
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

// Location model matching backend
export interface Location {
  id: string;
  type: LocationType;
  address?: string;
  venueName?: string;
  city?: string;
  country?: string;
  onlineUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Event model matching backend
export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  category: EventCategory;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  locationId?: string;
  location?: Location;
  coverImage?: string;
  gallery?: string[];
  totalCapacity?: number;
  availableCapacity?: number;
  hasSeatingPlan: boolean;
  status: EventStatus;
  organizerId: string;
  createdAt?: string;
  updatedAt?: string;
}
