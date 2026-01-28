import { Component, Input, Output, EventEmitter, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-input',
  imports: [FormsModule],
  templateUrl: './auth-input.component.html',
  styleUrl: './auth-input.component.css'
})
export class AuthInputComponent {
 @Input() label!: string;
 @Input() type: string = 'text';
  @Input() placeholder!: string;
  @Input () value!: string;
  @Output() valueChange = new EventEmitter<string>();
}
