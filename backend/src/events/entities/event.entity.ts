import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Location } from './location.entity';
import { EventCategory, EventStatus, EventType } from 'src/common/enums/event.enum';
import { Seat } from './seat.entity';
import { User } from 'src/users/entities/user.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Entity('events')
export class Event extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  type: EventType;

  @Column({
    type: 'enum',
    enum: EventCategory,
  })
  category: EventCategory;

  // Date & Time
  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  // Location
  @Column({ nullable: true })
  locationId: string;

  @ManyToOne(() => Location, { eager: true, nullable: true })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  // Media
  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImage: string; // Main banner image

  @Column({ type: 'text', array: true, nullable: true })
  gallery: string[]; // Additional images

  // Seats
  @Column({ type: 'int', nullable: true })
  totalCapacity: number;

  @Column({ type: 'int', nullable: true })
  availableCapacity: number;

  @Column({ type: 'boolean', default: false })
  hasSeatingPlan: boolean; // online ou nn

  @OneToMany(() => Seat, seat => seat.event)
  seats: Seat[];

  // Status
  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  @Index()
  status: EventStatus;

  // Organizer
  @Column({ type: 'uuid' })
  organizerId: string;

  @ManyToOne(() => User, (user) => user.events)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @OneToMany(() => Reservation, reservation => reservation.event)
  reservations: Reservation[];
}