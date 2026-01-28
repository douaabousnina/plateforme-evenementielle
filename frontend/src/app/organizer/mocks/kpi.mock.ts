import { KpiResponse } from "../models/kpi.models";
export const MOCK_KPI_DATA: KpiResponse = {
  revenue: {
    title: 'Revenu Total',
    value: '45,231',
    icon: 'payments',
    trendIcon: 'trending_up',
    trend: '+20.1%',
    sub: 'vs mois dernier'
  },
  orders: {
    title: 'Commandes',
    value: '2,350',
    icon: 'shopping_cart',
    trendIcon: 'trending_up',
    trend: '+15.3%',
    sub: 'vs mois dernier'
  },
  customers: {
    title: 'Nouveaux Clients',
    value: '345',
    icon: 'group',
    trendIcon: 'trending_down',
    trend: '-2.4%',
    sub: 'vs mois dernier'
  },
  conversion: {
    title: 'Taux de Conversion',
    value: '3.24%',
    icon: 'analytics',
    trendIcon: 'trending_up',
    trend: '+5.1%',
    sub: 'vs mois dernier'
  }
};