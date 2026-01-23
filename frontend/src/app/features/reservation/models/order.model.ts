import { Event } from "./event.model";
import { Seat } from "./reservation.model";

export interface OrderItem {
  ticketType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description: string;
}

export interface Order {
  event: Event;
  items: OrderItem[];
  seats: Seat[];
  subtotal: number;
  serviceFee: number;
  total: number;
  reservationTime: Date;
}

export interface OrderWithConfirmation extends Order {
  contact?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  confirmationCode?: string;
  transactionId?: string;
}