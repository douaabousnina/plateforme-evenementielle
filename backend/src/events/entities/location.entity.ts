import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { LocationType } from 'src/common/enums/event.enum';
import { Event } from './event.entity';

@Entity('locations')
export class Location extends BaseEntity {
  @Column({
    type: 'enum',
    enum: LocationType,
    default: LocationType.PHYSICAL,
  })
  type: LocationType;

  // Physical
  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  venueName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  // Online
  @Column({ type: 'varchar', length: 500, nullable: true })
  onlineUrl: string;

  @OneToMany(() => Event, (event) => event.location)
  events: Event[];
}