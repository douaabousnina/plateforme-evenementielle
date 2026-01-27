import { IsUUID, IsString, Length, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
    @IsUUID()
    @IsNotEmpty()
    reservationId: string;

    @IsString()
    @IsNotEmpty()
    @Length(16, 16)
    cardNumber: string;

    @IsString()
    @IsNotEmpty()
    cardHolder: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 4)
    cvc: string;

    @IsString()
    @IsNotEmpty()
    @Length(5, 5)
    expiryDate: string;
}
