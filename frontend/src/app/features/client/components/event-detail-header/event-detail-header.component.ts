import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth-users/services/auth.service';

@Component({
  selector: 'app-event-detail-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './event-detail-header.component.html',
  styleUrls: ['./event-detail-header.component.css'],
})
export class EventDetailHeaderComponent {
  private readonly auth = inject(AuthService);

  appName = 'EventLife';
  searchPlaceholder = 'Rechercher un événement...';

  get userAvatarUrl(): string | null {
    return null;
  }

  navItems = [
    { label: 'Concerts', route: '/client/marketplace?category=concert' },
    { label: 'Sports', route: '/client/marketplace?category=sport' },
    { label: 'Théâtre', route: '/client/marketplace?category=theater' },
    { label: 'Festivals', route: '/client/marketplace?category=festival' },
  ];
}
