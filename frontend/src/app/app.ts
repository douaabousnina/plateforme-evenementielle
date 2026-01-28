import { Component, signal } from '@angular/core';

import { RegisterComponent } from './features/auth-users/pages/register/register.component';

@Component({
  selector: 'app-root',
  imports: [RegisterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
