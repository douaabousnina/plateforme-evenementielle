

export interface MarketplaceEventCard {
  id: string;
  title: string;
  imageUrl: string;
  imageAlt?: string;
  dateLabel: string;
  date: Date;
  location: string;
  rating?: number;
  reviewCount?: number;
  badge?: EventCardBadge;
  priceFrom: number;
  priceCurrency: string;
  isFavorite?: boolean;
  category?: string;
}

export type EventCardBadgeKind = 'vip' | 'low_stock' | 'none';

export interface EventCardBadge {
  kind: EventCardBadgeKind;
  label: string;
  icon?: string;
}

export interface MarketplaceFilters {
  search: string;
  datePreset: string;
  category: string;
  priceMax: number | null;
}

export interface DateFilterOption {
  value: string;
  label: string;
}

export interface CategoryFilterOption {
  value: string;
  label: string;
}

export interface MarketplaceListResponse {
  data: MarketplaceEventCard[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; route: string }[];
}

export interface FooterConfig {
  groups: FooterLinkGroup[];
  copyright: string;
  legalLinks: { label: string; route: string }[];
  socialLinks?: { label: string; url: string }[];
}
