import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { TicketStatus } from '../enums/ticket-status.enum';
import { Reservation } from 'src/reservations/entities/reservation.entity';
// import { ManyToOne, OneToMany } from 'typeorm';
// import { Reservation } from '../../reservations/entities/reservation.entity';
// import { ScanLog } from '../../scanlog/entities/scan-log.entity';

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

  @ManyToOne(() => Reservation, (reservation) => reservation.tickets)
  @JoinColumn({ name: "reservationId" })
  reservation: Reservation;

  @Column({ type: "uuid" })
  reservationId: string;

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

  // @OneToMany(() => ScanLog, (scanLog) => scanLog.ticket)
  // scanLogs: ScanLog[];
}
