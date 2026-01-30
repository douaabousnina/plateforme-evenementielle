import { BaseEntity } from 'src/common/entities/base.entity';
import { ReservationStatus } from 'src/common/enums/reservation.enum';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Seat } from 'src/events/entities/seat.entity';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';
import { Ticket } from 'src/access/entities/ticket.entity';

@Entity('reservations')
export class Reservation extends BaseEntity {
    @ManyToOne(() => User, user => user.reservations)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => Event, event => event.reservations)
    @JoinColumn({ name: 'eventId' })
    event: Event;

    @Column({ type: 'uuid' })
    eventId: string;

    @OneToMany(() => Seat, seat => seat.reservation, {
        cascade: true,
    })
    seats: Seat[];

    @OneToMany(() => Ticket, ticket => ticket.reservationId)
    tickets: Ticket[];

    @Column('decimal')
    totalPrice: number;

    @Column({
        type: 'enum',
        enum: ReservationStatus,
        default: ReservationStatus.PENDING
    })
    status: ReservationStatus;

    @Column({ type: 'timestamp' })
    expiresAt: Date;
}