import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of, map, catchError, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  MarketplaceEventCard,
  MarketplaceListResponse,
  MarketplaceFilters,
  DateFilterOption,
  CategoryFilterOption,
  FooterConfig,
  EventCardBadge,
  EventCardBadgeKind,
} from '../models/marketplace.model';
import {
  EventDetail,
  EventDetailTicketOption,
  EventDetailArtist,
  EventDetailReview,
  SeatMapSection,
} from '../models/event-detail.model';

const DATE_LOCALE = 'fr-FR';
const CATEGORY_LABELS: Record<string, string> = {
  concert: 'Musique',
  conference: 'Tech',
  sport: 'Sport',
  theater: 'Théâtre',
  festival: 'Festival',
  exhibition: 'Art',
  workshop: 'Atelier',
  networking: 'Réseau',
  other: 'Autre',
};

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private readonly api = inject(ApiService);

  private readonly events = signal<MarketplaceEventCard[]>([]);
  private readonly meta = signal<MarketplaceListResponse['meta'] | null>(null);
  private readonly loading = signal(false);
  private readonly error = signal<string | null>(null);
  private readonly filters = signal<MarketplaceFilters>({
    search: '',
    datePreset: '',
    category: '',
    priceMax: null,
  });

  readonly eventsList = this.events.asReadonly();
  readonly listMeta = this.meta.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly hasError = this.error.asReadonly();
  readonly currentFilters = this.filters.asReadonly();

  readonly dateFilterOptions = computed<DateFilterOption[]>(() => [
    { value: '', label: 'Toutes les dates' },
    { value: 'today', label: "Aujourd'hui" },
    { value: 'weekend', label: 'Ce week-end' },
    { value: 'next_month', label: 'Mois prochain' },
  ]);

  readonly categoryFilterOptions = computed<CategoryFilterOption[]>(() => [
    { value: '', label: 'Tous' },
    { value: 'concert', label: 'Musique' },
    { value: 'exhibition', label: 'Art' },
    { value: 'conference', label: 'Tech' },
    { value: 'sport', label: 'Sport' },
  ]);

  readonly footerConfig = computed<FooterConfig>(() => ({
    groups: [
      {
        title: 'À propos',
        links: [
          { label: 'Qui sommes-nous', route: '/about' },
          { label: 'Carrières', route: '/careers' },
          { label: 'Presse', route: '/press' },
        ],
      },
      {
        title: 'Aide',
        links: [
          { label: 'Support client', route: '/support' },
          { label: 'Remboursements', route: '/refunds' },
          { label: 'Confidentialité', route: '/privacy' },
        ],
      },
      {
        title: 'Découvrir',
        links: [
          { label: 'Concerts', route: '/events?category=concert' },
          { label: 'Théâtre', route: '/events?category=theater' },
          { label: 'Festivals', route: '/events?category=festival' },
        ],
      },
    ],
    copyright: '© 2024 EventPlace. Tous droits réservés.',
    legalLinks: [
      { label: 'Conditions', route: '/terms' },
      { label: 'Cookies', route: '/cookies' },
    ],
    socialLinks: [
      { label: 'IG', url: '#' },
      { label: 'X', url: '#' },
      { label: 'FB', url: '#' },
    ],
  }));

  loadEvents(filters?: Partial<MarketplaceFilters>, page = 1, limit = 12): Observable<MarketplaceListResponse> {
    this.loading.set(true);
    this.error.set(null);
    if (filters) this.filters.update((f) => ({ ...f, ...filters }));

    const current = this.filters();
    const params: Record<string, string | number> = {
      page: String(page),
      limit: String(limit),
    };
    if (current.search) params['search'] = current.search;
    if (current.category) params['category'] = current.category;
    if (current.priceMax != null) params['maxPrice'] = String(current.priceMax);
    if (current.datePreset) {
      const range = this.datePresetToRange(current.datePreset);
      if (range.from) params['dateFrom'] = range.from;
      if (range.to) params['dateTo'] = range.to;
    }

    return this.api.get<{ data: unknown[]; meta?: unknown }>('events', params).pipe(
      map((res) => this.mapApiToListResponse(res)),
      tap((res) => {
        if (page > 1) {
          this.events.update((prev) => [...prev, ...res.data]);
        } else {
          this.events.set(res.data);
        }
        this.meta.set(res.meta);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erreur chargement');
        const fallback = this.getMockListResponse();
        this.events.set(fallback.data);
        this.meta.set(fallback.meta);
        return of(fallback);
      })
    );
  }

  getEventById(id: string): Observable<EventDetail | null> {
    return this.api.get<unknown>(`events/${id}`).pipe(
      map((raw) => this.mapApiToEventDetail(raw, id)),
      catchError(() => of(null))
    );
  }

  getEventDetail(id: string): Observable<{
    event: EventDetail;
    ticketOptions: EventDetailTicketOption[];
    artists: EventDetailArtist[];
    reviews: EventDetailReview[];
    seatMapSections: SeatMapSection[];
  } | null> {
    return this.getEventById(id).pipe(
      map((event) => {
        if (!event) return null;
        return {
          event,
          ticketOptions: this.getTicketOptionsForEvent(event),
          artists: this.getArtistsForEvent(event),
          reviews: this.getReviewsForEvent(event),
          seatMapSections: this.getSeatMapSectionsForEvent(event),
        };
      })
    );
  }

  updateFilters(filters: Partial<MarketplaceFilters>): void {
    this.filters.update((f) => ({ ...f, ...filters }));
  }

  private datePresetToRange(preset: string): { from?: string; to?: string } {
    const now = new Date();
    switch (preset) {
      case 'today':
        const d = now.toISOString().slice(0, 10);
        return { from: d, to: d };
      case 'weekend': {
        const day = now.getDay();
        const sat = new Date(now);
        sat.setDate(now.getDate() + (6 - day));
        const sun = new Date(sat);
        sun.setDate(sat.getDate() + 1);
        return {
          from: sat.toISOString().slice(0, 10),
          to: sun.toISOString().slice(0, 10),
        };
      }
      case 'next_month': {
        const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const end = new Date(next.getFullYear(), next.getMonth() + 1, 0);
        return {
          from: next.toISOString().slice(0, 10),
          to: end.toISOString().slice(0, 10),
        };
      }
      default:
        return {};
    }
  }

  private mapApiToListResponse(res: { data: unknown[]; meta?: unknown }): MarketplaceListResponse {
    const data = Array.isArray(res.data) ? res.data : [];
    const events = data.map((e: unknown) => this.mapRawToCard(e as Record<string, unknown>));
    const meta = (res.meta as MarketplaceListResponse['meta']) ?? {
      total: events.length,
      page: 1,
      limit: 12,
      totalPages: 1,
    };
    return { data: events, meta };
  }

  private mapRawToCard(e: Record<string, unknown>): MarketplaceEventCard {
    const id = String(e['id'] ?? '');
    const date = e['date'] ? new Date(e['date'] as string) : new Date();
    const images = (e['images'] as string[]) ?? [];
    const banner = (e['bannerImage'] as string) ?? images[0] ?? '';
    const category = String(e['category'] ?? '');
    const available = Number(e['availableSeats'] ?? 0);
    const total = Number(e['totalCapacity'] ?? 0);
    const basePrice = Number(e['basePrice'] ?? 0);

    let badge: EventCardBadge | undefined;
    if (Math.random() > 0.6) {
      badge = { kind: 'vip', label: 'VIP Dispo', icon: 'diamond' };
    } else if (total > 0 && available / total < 0.2) {
      badge = { kind: 'low_stock', label: 'Peu de places', icon: 'local_fire_department' };
    }

    const rating = 4 + Math.random() * 0.9;
    const reviewCount = Math.floor(20 + Math.random() * 300);

    return {
      id,
      title: String(e['title'] ?? ''),
      imageUrl: banner || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
      imageAlt: String(e['title'] ?? ''),
      dateLabel: this.formatDateShort(date),
      date,
      location: String(e['venueName'] ?? e['location'] ?? e['city'] ?? ''),
      rating: Math.round(rating * 10) / 10,
      reviewCount,
      badge,
      priceFrom: basePrice,
      priceCurrency: 'TND',
      category: CATEGORY_LABELS[category] ?? category,
    };
  }

  private formatDateShort(d: Date): string {
    return d.toLocaleDateString(DATE_LOCALE, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private getMockListResponse(): MarketplaceListResponse {
    const mock: MarketplaceEventCard[] = [
      {
        id: '1',
        title: 'Neon Nights Festival 2024',
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
        dateLabel: 'Sam, 12 Oct • 19:00',
        date: new Date('2024-10-12T19:00:00'),
        location: 'Paris Expo Porte de Versailles',
        rating: 4.9,
        reviewCount: 128,
        badge: { kind: 'vip', label: 'VIP Dispo', icon: 'diamond' },
        priceFrom: 45,
        priceCurrency: 'TND',
      },
      {
        id: '2',
        title: 'Tech Summit: Future of AI',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        dateLabel: 'Lun, 24 Oct • 09:00',
        date: new Date('2024-10-24T09:00:00'),
        location: 'Station F, Paris',
        rating: 4.5,
        reviewCount: 84,
        badge: { kind: 'low_stock', label: 'Peu de places', icon: 'local_fire_department' },
        priceFrom: 120,
        priceCurrency: 'TND',
      },
      {
        id: '3',
        title: "Atelier Cuisine: Chefs Étoilés",
        imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400',
        dateLabel: 'Dim, 15 Oct • 14:00',
        date: new Date('2024-10-15T14:00:00'),
        location: "L'Atelier des Chefs, Lyon",
        rating: 4.7,
        reviewCount: 210,
        priceFrom: 85,
        priceCurrency: 'TND',
      },
      {
        id: '4',
        title: "Nuit de l'Art Moderne",
        imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400',
        dateLabel: 'Ven, 20 Oct • 18:30',
        date: new Date('2024-10-20T18:30:00'),
        location: "Musée d'Orsay, Paris",
        rating: 4.2,
        reviewCount: 45,
        priceFrom: 25,
        priceCurrency: 'TND',
      },
      {
        id: '5',
        title: 'Yoga au lever du soleil',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
        dateLabel: 'Dim, 22 Oct • 07:00',
        date: new Date('2024-10-22T07:00:00'),
        location: 'Parc des Buttes, Paris',
        rating: 5,
        reviewCount: 12,
        priceFrom: 15,
        priceCurrency: 'TND',
      },
      {
        id: '6',
        title: 'Soirée Stand-up Comedy',
        imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c91c8d0c4e?w=400',
        dateLabel: 'Mer, 25 Oct • 20:30',
        date: new Date('2024-10-25T20:30:00'),
        location: 'Le Comedy Club, Paris',
        rating: 4.8,
        reviewCount: 340,
        badge: { kind: 'vip', label: 'VIP Dispo', icon: 'diamond' },
        priceFrom: 30,
        priceCurrency: 'TND',
      },
    ];
    return {
      data: mock,
      meta: { total: mock.length, page: 1, limit: 12, totalPages: 1 },
    };
  }

  private mapApiToEventDetail(raw: unknown, id: string): EventDetail {
    const e = (raw || {}) as Record<string, unknown>;
    const date = e['date'] ? new Date(e['date'] as string) : new Date();
    const images = (e['images'] as string[]) ?? [];
    const banner = (e['bannerImage'] as string) ?? images[0] ?? '';
    const category = String(e['category'] ?? 'other');
    const available = Number(e['availableSeats'] ?? 0);

    return {
      id,
      title: String(e['title'] ?? ''),
      description: String(e['description'] ?? ''),
      category,
      categoryLabel: CATEGORY_LABELS[category] ?? category,
      tags: [CATEGORY_LABELS[category] ?? category, 'Festival'].filter(Boolean),
      date,
      dateLabel: date.toLocaleDateString(DATE_LOCALE, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
      timeRange: '20:00 - 04:00',
      venueName: String(e['venueName'] ?? e['location'] ?? ''),
      address: String(e['location'] ?? ''),
      city: String(e['city'] ?? ''),
      country: String(e['country'] ?? ''),
      organizerId: String(e['organizerId'] ?? ''),
      organizerName: 'EventLife Paris',
      organizerLogoUrl: undefined,
      images: images.length ? images : [banner].filter(Boolean),
      bannerImage: banner || undefined,
      priceFrom: Number(e['basePrice'] ?? 45),
      priceCurrency: 'TND',
      isAvailable: available > 0,
      availabilityLabel: available > 0 ? 'Dispo' : 'Complet',
      rating: 4.8,
      reviewCount: 320,
    };
  }

  private getTicketOptionsForEvent(event: EventDetail): EventDetailTicketOption[] {
    return [
      { id: 'std', name: 'Pass Standard', description: 'Accès Fosse', price: event.priceFrom, currency: event.priceCurrency, isDefault: true },
      { id: 'seat', name: 'Place Assise', description: 'Gradins Cat. 1', price: 65, currency: event.priceCurrency },
      { id: 'vip', name: 'Pass VIP', description: 'Accès Backstage + Boissons', price: 120, currency: event.priceCurrency },
    ];
  }

  private getArtistsForEvent(_event: EventDetail): EventDetailArtist[] {
    return [
      { id: '1', name: 'DJ Alexia', role: 'Headliner', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100' },
      { id: '2', name: 'The Bass Drops', role: 'Electro', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100' },
      { id: '3', name: 'Sarah V', role: 'Techno', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100' },
      { id: '4', name: 'Mike & Synths', role: 'House', imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=100' },
    ];
  }

  private getReviewsForEvent(_event: EventDetail): EventDetailReview[] {
    return [
      { id: '1', authorName: 'Thomas D.', authorAvatarUrl: undefined, timeAgo: 'Il y a 2 jours', rating: 5, content: "L'organisation est toujours au top. J'ai adoré l'édition précédente, hâte d'y être !" },
      { id: '2', authorName: 'Marie L.', authorAvatarUrl: undefined, timeAgo: 'Il y a 1 semaine', rating: 4.5, content: 'Super programmation cette année. Juste un petit bémol sur le prix des boissons l\'an dernier.' },
    ];
  }

  private getSeatMapSectionsForEvent(event: EventDetail): SeatMapSection[] {
    return [
      { id: 'pit', name: 'Fosse (Debout)', price: event.priceFrom, kind: 'standing' },
    ];
  }
}
