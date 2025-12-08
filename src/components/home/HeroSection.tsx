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
              <span className="block gradient-text">Future of Tech</span>
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
                
                {/* Floating Cards */}
                <div className="absolute -left-4 lg:-left-12 top-1/4 glass-card p-4 shadow-xl animate-float hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">MacBook Pro M3</p>
                      <p className="text-primary font-bold">KSh 349,999</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 lg:-right-8 bottom-1/4 glass-card p-4 shadow-xl animate-float hidden sm:block" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100"
                      alt="iPhone"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">iPhone 15 Pro</p>
                      <p className="text-xs text-muted-foreground">Just arrived!</p>
                    </div>
                  </div>
                </div>

                {/* Stats Badge */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass-card px-6 py-3 shadow-xl">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="font-display font-bold text-xl text-primary">50K+</p>
                      <p className="text-xs text-muted-foreground">Happy Customers</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                      <p className="font-display font-bold text-xl text-primary">4.9★</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
