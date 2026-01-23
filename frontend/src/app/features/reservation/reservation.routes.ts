import { Routes } from "@angular/router";
import { PaymentPage } from "./pages/payment/payment.page";
import { ConfirmationPage } from "./pages/confirmation/confirmation.page";
import { SeatSelectionPage } from "./pages/seat-selection/seat-selection.page";

export const reservationRoutes: Routes = [
    {
        path: 'payment',
        component: PaymentPage,
        title: 'Paiement - EventPlatform'
    },
    {
        path: 'confirmation',
        component: ConfirmationPage,
        title: 'Confirmation - EventPlatform'
    },
    {
        path: 'seat-selection/:eventId',
        component: SeatSelectionPage,
        title: 'Sélection des places - EventPlatform'
    },
];