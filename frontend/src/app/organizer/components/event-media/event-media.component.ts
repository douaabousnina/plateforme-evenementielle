import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-media',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-media.component.html',
  styleUrls: ['./event-media.css']
})
export class EventMediaComponent {
  @Input() form!: FormGroup;

  onCoverImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      // Handle cover image upload
      console.log('Cover image selected:', input.files[0]);
    }
  }

  onGalleryImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      // Handle gallery images upload
      console.log('Gallery images selected:', Array.from(input.files));
    }
  }
}
