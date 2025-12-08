import { Product } from './products';

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'mpesa' | 'card';
  createdAt: Date;
  updatedAt: Date;
}

export const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'BT-2024-001',
    customer: {
      name: 'John Kamau',
      email: 'john.kamau@email.com',
      phone: '+254 712 345 678',
      address: 'Westlands, Nairobi',
    },
    items: [
      { product: { id: '1', name: 'MacBook Pro 16" M3 Max', price: 349999, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'] } as any, quantity: 1, price: 349999 },
    ],
    subtotal: 349999,
    shipping: 0,
    total: 349999,
    status: 'delivered',
    paymentMethod: 'mpesa',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '2',
    orderNumber: 'BT-2024-002',
    customer: {
      name: 'Mary Wanjiku',
      email: 'mary.w@email.com',
      phone: '+254 723 456 789',
      address: 'Kilimani, Nairobi',
    },
    items: [
      { product: { id: '2', name: 'iPhone 15 Pro Max', price: 189999, images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'] } as any, quantity: 1, price: 189999 },
      { product: { id: '8', name: 'AirPods Pro (2nd Gen)', price: 24999, images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800'] } as any, quantity: 1, price: 24999 },
    ],
    subtotal: 214998,
    shipping: 0,
    total: 214998,
    status: 'shipped',
    paymentMethod: 'card',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: '3',
    orderNumber: 'BT-2024-003',
    customer: {
      name: 'Peter Ochieng',
      email: 'peter.o@email.com',
      phone: '+254 734 567 890',
      address: 'Karen, Nairobi',
    },
    items: [
      { product: { id: '4', name: 'PlayStation 5 Console', price: 74999, images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800'] } as any, quantity: 1, price: 74999 },
    ],
    subtotal: 74999,
    shipping: 500,
    total: 75499,
    status: 'processing',
    paymentMethod: 'mpesa',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: '4',
    orderNumber: 'BT-2024-004',
    customer: {
      name: 'Grace Muthoni',
      email: 'grace.m@email.com',
      phone: '+254 745 678 901',
      address: 'Lavington, Nairobi',
    },
    items: [
      { product: { id: '3', name: 'Sony WH-1000XM5 Headphones', price: 34999, images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800'] } as any, quantity: 2, price: 69998 },
    ],
    subtotal: 69998,
    shipping: 500,
    total: 70498,
    status: 'paid',
    paymentMethod: 'card',
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
  },
  {
    id: '5',
    orderNumber: 'BT-2024-005',
    customer: {
      name: 'David Njoroge',
      email: 'david.n@email.com',
      phone: '+254 756 789 012',
      address: 'Kileleshwa, Nairobi',
    },
    items: [
      { product: { id: '6', name: 'Dell XPS 15 (2024)', price: 224999, images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800'] } as any, quantity: 1, price: 224999 },
    ],
    subtotal: 224999,
    shipping: 0,
    total: 224999,
    status: 'pending',
    paymentMethod: 'mpesa',
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
  },
  {
    id: '6',
    orderNumber: 'BT-2024-006',
    customer: {
      name: 'Sarah Akinyi',
      email: 'sarah.a@email.com',
      phone: '+254 767 890 123',
      address: 'Parklands, Nairobi',
    },
    items: [
      { product: { id: '7', name: 'Apple Watch Ultra 2', price: 89999, images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800'] } as any, quantity: 1, price: 89999 },
    ],
    subtotal: 89999,
    shipping: 500,
    total: 90499,
    status: 'cancelled',
    paymentMethod: 'card',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21'),
  },
];

export const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'paid':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'processing':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'shipped':
      return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
    case 'delivered':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'cancelled':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};
