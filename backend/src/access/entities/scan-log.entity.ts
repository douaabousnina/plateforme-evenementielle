import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum ScanStatus {
  VALID = 'valid',
  ALREADY_SCANNED = 'already_scanned',
  EXPIRED = 'expired',
  INVALID = 'invalid',
  FAKE = 'fake',
}

@Entity('scan_logs')
export class ScanLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ticketId: string;

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
