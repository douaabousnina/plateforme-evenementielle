import { Injectable, signal, computed } from '@angular/core';
import { Event } from '../models/event.model';
import { Order, OrderItem } from '../models/order.model';
import { Seat } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class CartService {
    private currentEvent = signal<Event | null>(null);
    private orderItems = signal<OrderItem[]>([]);
    private reservedSeats = signal<Seat[]>([]);
    private serviceFeeRate = signal<number>(0.035);

    event = this.currentEvent.asReadonly();
    items = this.orderItems.asReadonly();

    subtotal = computed(() => {
        const itemsTotal = this.orderItems().reduce((sum, item) => sum + item.totalPrice, 0);
        const seatsTotal = this.reservedSeats().reduce((sum, seat) => sum + seat.price, 0);
        return itemsTotal + seatsTotal;
    });

    serviceFee = computed(() => {
        return Math.round(this.subtotal() * this.serviceFeeRate() * 100) / 100;
    });

    total = computed(() => {
        return this.subtotal() + this.serviceFee();
    });

    itemCount = computed(() => {
        return this.orderItems().reduce((sum, item) => sum + item.quantity, 0);
    });

    order = computed<Order | null>(() => {
        const event = this.currentEvent();
        if (!event) return null;

        return {
            event,
            items: this.orderItems(),
            seats: this.reservedSeats(),
            subtotal: this.subtotal(),
            serviceFee: this.serviceFee(),
            total: this.total(),
            reservationTime: new Date()
        };
    });

    setEvent(event: Event): void {
        this.currentEvent.set(event);
    }

    setSeats(seats: Seat[]): void {
        this.reservedSeats.set(seats);
    }

    addItem(item: OrderItem): void {
        const items = [...this.orderItems()];
        const existingIndex = items.findIndex(i => i.ticketType === item.ticketType);

        if (existingIndex >= 0) {
            items[existingIndex].quantity += item.quantity;
            items[existingIndex].totalPrice = items[existingIndex].quantity * items[existingIndex].unitPrice;
        } else {
            items.push(item);
        }

        this.orderItems.set(items);
    }

    removeItem(ticketType: string): void {
        this.orderItems.update(items => items.filter(i => i.ticketType !== ticketType));
    }

    updateItemQuantity(ticketType: string, quantity: number): void {
        this.orderItems.update(items =>
            items.map(item =>
                item.ticketType === ticketType
                    ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
                    : item
            )
        );
    }

    clear(): void {
        this.orderItems.set([]);
        this.reservedSeats.set([]);
        this.currentEvent.set(null);
    }

    hasItems(): boolean {
        return this.orderItems().length > 0;
    }
}