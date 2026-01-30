import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { SeatStatus } from 'src/common/enums/reservation.enum';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Event } from './event.entity';

@Entity('seats')
export class Seat extends BaseEntity {
    @ManyToOne(() => Event, event => event.id, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'eventId' })
    event: Event;

    @Column()
    eventId: string;

    @Column()
    row: string;

    @Column()
    number: number;

    @Column()
    section: string;

    @Column()
    category: string;

    @Column('decimal')
    price: number;

    @ManyToOne(() => Reservation, reservation => reservation.seats, {
        onDelete: 'CASCADE',
        nullable: true
    })
    @JoinColumn({ name: 'reservationId' })
    reservation: Reservation;

    @Column({ nullable: true })
    reservationId: string | null;

    @Column({ type: 'enum', enum: SeatStatus, default: SeatStatus.AVAILABLE })
    status: SeatStatus;
}
