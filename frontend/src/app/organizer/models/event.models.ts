
export interface Event{
    id: string;
    title: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
    image: string;
    status: EventStatus;
    totalSeats: number;
    availableSeats: number;
}
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'SOLD_OUT';

export interface EventsResponse {
  events: Event[];
  total: number;
}