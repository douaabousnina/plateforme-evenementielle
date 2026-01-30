import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfilePage } from './pages/profile-page/profile-page';

export const authRoutes: Routes = [
    {path: 'register' ,component: RegisterComponent},
    {path: 'login' ,component: LoginComponent},
    {path: 'profile' ,component: ProfilePage}
];
