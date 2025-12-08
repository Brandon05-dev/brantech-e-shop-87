import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const Wishlist: React.FC = () => {
  const { wishlist } = useCart();

  return (
    <>
      <Helmet>
        <title>Wishlist - Brantech Electronics</title>
        <meta name="description" content="View your saved products and wishlist items." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container py-8">
          <h1 className="font-display text-3xl lg:text-4xl font-bold mb-8">
            My Wishlist
          </h1>

          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Save items you love by clicking the heart icon
              </p>
              <Link to="/products">
                <Button variant="hero" size="lg">
                  Explore Products
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {wishlist.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Wishlist;
