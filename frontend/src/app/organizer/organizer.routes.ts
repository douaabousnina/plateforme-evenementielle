import { Routes } from "@angular/router";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Events } from "./pages/events/events";
import { roleGuard } from "../core/guards/role.guard";
import { Role } from "../features/auth-users/models/auth.model";

export const organizerRoutes: Routes = [
    {
        path: '',
        component: Dashboard,
        canActivate: [roleGuard],
        data: { roles: [Role.ORGANIZER], redirectIfNotAuth: '/login', redirectIfNoRole: '/home' },
    },
    {
        path: 'events',
        component: Events,
        canActivate: [roleGuard],
        data: { roles: [Role.ORGANIZER], redirectIfNotAuth: '/login', redirectIfNoRole: '/home' },
    },

];