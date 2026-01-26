import { AlertsResponse } from "../models/alerts.models";
export const MOCK_ALERTS_DATA: AlertsResponse = {
  alerts: [
    {
      id: '1',
      type: 'warning',
      title: 'Stock faible',
      message: 'Festival Électro Night - Plus que 45 places',
      time: 'Il y a 5 min',
      icon: 'warning'
    },
    {
      id: '2',
      type: 'success',
      title: 'Paiement reçu',
      message: 'Nouveau paiement de 1,250€ reçu',
      time: 'Il y a 1h',
      icon: 'check_circle'
    },
    {
      id: '3',
      type: 'info',
      title: 'Nouvel événement',
      message: 'Concert Jazz Live a été publié',
      time: 'Il y a 2h',
      icon: 'info'
    }
  ]
};