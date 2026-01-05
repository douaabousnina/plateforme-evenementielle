import { IsUUID, IsEnum, IsString, Length } from 'class-validator';
import { PaymentMethod } from 'src/common/enums/payment.enum';

export class CreatePaymentDto {
    @IsUUID()
    reservationId: string;

    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @IsString()
    @Length(16, 16)
    cardNumber: string;

    @IsString()
    cardHolder: string;
}
