import { Routes } from "@angular/router";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Events } from "./pages/events/events";
export const organizerRoutes: Routes = [
    {
        path: '',
        component: Dashboard,
    },
    {
        path: 'events',
        component: Events,
    },

];