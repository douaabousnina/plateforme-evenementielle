export interface Seat {
    id: string;
    row: string;
    number: number;
    section: string;
    price: number;
    status: 'available' | 'selected' | 'sold';
    category: string;
}