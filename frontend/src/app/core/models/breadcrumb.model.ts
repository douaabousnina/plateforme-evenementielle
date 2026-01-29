export interface BreadcrumbStep {
    label: string;
    route: string;
    completed: boolean;
    active: boolean;
    stepNumber: number;
}