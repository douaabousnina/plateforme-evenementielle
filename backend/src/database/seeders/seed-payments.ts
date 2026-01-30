import { DataSource } from 'typeorm';
import { Payment } from '../../payments/entities/payment.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { PaymentMethod, PaymentStatus } from '../../common/enums/payment.enum';
import { ReservationStatus } from '../../common/enums/reservation.enum';

export async function seedPayments(
  dataSource: DataSource,
  reservations: Reservation[],
): Promise<Payment[]> {
  const paymentRepo = dataSource.getRepository(Payment);
  const confirmed = reservations.filter((r) => r.status === ReservationStatus.CONFIRMED);
  const payments: Payment[] = [];

  for (const reservation of confirmed) {
    const payment = paymentRepo.create({
      userId: reservation.userId,
      reservationId: reservation.id,
      amount: reservation.totalPrice,
      method: Math.random() < 0.5 ? PaymentMethod.VISA : PaymentMethod.MASTERCARD,
      status: PaymentStatus.SUCCESS,
      cardLast4: Math.floor(1000 + Math.random() * 9000).toString(),
    });
    payments.push(await paymentRepo.save(payment));
  }

  return payments;
}
