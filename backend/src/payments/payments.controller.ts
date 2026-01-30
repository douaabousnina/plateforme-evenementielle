import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    UseGuards,
    Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    /**
     * CREATE PAYMENT - Client only
     * Clients make payments for their reservations
     */
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CLIENT)
    create(
        @Body() dto: CreatePaymentDto,
        @Req() req: any
    ) {
        const userId = req.user.id;
        return this.paymentsService.create(userId, dto);
    }

    /**
     * REFUND PAYMENT - Organizer only
     * Only organizers can issue refunds
     */
    @Post('refund')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ORGANIZER)
    refund(@Body() dto: RefundPaymentDto) {
        return this.paymentsService.refund(dto);
    }

    /**
     * GET MY PAYMENTS - Client only
     * View payment history
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CLIENT)
    findMine(@Req() req: any) {
        const userId = req.user.id;
        return this.paymentsService.findByUser(userId);
    }

    /**
     * GET SINGLE PAYMENT - Client and Organizer
     * View payment details
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CLIENT, Role.ORGANIZER)
    findOne(@Param('id') id: string) {
        return this.paymentsService.findOne(id);
    }

    /**
     * GET SUCCESSFUL PAYMENT BY RESERVATION - Client and Organizer
     * Check if a reservation has a successful payment
     */
    @Get('reservation/:reservationId/successful')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CLIENT, Role.ORGANIZER)
    findSuccessfulByReservationId(
        @Param('reservationId') reservationId: string,
    ) {
        return this.paymentsService.findSuccessfulByReservationId(
            reservationId,
        );
    }
}