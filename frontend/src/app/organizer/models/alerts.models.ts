export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  icon: string;
}

export interface AlertsResponse {
  alerts: Alert[];
}