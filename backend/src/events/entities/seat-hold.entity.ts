import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { SeatHoldStatus } from '../enums/seat-hold-status.enum';

@Entity('seat_holds')
export class SeatHold {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  eventId: string;

  /**
   * Optional: who is holding seats (future integration with Users/Auth).
   * Keep it nullable for now to avoid blocking.
   */
  @Column({ type: 'uuid', nullable: true })
  @Index()
  userId: string | null;

  @Column({ type: 'int' })
  seats: number;

  @Column({
    type: 'enum',
    enum: SeatHoldStatus,
    default: SeatHoldStatus.ACTIVE,
  })
  @Index()
  status: SeatHoldStatus;

  @Column({ type: 'timestamp' })
  @Index()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

