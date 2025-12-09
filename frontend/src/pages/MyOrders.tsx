import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Loader2,
  ArrowLeft,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  CreditCard,
  Home,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { orderAPI } from '@/services/api';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  items: any[];
  total: number;
  createdAt: string;
  isPaid: boolean;
  isDelivered: boolean;
}

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, activeTab, searchQuery]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderAPI.getOrders();
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to view your orders');
        navigate('/auth');
      } else {
        toast.error('Failed to load orders');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter((order) => order.status === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  const getOrderCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  };

  const counts = getOrderCounts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders - Brantech Electronics</title>
        <meta name="description" content="View and track all your orders" />
      </Helmet>

      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Shop</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Profile</span>
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Orders</h1>
                <p className="text-muted-foreground">
                  Track and manage all your orders
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{counts.all}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-600">{counts.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{counts.processing}</div>
                <div className="text-sm text-muted-foreground">Processing</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{counts.shipped}</div>
                <div className="text-sm text-muted-foreground">Shipped</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{counts.delivered}</div>
                <div className="text-sm text-muted-foreground">Delivered</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{counts.cancelled}</div>
                <div className="text-sm text-muted-foreground">Cancelled</div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Filter and view your orders by status</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                  <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="shipped">Shipped</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery
                          ? 'Try a different search term'
                          : activeTab === 'all'
                          ? "You haven't placed any orders yet"
                          : `You don't have any ${activeTab} orders`}
                      </p>
                      {!searchQuery && activeTab === 'all' && (
                        <Button onClick={() => navigate('/products')}>
                          Start Shopping
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <Card key={order._id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              {/* Order Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                                    </h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                      <Calendar className="h-4 w-4" />
                                      {formatDate(order.createdAt)}
                                    </p>
                                  </div>
                                  <Badge
                                    className={`${getStatusColor(order.status)} text-white`}
                                  >
                                    <span className="flex items-center gap-1">
                                      {getStatusIcon(order.status)}
                                      {order.status.toUpperCase()}
                                    </span>
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
                                  <span className="flex items-center gap-1">
                                    <Package className="h-4 w-4" />
                                    {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <CreditCard className="h-4 w-4" />
                                    {order.isPaid ? (
                                      <Badge variant="default" className="text-xs">Paid</Badge>
                                    ) : (
                                      <Badge variant="secondary" className="text-xs">Unpaid</Badge>
                                    )}
                                  </span>
                                  {order.isDelivered && (
                                    <span className="flex items-center gap-1">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span className="text-green-600">Delivered</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Amount & Actions */}
                              <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Total</p>
                                  <p className="text-xl font-bold">
                                    {formatCurrency(order.total)}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/track-order/${order.orderNumber || order._id}`)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Track
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MyOrders;
