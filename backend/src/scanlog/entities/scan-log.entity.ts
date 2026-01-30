import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ScanStatus } from '../enums/scan-status.enum';
// import { ManyToOne } from 'typeorm';
// import { Ticket } from '../../access/entities/ticket.entity';

@Entity('scan_logs')
export class ScanLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ticketId: string;

  // @ManyToOne(() => Ticket, (ticket) => ticket.scanLogs)
  // ticket: Ticket;

  @Column()
  eventId: string;

  @Column({ nullable: true })
  eventName?: string;

  @Column()
  scannedBy: string; // Controller user ID

  @CreateDateColumn()
  scannedAt: Date;

  @CreateDateColumn()
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: ScanStatus,
  })
  status: ScanStatus;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  deviceInfo?: string;
}
