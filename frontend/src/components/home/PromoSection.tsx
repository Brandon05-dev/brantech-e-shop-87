import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Timer, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary/20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Large Promo Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-accent/20 p-8 lg:p-12 border border-primary/20 group">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] group-hover:bg-primary/20 transition-colors" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                <Timer className="h-4 w-4" />
                <span>Limited Time Offer</span>
              </div>
              
              <h3 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                MacBook Pro M3
                <br />
                <span className="text-primary">Save Up to KSh 50,000</span>
              </h3>
              
              <p className="text-muted-foreground mb-6 max-w-md">
                Experience the power of Apple Silicon with the all-new MacBook Pro. 
                Limited stock available at this incredible price.
              </p>
              
              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-display text-4xl font-bold text-primary">KSh 349,999</span>
                <span className="text-xl text-muted-foreground line-through">KSh 399,999</span>
              </div>
              
              <Link to="/product/1">
                <Button variant="hero" size="lg" className="group/btn">
                  Shop Now
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="absolute -bottom-20 -right-20 w-64 h-64 lg:w-80 lg:h-80">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"
                alt="MacBook Pro"
                className="w-full h-full object-cover rounded-3xl rotate-12 group-hover:rotate-6 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Stacked Promo Cards */}
          <div className="grid gap-6">
            {/* Card 1 */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent/20 to-background p-6 lg:p-8 border border-accent/20 group">
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium mb-3">
                    <Zap className="h-3 w-3" />
                    <span>Flash Sale</span>
                  </div>
                  <h4 className="font-display text-xl lg:text-2xl font-bold mb-2">
                    PlayStation 5 Bundle
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Console + Extra Controller + 3 Games
                  </p>
                  <Link to="/product/4" className="text-primary font-medium text-sm hover:underline">
                    Shop Now →
                  </Link>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200"
                  alt="PlayStation 5"
                  className="w-32 h-32 object-cover rounded-xl group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-background p-6 lg:p-8 border border-border group">
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">New Arrival</span>
                  <h4 className="font-display text-xl lg:text-2xl font-bold mb-2">
                    iPhone 15 Pro Max
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Titanium design. A17 Pro chip.
                  </p>
                  <Link to="/product/2" className="text-primary font-medium text-sm hover:underline">
                    Explore →
                  </Link>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200"
                  alt="iPhone 15 Pro"
                  className="w-32 h-32 object-cover rounded-xl group-hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
