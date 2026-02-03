import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-form-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-form-actions.component.html',
  styleUrls: ['./event-form-actions.css']
})
export class EventFormActionsComponent {
  @Input() disabled = false;
  @Input() showBack = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() saveDraft = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

  onBack() {
    this.back.emit();
  }

  onSaveDraft() {
    this.saveDraft.emit();
  }

  onNext() {
    this.next.emit();
  }
}
