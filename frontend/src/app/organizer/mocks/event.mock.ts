import { EventsResponse } from '../models/event.models';

export const MOCK_EVENTS_DATA: EventsResponse = {
  events: [
    {
      id: '1',
      title: 'Festival Électro Night',
      description: 'Une soirée électro inoubliable avec les meilleurs DJs',
      location: 'Paris, France',
      startDate: new Date('2023-12-12T20:00:00'),
      endDate: new Date('2023-12-13T04:00:00'),
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
      status: 'PUBLISHED',
      totalSeats: 500,
      availableSeats: 45
    },
    {
      id: '2',
      title: 'Concert Jazz Live',
      description: 'Concert de jazz avec des artistes renommés',
      location: 'Lyon, France',
      startDate: new Date('2023-12-15T19:00:00'),
      endDate: new Date('2023-12-15T23:00:00'),
      image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400',
      status: 'PUBLISHED',
      totalSeats: 300,
      availableSeats: 234
    },
    {
      id: '3',
      title: 'Stand-up Comedy Show',
      description: 'Une soirée remplie de rires avec les meilleurs humoristes',
      location: 'Marseille, France',
      startDate: new Date('2023-12-18T20:30:00'),
      endDate: new Date('2023-12-18T23:00:00'),
      image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400',
      status: 'SOLD_OUT',
      totalSeats: 200,
      availableSeats: 0
    },
    {
      id: '4',
      title: 'Théâtre Musical',
      description: 'Spectacle musical grandiose',
      location: 'Bordeaux, France',
      startDate: new Date('2023-12-20T19:30:00'),
      endDate: new Date('2023-12-20T22:30:00'),
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400',
      status: 'PUBLISHED',
      totalSeats: 400,
      availableSeats: 156
    },
    {
      id: '5',
      title: 'Festival Rock 2023',
      description: 'Le plus grand festival de rock de la région',
      location: 'Toulouse, France',
      startDate: new Date('2023-12-22T18:00:00'),
      endDate: new Date('2023-12-23T02:00:00'),
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
      status: 'PUBLISHED',
      totalSeats: 1000,
      availableSeats: 23
    },
    {
      id: '6',
      title: 'Conférence Tech 2024',
      description: 'Conférence sur les dernières technologies',
      location: 'Nice, France',
      startDate: new Date('2024-01-10T09:00:00'),
      endDate: new Date('2024-01-10T18:00:00'),
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      status: 'DRAFT',
      totalSeats: 150,
      availableSeats: 150
    }
  ],
  total: 6
};