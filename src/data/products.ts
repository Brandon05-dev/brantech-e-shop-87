export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  images: string[];
  rating: number;
  reviews: number;
  stock: number;
  featured: boolean;
  bestseller: boolean;
  specifications: Record<string, string>;
  variants?: {
    name: string;
    options: string[];
  }[];
}

export const categories = [
  { id: 'laptops', name: 'Laptops', icon: '💻', count: 45 },
  { id: 'phones', name: 'Smartphones', icon: '📱', count: 78 },
  { id: 'accessories', name: 'Accessories', icon: '🎧', count: 120 },
  { id: 'gaming', name: 'Gaming', icon: '🎮', count: 56 },
  { id: 'audio', name: 'Audio', icon: '🔊', count: 34 },
  { id: 'wearables', name: 'Wearables', icon: '⌚', count: 28 },
  { id: 'cameras', name: 'Cameras', icon: '📷', count: 22 },
  { id: 'tablets', name: 'Tablets', icon: '📲', count: 18 },
];

export const brands = [
  'Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 
  'Microsoft', 'Google', 'OnePlus', 'Xiaomi', 'JBL', 'Bose', 'LG'
];

export const products: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16" M3 Max',
    description: 'The most powerful MacBook Pro ever. With the blazing-fast M3 Max chip, stunning Liquid Retina XDR display, and up to 22 hours of battery life.',
    price: 349999,
    originalPrice: 399999,
    category: 'laptops',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'
    ],
    rating: 4.9,
    reviews: 234,
    stock: 15,
    featured: true,
    bestseller: true,
    specifications: {
      'Processor': 'Apple M3 Max',
      'RAM': '36GB Unified Memory',
      'Storage': '1TB SSD',
      'Display': '16.2" Liquid Retina XDR',
      'Battery': 'Up to 22 hours'
    },
    variants: [
      { name: 'Storage', options: ['512GB', '1TB', '2TB'] },
      { name: 'Color', options: ['Space Black', 'Silver'] }
    ]
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    description: 'iPhone 15 Pro Max. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    price: 189999,
    originalPrice: 199999,
    category: 'phones',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800'
    ],
    rating: 4.8,
    reviews: 567,
    stock: 42,
    featured: true,
    bestseller: true,
    specifications: {
      'Chip': 'A17 Pro',
      'Display': '6.7" Super Retina XDR',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      'Battery': 'Up to 29 hours video playback'
    },
    variants: [
      { name: 'Storage', options: ['256GB', '512GB', '1TB'] },
      { name: 'Color', options: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'] }
    ]
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with Auto NC Optimizer. Exceptional sound quality with new 30mm driver unit. Crystal clear hands-free calling.',
    price: 34999,
    originalPrice: 39999,
    category: 'audio',
    subcategory: 'headphones',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
    ],
    rating: 4.7,
    reviews: 892,
    stock: 89,
    featured: true,
    bestseller: false,
    specifications: {
      'Driver': '30mm',
      'Noise Cancellation': 'Industry-leading ANC',
      'Battery': '30 hours',
      'Connectivity': 'Bluetooth 5.2, 3.5mm'
    },
    variants: [
      { name: 'Color', options: ['Black', 'Silver', 'Midnight Blue'] }
    ]
  },
  {
    id: '4',
    name: 'PlayStation 5 Console',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers and 3D Audio.',
    price: 74999,
    category: 'gaming',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800'
    ],
    rating: 4.9,
    reviews: 1234,
    stock: 23,
    featured: true,
    bestseller: true,
    specifications: {
      'CPU': 'AMD Zen 2, 8 cores @ 3.5GHz',
      'GPU': 'AMD RDNA 2, 10.28 TFLOPs',
      'Storage': '825GB SSD',
      'Resolution': 'Up to 8K'
    },
    variants: [
      { name: 'Edition', options: ['Standard', 'Digital'] }
    ]
  },
  {
    id: '5',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Meet Galaxy AI. Your icons are Icons. The icons of Icons. With a flat display panel and titanium frame. Your icons are Icons of Icons.',
    price: 154999,
    originalPrice: 169999,
    category: 'phones',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800'
    ],
    rating: 4.7,
    reviews: 445,
    stock: 56,
    featured: false,
    bestseller: true,
    specifications: {
      'Processor': 'Snapdragon 8 Gen 3',
      'Display': '6.8" Dynamic AMOLED 2X',
      'Camera': '200MP + 50MP + 12MP + 10MP',
      'Battery': '5000mAh'
    },
    variants: [
      { name: 'Storage', options: ['256GB', '512GB', '1TB'] },
      { name: 'Color', options: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'] }
    ]
  },
  {
    id: '6',
    name: 'Dell XPS 15 (2024)',
    description: 'Stunning 15.6" OLED display with 3.5K resolution. Intel Core Ultra 7 processor. Premium aluminum and carbon fiber design.',
    price: 224999,
    category: 'laptops',
    brand: 'Dell',
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
    ],
    rating: 4.6,
    reviews: 178,
    stock: 34,
    featured: false,
    bestseller: false,
    specifications: {
      'Processor': 'Intel Core Ultra 7 155H',
      'RAM': '32GB DDR5',
      'Storage': '1TB SSD',
      'Display': '15.6" 3.5K OLED'
    },
    variants: [
      { name: 'RAM', options: ['16GB', '32GB', '64GB'] },
      { name: 'Color', options: ['Platinum Silver', 'Graphite'] }
    ]
  },
  {
    id: '7',
    name: 'Apple Watch Ultra 2',
    description: 'The most rugged and capable Apple Watch. Precision dual-frequency GPS. Up to 36 hours of battery life. Water resistant to 100m.',
    price: 89999,
    category: 'wearables',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'
    ],
    rating: 4.8,
    reviews: 321,
    stock: 67,
    featured: true,
    bestseller: false,
    specifications: {
      'Case': '49mm Titanium',
      'Display': 'Always-On Retina LTPO OLED',
      'Battery': 'Up to 36 hours',
      'Water Resistance': '100m'
    },
    variants: [
      { name: 'Band', options: ['Alpine Loop', 'Trail Loop', 'Ocean Band'] }
    ]
  },
  {
    id: '8',
    name: 'AirPods Pro (2nd Gen)',
    description: 'Rebuilt from the sound up. Adaptive Audio. USB-C charging. Up to 2x more Active Noise Cancellation than the previous generation.',
    price: 24999,
    category: 'audio',
    subcategory: 'earbuds',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800'
    ],
    rating: 4.7,
    reviews: 1567,
    stock: 145,
    featured: false,
    bestseller: true,
    specifications: {
      'Chip': 'H2',
      'ANC': '2x more powerful',
      'Battery': '6 hours (30 with case)',
      'Connectivity': 'Bluetooth 5.3'
    },
    variants: []
  },
  {
    id: '9',
    name: 'ASUS ROG Strix G16',
    description: 'Dominate with the Intel Core i9 and NVIDIA GeForce RTX 4070. 16" QHD 240Hz display. Advanced cooling with Tri-Fan Technology.',
    price: 189999,
    originalPrice: 209999,
    category: 'gaming',
    subcategory: 'laptops',
    brand: 'Asus',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800'
    ],
    rating: 4.6,
    reviews: 234,
    stock: 28,
    featured: false,
    bestseller: false,
    specifications: {
      'Processor': 'Intel Core i9-14900HX',
      'GPU': 'NVIDIA RTX 4070',
      'RAM': '32GB DDR5',
      'Display': '16" QHD 240Hz'
    },
    variants: [
      { name: 'RAM', options: ['16GB', '32GB'] }
    ]
  },
  {
    id: '10',
    name: 'iPad Pro 12.9" M4',
    description: 'Impossibly thin. Incredibly powerful. The ultimate iPad experience with the breakthrough M4 chip and stunning Ultra Retina XDR display.',
    price: 134999,
    category: 'tablets',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800'
    ],
    rating: 4.9,
    reviews: 156,
    stock: 45,
    featured: true,
    bestseller: false,
    specifications: {
      'Chip': 'Apple M4',
      'Display': '12.9" Ultra Retina XDR',
      'Storage': '256GB',
      'Connectivity': 'Wi-Fi 6E, 5G optional'
    },
    variants: [
      { name: 'Storage', options: ['256GB', '512GB', '1TB', '2TB'] },
      { name: 'Connectivity', options: ['Wi-Fi', 'Wi-Fi + Cellular'] }
    ]
  },
  {
    id: '11',
    name: 'Logitech MX Master 3S',
    description: 'Quiet clicks. 8K DPI tracking. Ergonomic design. The master series for masterful work.',
    price: 10999,
    category: 'accessories',
    subcategory: 'mouse',
    brand: 'Logitech',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'
    ],
    rating: 4.8,
    reviews: 567,
    stock: 234,
    featured: false,
    bestseller: true,
    specifications: {
      'DPI': '8000',
      'Battery': '70 days',
      'Connectivity': 'Bluetooth, USB receiver'
    },
    variants: [
      { name: 'Color', options: ['Graphite', 'Pale Gray'] }
    ]
  },
  {
    id: '12',
    name: 'Samsung 49" Odyssey G9',
    description: 'The ultimate curved gaming monitor. DQHD resolution, 240Hz refresh rate, 1ms response time. Quantum Mini LED.',
    price: 129999,
    originalPrice: 149999,
    category: 'accessories',
    subcategory: 'monitors',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'
    ],
    rating: 4.7,
    reviews: 189,
    stock: 12,
    featured: false,
    bestseller: false,
    specifications: {
      'Resolution': '5120x1440 DQHD',
      'Refresh Rate': '240Hz',
      'Response Time': '1ms',
      'Panel': 'Quantum Mini LED'
    },
    variants: []
  }
];
