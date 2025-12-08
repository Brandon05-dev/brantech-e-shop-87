import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  ArrowUpRight,
} from 'lucide-react';

const Analytics: React.FC = () => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(price);
  };

  // Mock data
  const monthlyData = [
    { month: 'Jul', revenue: 320000, orders: 45 },
    { month: 'Aug', revenue: 450000, orders: 62 },
    { month: 'Sep', revenue: 380000, orders: 51 },
    { month: 'Oct', revenue: 520000, orders: 78 },
    { month: 'Nov', revenue: 610000, orders: 89 },
    { month: 'Dec', revenue: 890000, orders: 124 },
  ];

  const topCategories = [
    { name: 'Smartphones', sales: 2450000, percentage: 35 },
    { name: 'Laptops', sales: 1890000, percentage: 27 },
    { name: 'Audio', sales: 980000, percentage: 14 },
    { name: 'Gaming', sales: 750000, percentage: 11 },
    { name: 'Accessories', sales: 630000, percentage: 9 },
    { name: 'Others', sales: 300000, percentage: 4 },
  ];

  const trafficSources = [
    { source: 'Direct', visits: 4500, percentage: 40 },
    { source: 'Google', visits: 3200, percentage: 28 },
    { source: 'Social Media', visits: 2100, percentage: 19 },
    { source: 'Referral', visits: 1500, percentage: 13 },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Track your store performance and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: formatPrice(3170000),
            change: '+23.5%',
            positive: true,
            icon: DollarSign,
            color: 'text-primary bg-primary/10',
          },
          {
            label: 'Total Orders',
            value: '449',
            change: '+18.2%',
            positive: true,
            icon: ShoppingCart,
            color: 'text-green-500 bg-green-500/10',
          },
          {
            label: 'Conversion Rate',
            value: '3.2%',
            change: '-0.5%',
            positive: false,
            icon: TrendingUp,
            color: 'text-yellow-500 bg-yellow-500/10',
          },
          {
            label: 'Avg. Order Value',
            value: formatPrice(7060),
            change: '+12.8%',
            positive: true,
            icon: DollarSign,
            color: 'text-accent bg-accent/10',
          },
        ].map((metric) => (
          <div key={metric.label} className="glass-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${metric.color}`}>
                <metric.icon className="h-5 w-5" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  metric.positive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {metric.positive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {metric.change}
              </div>
            </div>
            <p className="font-display text-2xl font-bold">{metric.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-card p-6">
          <h2 className="font-display text-xl font-bold mb-6">Revenue Trend</h2>
          <div className="flex items-end justify-between gap-3 h-52">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full flex flex-col items-center">
                  <span className="text-xs text-muted-foreground mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatPrice(data.revenue)}
                  </span>
                  <div
                    className="w-full bg-primary rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                    style={{ 
                      height: `${(data.revenue / maxRevenue) * 160}px`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card p-6">
          <h2 className="font-display text-xl font-bold mb-6">Sales by Category</h2>
          <div className="space-y-4">
            {topCategories.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{category.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatPrice(category.sales)} ({category.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="glass-card p-6">
          <h2 className="font-display text-xl font-bold mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div
                key={source.source}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{source.source}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{source.visits.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{source.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="font-display text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New order placed', detail: 'Order #BT-2024-007 - KSh 149,999', time: '2 min ago', type: 'order' },
              { action: 'Product stock low', detail: 'PlayStation 5 Console - 5 units left', time: '15 min ago', type: 'alert' },
              { action: 'New customer registered', detail: 'james.k@email.com', time: '32 min ago', type: 'user' },
              { action: 'Payment received', detail: 'Order #BT-2024-006 via M-Pesa', time: '1 hour ago', type: 'payment' },
              { action: 'Order shipped', detail: 'Order #BT-2024-005 - Nairobi', time: '2 hours ago', type: 'shipping' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.detail}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {activity.time}
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
