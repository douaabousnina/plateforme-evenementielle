//TODO: check avec back, when event module is done
export interface Event {
    id: string;
    title: string;
    description: string;
    type: string;
    category: string;
    startDate: Date;
    startTime: Date;
    endDate: Date;
    endTime: Date;
    locationId?: string;
    location?: any; // Location entity
    coverImage?: string;
    gallery?: string[];
    totalCapacity?: number;
    availableCapacity?: number;
    hasSeatingPlan: boolean;
    seats?: any[];
    status: string;
    organizerId: string;
    createdAt?: Date;
    updatedAt?: Date;
}