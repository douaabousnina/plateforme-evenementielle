import { Injectable, signal, computed, inject } from '@angular/core';
import { Seat } from '../models/reservation.model';
import { SeatStatus } from '../enums/reservation.enum';
import { SERVICE_FEE_RATE, MAX_SEATS_PER_ORDER } from '../constants/reservations.constants';
import { SeatService } from './seat.service';

@Injectable({ providedIn: 'root' })
export class CartService {
    private seatService = inject(SeatService);

    reservedSeats = signal<Seat[]>([]);
    errorMessage = signal<string | null>(null);

    subtotal = computed(() => {
        return this.reservedSeats().reduce((sum, seat) => sum + Number(seat.price), 0);
    });

    serviceFee = computed(() => {
        return Math.round(this.subtotal() * SERVICE_FEE_RATE);
    });

    total = computed(() => {
        return this.subtotal() + this.serviceFee();
    });

    seatCount = computed(() => {
        return this.reservedSeats().length;
    });

    constructor() {
        // because: even on refresh, reserved seats remain reserved!
        // => initialize with []
        this.reservedSeats.set([]);
    }


    setSeats(seats: Seat[]): void {
        this.reservedSeats.set(seats);
    }


    toggleSeat(seat: Seat): boolean {
        const isSelected = this.isSeatSelected(seat.id);

        if (isSelected) {
            this.removeSeat(seat.id);
            return true;
        } else {
            return this.addSeat(seat);
        }
    }

    addSeat(seat: Seat): boolean {
        if (this.reservedSeats().length >= MAX_SEATS_PER_ORDER) {
            this.errorMessage.set(`Maximum ${MAX_SEATS_PER_ORDER} billets par commande`);
            return false;
        }

        const current = this.reservedSeats();
        if (!current.find(s => s.id === seat.id)) {
            this.reservedSeats.set([...current, seat]);
            this.seatService.updateSeatStatus(seat.id, SeatStatus.LOCKED);
            this.errorMessage.set(null);
        }
        return true;
    }

    removeSeat(seatId: string): void {
        this.reservedSeats.update(seats => seats.filter(s => s.id !== seatId));
        this.seatService.updateSeatStatus(seatId, SeatStatus.AVAILABLE);
        this.errorMessage.set(null);
    }

    isSeatSelected(seatId: string): boolean {
        return this.reservedSeats().some(s => s.id === seatId);
    }

    clearCart(): void {
        const selectedIds = this.reservedSeats().map(s => s.id);
        this.reservedSeats.set([]);

        // Update all seat statuses back to available
        selectedIds.forEach(id => {
            this.seatService.updateSeatStatus(id, SeatStatus.AVAILABLE);
        });

        this.errorMessage.set(null);
    }

    
    validateCart(): { isValid: boolean; error?: string } {
        if (this.reservedSeats().length === 0) {
            return { isValid: false, error: 'Please select at least one seat.' };
        }
        return { isValid: true };
    }

    hasItems(): boolean {
        return this.reservedSeats().length > 0;
    }
}