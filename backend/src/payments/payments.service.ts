import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { ReservationsService } from 'src/reservations/reservations.service';
import { PaymentMethod, PaymentStatus } from 'src/common/enums/payment.enum';
import { ReservationStatus } from 'src/common/enums/reservation.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    private readonly reservationsService: ReservationsService,
  ) { }

  async create(userId: string, dto: CreatePaymentDto) {
    const reservation = await this.reservationsService.findById(
      dto.reservationId, userId
    );

    if (!reservation) throw new NotFoundException('Reservation not found');

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Reservation not payable');
    }

    // Validate card and determine method before creating payment
    const paymentMethod = this.generateMethod(dto.cardNumber);

    const payment = this.paymentRepo.create({
      userId,
      reservationId: reservation.id,
      amount: reservation.totalPrice,
      method: paymentMethod,
      cardLast4: dto.cardNumber.slice(-4),
      status: PaymentStatus.PENDING,
    });

    // mocking bank
    // supposé we check avec dto.cvc / dto.expiryDate ..
    const success = Math.random() > 0.2;

    payment.status = success
      ? PaymentStatus.SUCCESS
      : PaymentStatus.FAILED;

    await this.paymentRepo.save(payment);

    if (payment.status === PaymentStatus.SUCCESS) {
      await this.reservationsService.confirm(reservation.id, userId);
    } else {
      throw new BadRequestException('Payment failed');
    }

    return payment;
  }

  async refund(dto: RefundPaymentDto) {
    const payment = await this.findOne(dto.paymentId);

    if (payment.status !== PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment not refundable');
    }

    payment.status = PaymentStatus.REFUNDED;
    payment.refundReason = dto.reason;

    return this.paymentRepo.save(payment);
  }

  async findByUser(userId: string) {
    return this.paymentRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async findSuccessfulByReservationId(reservationId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { reservationId, status: PaymentStatus.SUCCESS },
    });
    if (!payment) throw new NotFoundException('Successful payment not found for this reservation');
    return payment;
  }

  // helpers
  private generateMethod(cardNumber: string): PaymentMethod {
    if (!cardNumber) {
      throw new BadRequestException('Card number is required');
    }

    const normalized = cardNumber.replace(/\s+/g, '');

    // VISA: starts with 4
    if (/^4/.test(normalized)) {
      return PaymentMethod.VISA;
    }

    // MASTERCARD: starts with 5 (51–55) or 2 (2221–2720)
    if (/^(5[1-5]|2[2-7])/.test(normalized)) {
      return PaymentMethod.MASTERCARD;
    }

    throw new BadRequestException(`Unsupported card type.`);
  }


}
