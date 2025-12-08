import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  ChevronDown,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { orders as initialOrders, Order, OrderStatus, getOrderStatusColor } from '@/data/orders';
import { toast } from 'sonner';

const statusOptions: { value: OrderStatus; label: string; icon: React.ElementType }[] = [
  { value: 'pending', label: 'Pending', icon: Clock },
  { value: 'paid', label: 'Paid', icon: CreditCard },
  { value: 'processing', label: 'Processing', icon: Package },
  { value: 'shipped', label: 'Shipped', icon: Truck },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle },
];

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      )
    );
    toast.success(`Order status updated to ${newStatus}`);
  };

  const orderStats = {
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track all customer orders ({orders.length} total)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: orderStats.pending, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Processing', value: orderStats.processing, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Shipped', value: orderStats.shipped, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
          { label: 'Delivered', value: orderStats.delivered, color: 'text-green-500', bg: 'bg-green-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <span className={`font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-secondary/50">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-4 font-medium text-muted-foreground">Order</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Items</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Total</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border hover:bg-secondary/20 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {order.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="min-w-0">
                      <p className="font-medium truncate max-w-[150px]">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                        {order.customer.email}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            src={item.product.images[0]}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover border-2 border-background"
                          />
                        ))}
                      </div>
                      {order.items.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{order.items.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-primary">{formatPrice(order.total)}</p>
                  </td>
                  <td className="p-4">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                    >
                      <SelectTrigger className={`w-32 h-8 text-xs ${getOrderStatusColor(order.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              <status.icon className="h-3 w-3" />
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Order {selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Status</p>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium capitalize ${getOrderStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-medium capitalize">
                    {selectedOrder.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-medium mb-3">Customer Details</h3>
                <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{selectedOrder.customer.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <p className="font-medium text-primary">{formatPrice(item.price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {selectedOrder.shipping === 0
                      ? 'Free'
                      : formatPrice(selectedOrder.shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex gap-4 text-sm text-muted-foreground">
                <p>Created: {formatDate(selectedOrder.createdAt)}</p>
                <p>Updated: {formatDate(selectedOrder.updatedAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;
