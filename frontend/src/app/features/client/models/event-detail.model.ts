/**
 * Event detail page models. All data from API or config – no hardcoding in templates.
 */

export interface EventDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  date: Date;
  dateLabel: string;
  timeRange: string;
  venueName: string;
  address: string;
  city?: string;
  country?: string;
  organizerId?: string;
  organizerName: string;
  organizerLogoUrl?: string;
  images: string[];
  bannerImage?: string;
  priceFrom: number;
  priceCurrency: string;
  isAvailable: boolean;
  availabilityLabel: string;
  rating?: number;
  reviewCount?: number;
}

export interface EventDetailTicketOption {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  isDefault?: boolean;
}

export interface EventDetailArtist {
  id: string;
  name: string;
  role?: string;
  imageUrl?: string;
}

export interface EventDetailReview {
  id: string;
  authorName: string;
  authorAvatarUrl?: string;
  timeAgo: string;
  rating: number;
  content: string;
}

export interface SeatMapSection {
  id: string;
  name: string;
  price?: number;
  kind: 'standing' | 'seated';
}

export interface EventDetailBreadcrumb {
  label: string;
  route: string;
}
