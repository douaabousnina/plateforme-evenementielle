import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum TicketStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SCANNED = 'scanned',
  CANCELLED = 'cancelled',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventId: string;

  @Column({ nullable: true })
  eventName: string;

  @Column({ nullable: true })
  eventDate: Date;

  @Column({ nullable: true })
  eventLocation: string;

  @Column({ nullable: true })
  eventImage?: string;

  @Column()
  userId: string;

  @Column()
  orderId: string;

  @Column('text')
  qrCode: string; // Base64 encoded QR code image

  @Column()
  qrToken: string; // Dynamic token that changes

  @Column({ nullable: true })
  gate?: string;

  @Column({ nullable: true })
  row?: string;

  @Column({ nullable: true })
  seat?: string;

  @Column({ nullable: true })
  zone?: string;

  @Column({ nullable: true })
  access?: string;

  @Column()
  category: string;

  @Column('decimal')
  price: number;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.PENDING,
  })
  status: TicketStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  scannedAt?: Date;

  @Column()
  expiresAt: Date;
}
