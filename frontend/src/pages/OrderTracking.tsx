import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Package,
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  ArrowLeft,
  Loader2,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  User,
  Home,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { orderAPI } from '@/services/api';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    street: string;
    city: string;
    county: string;
    postalCode: string;
    phone: string;
  };
  customer: {
    name: string;
    email: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  timeline: Array<{
    status: string;
    message: string;
    date: string;
  }>;
}

const OrderTracking: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchOrderId, setSearchOrderId] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setIsLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await orderAPI.trackOrder(id);
      if (response.success) {
        setOrder(response.data);
      } else {
        toast.error('Order not found');
      }
    } catch (error: any) {
      console.error('Failed to fetch order:', error);
      toast.error(error.response?.data?.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchOrderId.trim()) {
      navigate(`/track-order/${searchOrderId.trim()}`);
    }
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
        return <CheckCircle className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  // Search form when no order ID
  if (!orderId || (!isLoading && !order)) {
    return (
      <>
        <Helmet>
          <title>Track Your Order - Brantech Electronics</title>
          <meta name="description" content="Track your order status and delivery information" />
        </Helmet>

        <div className="min-h-screen bg-background py-12">
          <div className="container max-w-2xl mx-auto px-4">
            <div className="text-center mb-8">
              <Package className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
              <p className="text-muted-foreground">
                Enter your order number to track your package
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Order Number
                    </label>
                    <input
                      type="text"
                      value={searchOrderId}
                      onChange={(e) => setSearchOrderId(e.target.value)}
                      placeholder="Enter your order number (e.g., ORD-12345)"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Track Order
                  </Button>
                </form>

                <Separator className="my-6" />

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Need help finding your order number?
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center justify-center gap-2">
                      <Mail className="h-4 w-4" />
                      Check your order confirmation email
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <User className="h-4 w-4" />
                      Or view your orders in your{' '}
                      <Link to="/profile" className="text-primary hover:underline">
                        profile
                      </Link>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find an order with that number
            </p>
            <Button onClick={() => navigate('/track-order')}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Track Order #{order.orderNumber} - Brantech Electronics</title>
        <meta name="description" content={`Track order ${order.orderNumber}`} />
      </Helmet>

      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Order Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Order #{order.orderNumber}
                  </h1>
                  <p className="text-muted-foreground">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                  <Badge
                    className={`${getStatusColor(order.status)} text-white text-sm px-4 py-1`}
                  >
                    <span className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {order.status.toUpperCase()}
                    </span>
                  </Badge>
                  {order.trackingNumber && (
                    <p className="text-sm text-muted-foreground">
                      Tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tracking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Timeline</CardTitle>
                  <CardDescription>Track your order progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {order.timeline?.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(
                              event.status
                            )} text-white`}
                          >
                            {getStatusIcon(event.status)}
                          </div>
                          {index < order.timeline.length - 1 && (
                            <div className="w-0.5 h-12 bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <h4 className="font-semibold capitalize">
                            {event.status.replace('-', ' ')}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {event.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(event.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.estimatedDelivery && order.status !== 'delivered' && (
                    <div className="mt-6 p-4 bg-accent rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Estimated Delivery:</span>
                        <span>{formatDate(order.estimatedDelivery)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                          <p className="font-semibold mt-1">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="font-medium">{order.customer.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.county}
                  </p>
                  <p>{order.shippingAddress.postalCode}</p>
                  <div className="pt-2 flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {order.shippingAddress.phone}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium capitalize">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/contact">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" />
                      View All Orders
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderTracking;
