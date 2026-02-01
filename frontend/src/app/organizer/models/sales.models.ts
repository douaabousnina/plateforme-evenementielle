export interface SalesDataPoint {
  date: string;
  amount: number;
  label: string;
}

export interface SalesResponse {
  data: SalesDataPoint[];
  totalSales: number;
  averageSalesPerDay: number;
  period: {
    from: string;
    to: string;
  };
}
