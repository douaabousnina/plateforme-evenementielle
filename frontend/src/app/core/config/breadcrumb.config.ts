import { BreadcrumbStep } from '../models/breadcrumb.model';

export const BREADCRUMB_STEPS = {
    seatSelection: { label: 'Sélection', route: '/reservation', stepNumber: 1 },
    payment: { label: 'Paiement', route: '/payment', stepNumber: 2 },
    confirmation: { label: 'Confirmation', route: '/confirmation', stepNumber: 3 }
};

export function createBreadcrumbSteps(currentStep: 'seatSelection' | 'payment' | 'confirmation'): BreadcrumbStep[] {
    const steps = [
        {
            ...BREADCRUMB_STEPS.seatSelection,
            completed: currentStep !== 'seatSelection',
            active: currentStep === 'seatSelection'
        },
        {
            ...BREADCRUMB_STEPS.payment,
            completed: currentStep === 'confirmation',
            active: currentStep === 'payment'
        },
        {
            ...BREADCRUMB_STEPS.confirmation,
            completed: false,
            active: currentStep === 'confirmation'
        }
    ];

    return steps;
}
