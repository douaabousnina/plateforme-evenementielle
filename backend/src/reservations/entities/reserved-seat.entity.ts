import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { SeatStatus } from 'src/common/enums/reservation.enum';

@Entity('reserved_seats')
export class ReservedSeat extends BaseEntity {
    // @OneToOne(() => Event, event => event.id, {
    //     onDelete: 'CASCADE',
    // })
    // @JoinColumn({ name: 'eventId' })
    // event: Event;

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
    reservationId: string;

    @Column({ type: 'enum', enum: SeatStatus, default: SeatStatus.AVAILABLE })
    status: SeatStatus;
}
