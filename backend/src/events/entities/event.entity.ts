import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'; //  ManyToOne,JoinColumn
import { EventStatus } from '../enums/event-status.enum';
import { EventCategory } from '../enums/event-category.enum';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: EventCategory,
    default: EventCategory.OTHER,
  })
  @Index()
  category: EventCategory;

  @Column({ type: 'timestamp' })
  @Index()
  date: Date;

  @Column({ type: 'varchar', length: 500 })
  location: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  venueName: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  @Index()git branch
  status: EventStatus;

  @Column({ type: 'int' })
  totalCapacity: number;

  @Column({ type: 'int' })
  availableSeats: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  bannerImage: string;

  @Column({ type: 'jsonb' })
  seatingPlan: object;

  @Column({ type: 'int', default: 5 })
  maxTicketsPerUser: number;

  @Column({ type: 'timestamp', nullable: true })
  salesStartDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  salesEndDate: Date;

  // @Column({ type: 'uuid' })
  @Column()
  @Index()
  organizerId: string;

  // Uncomment when User entity is available
  // @ManyToOne(() => User, (user) => user.events)
  // @JoinColumn({ name: 'organizerId' })
  // organizer: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
