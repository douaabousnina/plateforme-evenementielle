import {
    Controller,
    Post,
    Body,
    Get,
    Param,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post()
    create(@Body() dto: CreatePaymentDto) {
        const userId = 'sample-user-id'; // later from JWT
        return this.paymentsService.create(userId, dto);
    }

    @Post('refund')
    refund(@Body() dto: RefundPaymentDto) {
        return this.paymentsService.refund(dto);
    }

    @Get()
    findMine() {
        const userId = 'sample-user-id';
        return this.paymentsService.findByUser(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.paymentsService.findOne(id);
    }
}
