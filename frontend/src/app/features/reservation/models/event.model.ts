export interface Event {
    id: string;
    title: string;
    type: string;
    venue: string;
    date: Date;
    time: string;
    imageUrl: string;
    description?: string;
}