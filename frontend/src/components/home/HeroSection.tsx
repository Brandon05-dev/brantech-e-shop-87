import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-[0.02]" />
      </div>

      <div className="container relative py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              <span>New Arrivals Just Dropped</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
              <span className="block text-foreground">Experience the</span>
              <span className="block text-primary">Future of Tech</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Discover premium electronics at unbeatable prices. From laptops to gaming gear, 
              we bring you the latest technology with trusted quality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link to="/products">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  Shop Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/products?featured=true">
                <Button variant="glass" size="xl" className="w-full sm:w-auto">
                  View Deals
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 lg:gap-8">
              {[
                { icon: Truck, label: 'Free Shipping', desc: 'On orders over KSh 10k' },
                { icon: Shield, label: 'Warranty', desc: 'Up to 2 years' },
                { icon: Zap, label: 'Fast Delivery', desc: 'Same day in Nairobi' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-sm">{label}</h3>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:h-[600px] animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative z-10">
              {/* Main Product Showcase */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"
                  alt="MacBook Pro"
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl hover-scale"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
