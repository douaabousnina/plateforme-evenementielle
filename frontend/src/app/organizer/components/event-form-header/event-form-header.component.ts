import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-form-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-form-header.component.html',
  styleUrls: ['./event-form-header.css']
})
export class EventFormHeaderComponent {
  @Input() title: string = 'Infos Générales';
  @Input() description: string = '';
  @Input() currentStep?: number;
  @Input() totalSteps?: number;
}
