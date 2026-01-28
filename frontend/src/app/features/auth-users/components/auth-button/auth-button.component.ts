import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-button',
  imports: [],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.css'
})
export class AuthButtonComponent {
  @Input() text!: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

}
