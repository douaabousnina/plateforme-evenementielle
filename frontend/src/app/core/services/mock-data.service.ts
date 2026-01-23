import { Injectable } from '@angular/core';
import { Event } from '../../features/reservation/models/event.model';
import { Seat } from '../../features/reservation/models/reservation.model';
import { Reservation } from '../../features/reservation/services/reservation.service';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  private mockEvents: Event[] = [
    {
      id: '1',
      title: 'The Weeknd Concert',
      type: 'Concert',
      venue: 'Madison Square Garden, NYC',
      date: new Date('2026-02-14'),
      time: '20:00',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop',
      description: 'Experience the ultimate concert performance with The Weeknd live at MSG'
    },
    {
      id: '2',
      title: 'Taylor Swift Eras Tour',
      type: 'Concert',
      venue: 'SoFi Stadium, LA',
      date: new Date('2026-03-20'),
      time: '19:00',
      imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=300&fit=crop',
      description: 'The legendary Eras Tour featuring all of Taylor Swift\'s iconic performances'
    },
    {
      id: '3',
      title: 'Coldplay Live',
      type: 'Concert',
      venue: 'Wembley Stadium, London',
      date: new Date('2026-04-10'),
      time: '20:30',
      imageUrl: 'https://images.unsplash.com/photo-1501386450010-9e10fce17a8c?w=500&h=300&fit=crop',
      description: 'Coldplay brings their energy to Wembley for an unforgettable night'
    },
    {
      id: '4',
      title: 'Billie Eilish Happier Tour',
      type: 'Concert',
      venue: 'Staples Center, LA',
      date: new Date('2026-05-05'),
      time: '19:30',
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=300&fit=crop',
      description: 'Billie Eilish\'s Happier Than Ever world tour with exclusive setlist'
    },
    {
      id: '5',
      title: 'The Rolling Stones Celebration',
      type: 'Concert',
      venue: 'Allegiant Stadium, Las Vegas',
      date: new Date('2026-06-15'),
      time: '20:00',
      imageUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=300&fit=crop',
      description: 'A legendary celebration of The Rolling Stones\' greatest hits'
    }
  ];

  // Store created reservations in memory for retrieval
  private mockReservations: Map<string, Reservation> = new Map();

  getEvents(): Event[] {
    return this.mockEvents;
  }

  getEventById(id: string): Event | undefined {
    return this.mockEvents.find(event => event.id === id);
  }

  getSeatsByEventId(eventId: string): Seat[] {
    const seats: Seat[] = [];
    const sections = ['Fosse Or', 'Catégorie 1', 'Balcon'];
    const pricing = { 'Fosse Or': 150, 'Catégorie 1': 95, 'Balcon': 65 };
    const rows = 3;
    const seatsPerRow = 15;
    let seatId = 0;

    for (const section of sections) {
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= seatsPerRow; col++) {
          seatId++;
          seats.push({
            id: `${eventId}-seat-${seatId}`,
            row: String.fromCharCode(64 + row),
            number: col,
            section,
            price: pricing[section as keyof typeof pricing] || 100,
            status: Math.random() > 0.8 ? 'sold' : 'available',
            category: section
          });
        }
      }
    }

    return seats;
  }

  createReservation(eventId: string, seatIds: string[]): Reservation {
    const seats = this.getSeatsByEventId(eventId);
    const selectedSeats = seats.filter(s => seatIds.includes(s.id));
    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    const reservation: Reservation = {
      id: `RES-${Date.now()}`,
      userId: 'sample-user-id',
      eventId,
      seats: selectedSeats.map(s => ({
        seatId: s.id,
        price: s.price,
        status: 'LOCKED' as const
      })),
      totalPrice,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    };

    // Store reservation in memory for later retrieval
    this.mockReservations.set(reservation.id, reservation);
    console.log('MockDataService: Created reservation:', reservation.id);

    return reservation;
  }

  getReservationById(reservationId: string): Reservation | undefined {
    console.log('MockDataService: Getting reservation:', reservationId);
    const reservation = this.mockReservations.get(reservationId);
    if (reservation) {
      console.log('MockDataService: Found reservation:', reservation);
    } else {
      console.log('MockDataService: Reservation not found in cache');
    }
    return reservation;
  }

  confirmReservation(reservationId: string): Reservation {
    const existingReservation = this.mockReservations.get(reservationId);

    const confirmedReservation: Reservation = {
      id: reservationId,
      userId: existingReservation?.userId || 'sample-user-id',
      eventId: existingReservation?.eventId || '1',
      seats: existingReservation?.seats || [],
      totalPrice: existingReservation?.totalPrice || 0,
      status: 'CONFIRMED',
      expiresAt: new Date()
    };

    // Update reservation in storage
    this.mockReservations.set(reservationId, confirmedReservation);

    return confirmedReservation;
  }
}
