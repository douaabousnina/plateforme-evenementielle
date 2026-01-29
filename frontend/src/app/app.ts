import { Component,signal } from '@angular/core';

import { RegisterComponent } from './features/auth-users/pages/register/register.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RegisterComponent],
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
}
