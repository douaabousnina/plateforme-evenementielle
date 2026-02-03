import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterConfig } from '../../models/marketplace.model';

@Component({
  selector: 'app-client-footer',
  
  imports: [RouterLink],
  templateUrl: './client-footer.component.html',
  styleUrls: ['./client-footer.component.css'],
})
export class ClientFooterComponent {
  config = input.required<FooterConfig>();
}
