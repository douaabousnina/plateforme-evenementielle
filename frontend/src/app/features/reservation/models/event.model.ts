//TODO: check avec back, when event module is done
export interface Event {
    id: string;
    name: string;
    date: Date;
    location: string;
    totalSeats: number;
    description?: string;
    imageUrl?: string;
}