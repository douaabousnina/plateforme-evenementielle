import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Event } from '../models/event.model';


//! temporaire 
@Injectable({ providedIn: 'root' })
export class EventService {
    currentEvent = signal<Event | null>(null);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    private readonly mockEvents: Event[] = [
        {
            id: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Summer Music Festival 2026',
            location: 'Central Park Arena',
            date: new Date('2026-06-15'),
            totalSeats: 100,
            imageUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce6a9c?q=80&w=2070&auto=format&fit=crop'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440002',
            name: 'Tech Conference 2026',
            location: 'Convention Center',
            date: new Date('2026-03-20'),
            totalSeats: 200,
            imageUrl: 'https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?q=80&w=2070&auto=format&fit=crop'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440003',
            name: 'Jazz Night',
            location: 'Blue Note Club',
            date: new Date('2026-04-10'),
            totalSeats: 50,
            imageUrl: 'https://images.unsplash.com/photo-1511192303578-4a7b974a429b?q=80&w=2070&auto=format&fit=crop'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440004',
            name: 'Comedy Show Spectacular',
            location: 'Laugh Factory',
            date: new Date('2026-05-05'),
            totalSeats: 75,
            imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=2070&auto=format&fit=crop'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440005',
            name: 'Classical Orchestra Performance',
            location: 'Symphony Hall',
            date: new Date('2026-07-22'),
            totalSeats: 150,
            imageUrl: 'https://images.unsplash.com/photo-1465847899034-d174fc546f00?q=80&w=2070&auto=format&fit=crop'
        }
    ];

    loadEventById(id: string): Observable<Event> {
        this.loading.set(true);
        this.error.set(null);

        const event = this.mockEvents.find(e => e.id === id);

        return new Observable<Event>(subscriber => {
            setTimeout(() => {
                if (event) {
                    this.currentEvent.set(event);
                    subscriber.next(event);
                } else {
                    this.error.set('Event not found');
                    subscriber.error('Event not found');
                }
                this.loading.set(false);
                subscriber.complete();
            }, 100);
        });
    }

    setCurrentEvent(event: Event): void {
        this.currentEvent.set(event);
    }

    getCurrentEvent(): Event | null {
        return this.currentEvent();
    }

    clearCurrentEvent(): void {
        this.currentEvent.set(null);
    }
}