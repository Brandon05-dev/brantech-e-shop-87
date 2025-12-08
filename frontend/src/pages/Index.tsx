import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoSection from '@/components/home/PromoSection';
import BrandsSection from '@/components/home/BrandsSection';

const Index: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Brantech Electronics - Premium Tech at Best Prices | Kenya</title>
        <meta 
          name="description" 
          content="Shop laptops, smartphones, gaming gear & electronics at Brantech. Free shipping on orders over KSh 10,000. Trusted by 50,000+ customers in Kenya." 
        />
        <meta name="keywords" content="electronics, laptops, smartphones, gaming, Kenya, Nairobi, online shopping" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
          <HeroSection />
          <BrandsSection />
          <CategoriesSection />
          <FeaturedProducts 
            title="Featured Products" 
            subtitle="Handpicked by our tech experts"
            filterKey="featured"
          />
          <PromoSection />
          <FeaturedProducts 
            title="Bestsellers" 
            subtitle="What our customers love"
            filterKey="bestseller"
          />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
