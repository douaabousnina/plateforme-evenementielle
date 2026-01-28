import { Routes } from "@angular/router";
import { PaymentPage } from "./pages/payment/payment.page";
import { ConfirmationPage } from "./pages/confirmation/confirmation.page";
import { SeatSelectionPage } from "./pages/seat-selection/seat-selection.page";

export const reservationRoutes: Routes = [
    {
        path: 'payment/:reservationId',
        component: PaymentPage,
    },
    {
        path: 'confirmation/:reservationId',
        component: ConfirmationPage,
    },
    {
        path: 'seat-selection/:eventId',
        component: SeatSelectionPage,
    },
];