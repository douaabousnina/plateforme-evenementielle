import { IsUUID, IsEnum, IsString, Length, IsNotEmpty } from 'class-validator';
import { PaymentMethod } from 'src/common/enums/payment.enum';

export class CreatePaymentDto {
    @IsUUID()
    @IsNotEmpty()
    reservationId: string;

    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    method: PaymentMethod;

    @IsString()
    @IsNotEmpty()
    @Length(16, 16)
    cardNumber: string;

    @IsString()
    @IsNotEmpty()
    cardHolder: string;
}
