export interface KpiData{
    title: string;
    value: string | number;
    icon: string;
    trendIcon: string;
    trend: string;
    sub: string;
}

export interface KpiResponse{
    revenue: KpiData;
    customers: KpiData;
    orders: KpiData;
    conversion: KpiData;
}