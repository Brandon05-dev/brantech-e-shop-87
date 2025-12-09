import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { adminDashboardAPI } from '../../services/adminAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

/**
 * Admin Dashboard Page
 * Shows key metrics and statistics for the e-commerce platform
 */
const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetch dashboard statistics
   */
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await adminDashboardAPI.getStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to fetch dashboard statistics');
      }
    } catch (err: any) {
      console.error('Dashboard stats error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  /**
   * Format currency
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  /**
   * Loading State
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  /**
   * Error State
   */
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  /**
   * Main Dashboard Render
   */
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Brantech E-Shop</title>
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your e-commerce platform.
          </p>
        </div>

        {/* Overview Stats - Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.overview?.totalUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered customers
              </p>
            </CardContent>
          </Card>

          {/* Total Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.overview?.totalProducts || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                In inventory
              </p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.overview?.totalOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All time
              </p>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.overview?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg: {formatCurrency(stats?.overview?.averageOrderValue || 0)} per order
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Current order distribution across statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Pending */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.ordersByStatus?.pending || 0}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>

              {/* Processing */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.ordersByStatus?.processing || 0}</p>
                  <p className="text-xs text-muted-foreground">Processing</p>
                </div>
              </div>

              {/* Shipped */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <Package className="h-8 w-8 text-purple-600 dark:text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.ordersByStatus?.shipped || 0}</p>
                  <p className="text-xs text-muted-foreground">Shipped</p>
                </div>
              </div>

              {/* Delivered */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.ordersByStatus?.delivered || 0}</p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
              </div>

              {/* Cancelled */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.ordersByStatus?.cancelled || 0}</p>
                  <p className="text-xs text-muted-foreground">Cancelled</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders and Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Last 5 orders placed</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentOrders.map((order: any) => (
                    <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.user?.name || 'Guest'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                        <p className={`text-xs px-2 py-1 rounded-full inline-block ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400'
                        }`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No recent orders</p>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Low Stock Alert
              </CardTitle>
              <CardDescription>Products with less than 10 units</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.lowStockProducts.map((product: any) => (
                    <div key={product._id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          product.stock === 0 ? 'text-red-600' :
                          product.stock < 5 ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}>
                          {product.stock}
                        </p>
                        <p className="text-xs text-muted-foreground">in stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  All products have sufficient stock
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
