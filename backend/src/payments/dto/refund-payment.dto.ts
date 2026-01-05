import { IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';

export class RefundPaymentDto {
    @IsUUID()
    paymentId: string;

    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    reason?: string;
}
