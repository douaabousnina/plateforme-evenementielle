import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { SeatStatus } from 'src/common/enums/reservation-status.enum';

@Entity('reserved_seats')
export class ReservedSeat extends BaseEntity {
    @Column()
    seatId: string;

    @Column('decimal')
    price: number;

    @ManyToOne(() => Reservation, reservation => reservation.seats, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'reservationId' })
    reservation: Reservation;

    @Column()
    reservationId: string;

    @Column({ type: 'enum', enum: SeatStatus, default: SeatStatus.AVAILABLE })
    status: SeatStatus;
}
