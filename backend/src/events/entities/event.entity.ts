import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
// import { User } from '../../users/entities/user.entity';

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SOLD_OUT = 'SOLD_OUT',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizerId: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  image: string;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;

  @Column()
  totalSeats: number;

  @Column()
  availableSeats: number;
}
