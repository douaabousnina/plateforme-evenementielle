import { ReservationStatus, SeatStatus } from "../enums/reservation.enum";

// TODO: verify with backend, when event module is done
export interface Seat {
    id: string;
    eventId: string;
    row: string;
    number: number;
    section: string;
    category: string;
    price: number;
    status: SeatStatus;
    reservationId?: string | null;
}

export interface Reservation {
    id: string;
    userId: string;
    eventId: string;
    totalPrice: number;
    status: ReservationStatus;
    seats: Seat[];

    createdAt?: Date;
    updatedAt?: Date;
    expiresAt?: Date;
}

export interface LockSeatsRequest {
    eventId: string;
    seatIds: string[];
}