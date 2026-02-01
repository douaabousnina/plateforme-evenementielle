import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import {
  ClientDashboardData,
  WelcomeSectionData,
  UpcomingEventCard,
  RecommendationCard,
  LoyaltyInfo,
  QuickAction,
  NotificationItem,
} from '../models/client-dashboard.model';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth-users/services/auth.service';
/** App display name for client area (configurable, not hardcoded in templates). */
export const CLIENT_APP_NAME = 'EventLife';

/** Default date locale for formatting. */
const DATE_LOCALE = 'fr-FR';

@Injectable({ providedIn: 'root' })
export class ClientDashboardService {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  private readonly welcome = signal<WelcomeSectionData | null>(null);
  private readonly upcomingEvents = signal<UpcomingEventCard[]>([]);
  private readonly recommendations = signal<RecommendationCard[]>([]);
  private readonly loyalty = signal<LoyaltyInfo | null>(null);
  private readonly quickActions = signal<QuickAction[]>([]);
  private readonly notifications = signal<NotificationItem[]>([]);
  private readonly loading = signal<boolean>(false);
  private readonly error = signal<string | null>(null);

  readonly welcomeData = this.welcome.asReadonly();
  readonly upcomingEventsList = this.upcomingEvents.asReadonly();
  readonly recommendationsList = this.recommendations.asReadonly();
  readonly loyaltyData = this.loyalty.asReadonly();
  readonly quickActionsList = this.quickActions.asReadonly();
  readonly notificationsList = this.notifications.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly hasError = this.error.asReadonly();

  readonly currentDateLabel = computed(() => {
    const w = this.welcome();
    return w?.currentDateLabel ?? this.formatCurrentDate();
  });

  constructor() {
    this.setStaticQuickActions();
  }

  /** Load all dashboard data (API + fallback to mock). */
  loadDashboard(): Observable<ClientDashboardData | null> {
    this.loading.set(true);
    this.error.set(null);

    return this.fetchDashboardData().pipe(
      map((data) => {
        this.applyDashboardData(data);
        this.loading.set(false);
        return data;
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erreur chargement');
        this.applyDashboardData(this.getMockDashboardData());
        return of(null);
      })
    );
  }

  getAppName(): string {
    return CLIENT_APP_NAME;
  }

  getUserDisplayName(): string {
    const user = this.auth.getCurrentUser();
    return user?.name ?? '';
  }

  markAllNotificationsRead(): void {
    this.notifications.update((list) =>
      list.map((n) => ({ ...n, unread: false }))
    );
  }

  private applyDashboardData(data: ClientDashboardData): void {
    this.welcome.set(data.welcome);
    this.upcomingEvents.set(data.upcomingEvents);
    this.recommendations.set(data.recommendations);
    this.loyalty.set(data.loyalty);
    this.notifications.set(data.notifications);
  }

  private setStaticQuickActions(): void {
    this.quickActions.set([
      { id: 'scan', icon: 'qr_code_scanner', label: 'Scanner QR', route: '/scanner' },
      { id: 'tickets', icon: 'confirmation_number', label: 'Mes Billets', route: '/my-tickets' },
      { id: 'explore', icon: 'explore', label: 'Explorer', route: '/events' },
      { id: 'wallet', icon: 'account_balance_wallet', label: 'Portefeuille', route: '/wallet' },
    ]);
  }

  private formatCurrentDate(): string {
    return new Date().toLocaleDateString(DATE_LOCALE, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private fetchDashboardData(): Observable<ClientDashboardData> {
    const userName = this.getUserDisplayName() || '';
    return this.api.get<unknown>('events/featured').pipe(
      map((response) => this.mapApiResponseToDashboard(response, userName)),
      catchError(() => of(this.getMockDashboardData()))
    );
  }

  private mapApiResponseToDashboard(
    response: unknown,
    userName: string
  ): ClientDashboardData {
    const events = Array.isArray(response) ? response : (response as { data?: unknown[] })?.data ?? [];
    const upcomingEvents = events.slice(0, 6).map((e: Record<string, unknown>) => ({
      id: String(e['id'] ?? ''),
      title: String(e['title'] ?? ''),
      venueName: String(e['venueName'] ?? e['location'] ?? ''),
      dateLabel: this.formatEventDateLabel(e['date']),
      date: e['date'] ? new Date(e['date'] as string) : new Date(),
      imageUrl: String((e['bannerImage'] ?? (e['images'] as string[])?.[0] ?? '')),
      ticketCount: 1,
      ticketLabel: '1 Billet',
    })) as UpcomingEventCard[];
    const dateLabel = this.formatCurrentDate();
    return {
      welcome: {
        greeting: `Bonjour, ${userName} 👋`,
        subtitle: `Prêt pour votre prochaine expérience ? Vous avez ${upcomingEvents.length} événements à venir.`,
        upcomingCount: upcomingEvents.length,
        currentDateLabel: dateLabel,
      },
      upcomingEvents: upcomingEvents.length > 0 ? upcomingEvents : this.getMockUpcomingEvents(),
      recommendations: this.getMockRecommendations(),
      loyalty: this.getMockLoyalty(),
      quickActions: this.quickActions(),
      notifications: this.getMockNotifications(),
    };
  }

  private formatEventDateLabel(date: unknown): string {
    if (!date) return '';
    const d = new Date(date as string);
    return d.toLocaleDateString(DATE_LOCALE, { day: '2-digit', month: 'short' }).toUpperCase();
  }

  private getMockDashboardData(): ClientDashboardData {
    const userName = this.getUserDisplayName() || 'Thomas';
    const dateLabel = this.formatCurrentDate();
    return {
      welcome: {
        greeting: `Bonjour, ${userName} 👋`,
        subtitle: `Prêt pour votre prochaine expérience ? Vous avez 3 événements à venir.`,
        upcomingCount: 3,
        currentDateLabel: dateLabel,
      },
      upcomingEvents: this.getMockUpcomingEvents(),
      recommendations: this.getMockRecommendations(),
      loyalty: this.getMockLoyalty(),
      quickActions: this.quickActions(),
      notifications: this.getMockNotifications(),
    };
  }

  private getMockUpcomingEvents(): UpcomingEventCard[] {
    return [
      {
        id: '1',
        title: 'Coldplay - Music of the Spheres',
        venueName: 'Stade de France',
        dateLabel: '12 NOV',
        date: new Date('2025-11-12'),
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
        ticketCount: 2,
        ticketLabel: '2 Billets',
      },
      {
        id: '2',
        title: 'Web Summit 2023',
        venueName: 'Lisbonne, PT',
        dateLabel: '15 NOV',
        date: new Date('2025-11-15'),
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        ticketCount: 1,
        ticketLabel: '1 Billet Pro',
      },
      {
        id: '3',
        title: 'Soirée Jazz & Vin',
        venueName: 'Le Caveau, Paris',
        dateLabel: '02 DÉC',
        date: new Date('2025-12-02'),
        imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400',
        ticketCount: 4,
        ticketLabel: '4 Billets',
      },
    ];
  }

  private getMockRecommendations(): RecommendationCard[] {
    return [
      {
        id: 'r1',
        category: 'Festival',
        categoryColorClass: 'text-primary',
        title: 'Neon Nights 2024',
        description: 'Une expérience immersive unique avec les meilleurs DJs.',
        dateLabel: '15 Juin 2024',
        date: new Date('2024-06-15'),
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200',
      },
      {
        id: 'r2',
        category: 'Arts',
        categoryColorClass: 'text-green-600',
        title: 'Exposition Moderne',
        description: "Découvrez les nouvelles tendances de l'art contemporain.",
        dateLabel: '01 Déc 2023',
        date: new Date('2023-12-01'),
        imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=200',
      },
      {
        id: 'r3',
        category: 'Humour',
        categoryColorClass: 'text-orange-500',
        title: 'Stand-up Night',
        description: 'Les meilleurs humoristes de la scène parisienne.',
        dateLabel: '10 Nov 2023',
        date: new Date('2023-11-10'),
        imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c91c8d0c4e?w=200',
      },
      {
        id: 'r4',
        category: 'Sport',
        categoryColorClass: 'text-blue-500',
        title: 'PSG vs Marseille',
        description: 'Le classique à ne pas manquer.',
        dateLabel: '28 Oct 2023',
        date: new Date('2023-10-28'),
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200',
      },
    ];
  }

  private getMockLoyalty(): LoyaltyInfo {
    return {
      points: 450,
      pointsLabel: 'pts',
      status: 'gold',
      statusLabel: 'Statut Gold',
      progressPercent: 85,
      progressLabel: '50 pts avant le niveau Platine',
      rewardsButtonLabel: 'Voir mes récompenses',
    };
  }

  private getMockNotifications(): NotificationItem[] {
    return [
      {
        id: 'n1',
        title: 'Rappel : Concert Coldplay ce soir !',
        timeAgo: 'Il y a 2 heures',
        unread: true,
      },
      {
        id: 'n2',
        title: 'Votre billet pour Web Summit est prêt.',
        timeAgo: 'Hier',
        unread: false,
      },
      {
        id: 'n3',
        title: 'Nouvelle offre : -20% sur les festivals.',
        timeAgo: 'Il y a 2 jours',
        unread: false,
      },
    ];
  }
}
