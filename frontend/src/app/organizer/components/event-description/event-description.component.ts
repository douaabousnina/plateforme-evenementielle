import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-description',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-description.component.html',
  styleUrls: ['./event-description.css']
})
export class EventDescriptionComponent {
  @Input() form!: FormGroup;
}
