import { BaseEntity } from 'src/common/entities/base.entity';
import { ReservationStatus } from 'src/common/enums/reservation.enum';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Seat } from 'src/events/entities/seat.entity';
// import { User } from '../../users/entities/user.entity';
// import { Event } from '../../events/entities/event.entity';

@Entity('reservations')
export class Reservation extends BaseEntity {
    // @ManyToOne(() => User, user => user.reservations)
    // @JoinColumn({ name: 'userId' })
    // user: User;


    //   @ManyToOne(() => Event, event => event.reservations)
    // @JoinColumn({ name: 'eventId' })
    //   event: Event;

    // @Column({ type: 'uuid' })
    @Column()
    userId: string;

    @Column()
    eventId: string;


    @OneToMany(() => Seat, seat => seat.reservation, {
        cascade: true,
    })
    seats: Seat[];

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