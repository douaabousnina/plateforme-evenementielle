export enum ScanStatus {
  VALID = 'valid',
  ALREADY_SCANNED = 'already_scanned',
  EXPIRED = 'expired',
  INVALID = 'invalid',
  FAKE = 'fake',
}

export enum TicketCategory {
  CONCERT = 'Concert',
  CONFERENCE = 'Conférence',
  THEATRE = 'Théâtre',
  SPORT = 'Sport',
  OTHER = 'Autre',
}

export enum TicketStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SCANNED = 'scanned',
  CANCELLED = 'cancelled',
}

export interface ScanLog {
  id: string;
  ticketId: string;
  eventId: string;
  eventName?: string;
  scannedBy: string;
  scannerName?: string;
  scannedAt: Date;
  timestamp: Date;
  status: ScanStatus;
  location?: string;
  deviceInfo?: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: Date;
  eventLocation: string;
  eventImage?: string;
  userId: string;
  orderId: string;
  qrCode: string;
  qrToken: string;
  
  // Seating information
  gate?: string;
  row?: string;
  seat?: string;
  zone?: string;
  access?: string;
  
  category: string;
  price: number;
  status: TicketStatus;
  createdAt: Date;
  scannedAt?: Date;
  expiresAt: Date;
}

export interface CheckInResponse {
  status: ScanStatus;
  message: string;
  ticket?: Ticket;
}
