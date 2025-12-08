import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/data/products';

const CategoriesSection: React.FC = () => {
  const categoryImages: Record<string, string> = {
    laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    phones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    accessories: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
    gaming: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400',
    audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    wearables: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
    cameras: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-2">
              Shop by Category
            </h2>
            <p className="text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-square animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={categoryImages[category.id]}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-display text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.count} products
                </p>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/50 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
