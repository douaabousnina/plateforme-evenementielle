import { SalesResponse } from '../models/sales.models';

export const MOCK_SALES_DATA: SalesResponse = {
  data: [
    { date: '2024-01-01', amount: 4200, label: '01 Nov' },
    { date: '2024-01-05', amount: 3800, label: '05 Nov' },
    { date: '2024-01-10', amount: 5100, label: '10 Nov' },
    { date: '2024-01-15', amount: 4900, label: '15 Nov' },
    { date: '2024-01-20', amount: 5600, label: '20 Nov' },
    { date: '2024-01-25', amount: 6200, label: '25 Nov' },
    { date: '2024-01-30', amount: 5800, label: '30 Nov' }
  ],
  totalSales: 35700,
  averageSalesPerDay: 5100,
  period: {
    from: '2024-01-01',
    to: '2024-01-30'
  }
};
