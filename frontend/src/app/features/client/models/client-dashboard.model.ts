/**
 * Models for the client dashboard (Espace Client - Tableau de Bord).
 * All display data is provided by ClientDashboardService – no hardcoding in templates.
 */

export interface UpcomingEventCard {
  id: string;
  title: string;
  venueName: string;
  dateLabel: string; // e.g. "12 NOV"
  date: Date;
  imageUrl: string;
  ticketCount: number;
  ticketLabel: string; // e.g. "2 Billets" or "1 Billet Pro"
}

export interface RecommendationCard {
  id: string;
  category: string;
  categoryColorClass: string; // e.g. "text-primary", "text-green-600"
  title: string;
  description: string;
  dateLabel: string;
  date: Date;
  imageUrl: string;
}

export interface LoyaltyInfo {
  points: number;
  pointsLabel: string;
  status: string;
  statusLabel: string;
  progressPercent: number;
  progressLabel: string;
  rewardsButtonLabel: string;
}

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  route?: string;
  action?: () => void;
}

export interface NotificationItem {
  id: string;
  title: string;
  timeAgo: string;
  unread: boolean;
}

export interface WelcomeSectionData {
  greeting: string;
  subtitle: string;
  upcomingCount: number;
  currentDateLabel: string;
}

export interface ClientDashboardData {
  welcome: WelcomeSectionData;
  upcomingEvents: UpcomingEventCard[];
  recommendations: RecommendationCard[];
  loyalty: LoyaltyInfo;
  quickActions: QuickAction[];
  notifications: NotificationItem[];
}
