import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { PaymentMethod, PaymentStatus } from 'src/common/enums/payment.enum';

@Entity('payments')
export class Payment extends BaseEntity {
    // @ManyToOne(() => User, { onDelete: 'CASCADE' })
    // @JoinColumn({name: "userId"})
    // user: User;

    // @Column({ type: 'uuid' })
    @Column()
    userId: string;
    
    // many => in case of retry (because we allow failed payments)
    // du coup on aura pas besoin de refaire une nouvelle réservation
    @ManyToOne(() => Reservation, { onDelete: 'CASCADE' })
    @JoinColumn({name: "reservationId"})
    reservation: Reservation;

    @Column({ type: 'uuid' })
    reservationId: string;
    
    @Column({ type: 'decimal' })
    amount: number;

    @Column({ type: 'enum', enum: PaymentMethod })
    method: PaymentMethod;

    @Column({ type: 'enum', enum: PaymentStatus })
    status: PaymentStatus;

    @Column({ nullable: true })
    cardLast4?: string;

    @Column({ nullable: true })
    refundReason?: string;
}
