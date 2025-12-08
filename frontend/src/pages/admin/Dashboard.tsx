import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { Button } from '@/components/ui/button';
import { orders, getOrderStatusColor } from '@/data/orders';
import { products } from '@/data/products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realtimeOrders, setRealtimeOrders] = useState(orders.length);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setRealtimeOrders(prev => prev + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  
  const totalOrders = realtimeOrders;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'processing').length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(price);
  };

  const recentOrders = orders.slice(0, 5);

  // Mock chart data
  const revenueData = [
    { month: 'Jan', revenue: 450000 },
    { month: 'Feb', revenue: 520000 },
    { month: 'Mar', revenue: 480000 },
    { month: 'Apr', revenue: 610000 },
    { month: 'May', revenue: 590000 },
    { month: 'Jun', revenue: 720000 },
  ];

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Dashboard refreshed');
    }, 1000);
  };

  const handleExport = () => {
    toast.success('Exporting data...');
  };

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          change="+8.2% from last month"
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Total Products"
          value={totalProducts}
          change={`${lowStockProducts} low stock`}
          changeType="neutral"
          icon={Package}
        />
        <StatsCard
          title="Customers"
          value="1,234"
          change="+4.7% from last month"
          changeType="positive"
          icon={Users}
        />
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold">{pendingOrders}</span>
          </div>
          <p className="text-sm text-muted-foreground">Pending</p>
          <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500" style={{ width: '45%' }} />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold">{processingOrders}</span>
          </div>
          <p className="text-sm text-muted-foreground">Processing</p>
          <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: '65%' }} />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <Package className="h-5 w-5 text-purple-500" />
            <span className="text-2xl font-bold">{orders.filter((o) => o.status === 'shipped').length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Shipped</p>
          <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-purple-500" style={{ width: '80%' }} />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold">{orders.filter((o) => o.status === 'delivered').length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Delivered</p>
          <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Quick Actions Alert */}
      {(pendingOrders > 0 || lowStockProducts > 0) && (
        <div className="glass-card p-4 border-l-4 border-yellow-500">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Action Required</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                {pendingOrders > 0 && (
                  <p>• {pendingOrders} pending orders need attention</p>
                )}
                {lowStockProducts > 0 && (
                  <p>• {lowStockProducts} products are running low on stock</p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/orders">Review</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Charts & Recent Orders */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold">Revenue Overview</h2>
              <p className="text-sm text-muted-foreground">Monthly revenue trend</p>
            </div>
            <div className="flex items-center gap-2 text-green-500">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+23.5%</span>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {revenueData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full">
                  <div
                    className="w-full bg-primary rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                    style={{
                      height: `${(data.revenue / maxRevenue) * 180}px`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                    {formatPrice(data.revenue)}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold">Recent Orders</h2>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{order.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">
                    {new Intl.NumberFormat('en-KE', {
                      style: 'currency',
                      currency: 'KES',
                      minimumFractionDigits: 0,
                    }).format(order.total)}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${getOrderStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Low Stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold">Top Products</h2>
            <Link to="/admin/products">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {products.filter((p) => p.bestseller).slice(0, 4).map((product, index) => (
              <div key={product.id} className="flex items-center gap-4">
                <span className="text-lg font-bold text-muted-foreground w-6">
                  {index + 1}
                </span>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-secondary"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">+{12 + index * 3}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold">Low Stock Alert</h2>
            <span className="px-2 py-1 rounded bg-destructive/10 text-destructive text-xs font-bold">
              {lowStockProducts} items
            </span>
          </div>

          <div className="space-y-4">
            {products.filter((p) => p.stock < 30).slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-secondary"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          product.stock < 10
                            ? 'bg-destructive'
                            : product.stock < 20
                            ? 'bg-yellow-500'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{product.stock} left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
