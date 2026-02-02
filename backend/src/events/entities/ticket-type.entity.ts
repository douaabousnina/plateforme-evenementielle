import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Event } from './event.entity';

export enum TicketTypeEnum {
  VIP = 'vip',
  REGULAR = 'regular',
  EARLY_BIRD = 'early_bird',
}

@Entity('ticket_types')
export class TicketType extends BaseEntity {
  @Column({
    type: 'enum',
    enum: TicketTypeEnum,
  })
  type: TicketTypeEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'int', default: 0 })
  sold: number;

  // Event Reference
  @Column()
  eventId: string;

  @ManyToOne(() => Event, (event) => event.ticketTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;
}
