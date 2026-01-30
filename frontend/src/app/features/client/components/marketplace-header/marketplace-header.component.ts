import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace.service';
import { AuthService } from '../../../../core/services/auth.service';

export interface MarketplaceNavItem {
  label: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-marketplace-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './marketplace-header.component.html',
  styleUrls: ['./marketplace-header.component.css'],
})
export class MarketplaceHeaderComponent {
  private readonly marketplace = inject(MarketplaceService);
  private readonly auth = inject(AuthService);

  get appName(): string {
    return 'EventPlace';
  }

  get userDisplayName(): string {
    return this.auth.getCurrentUser()?.name ?? 'Invité';
  }

  get userStatusLabel(): string {
    return 'Membre Gold';
  }

  get navItems(): MarketplaceNavItem[] {
    return [
      { label: 'Découvrir', route: '/client/marketplace', active: true },
      { label: 'Mes Billets', route: '/access/my-tickets' },
      { label: 'Favoris', route: '/client/favorites' },
      { label: 'Organiser', route: '/organizer/events' },
    ];
  }
}
