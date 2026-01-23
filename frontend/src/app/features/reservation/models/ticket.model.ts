export interface Ticket {
    id: string;
    type: string;
    description: string;
    price: number;
    quantity: number;
}

export interface TicketType {
    id: string;
    name: string;
    description: string;
    price: number;
    available: number;
}