import { IsUUID, IsNumber, IsOptional, IsString, IsNotEmpty, Min } from 'class-validator';

export class RefundPaymentDto {
    @IsUUID()
    @IsNotEmpty()
    paymentId: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsOptional()
    @IsString()
    reason?: string;
}
