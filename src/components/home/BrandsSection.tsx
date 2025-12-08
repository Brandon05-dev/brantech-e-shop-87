import React from 'react';

const brands = [
  { name: 'Apple', logo: '🍎' },
  { name: 'Samsung', logo: '📱' },
  { name: 'Sony', logo: '🎮' },
  { name: 'Dell', logo: '💻' },
  { name: 'HP', logo: '🖥️' },
  { name: 'Lenovo', logo: '⌨️' },
  { name: 'Asus', logo: '🎯' },
  { name: 'Microsoft', logo: '🪟' },
];

const BrandsSection: React.FC = () => {
  return (
    <section className="py-12 lg:py-16 bg-secondary/30 border-y border-border">
      <div className="container">
        <p className="text-center text-sm text-muted-foreground uppercase tracking-widest mb-8">
          Trusted Brands We Carry
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
            >
              <span className="text-2xl lg:text-3xl group-hover:scale-110 transition-transform">
                {brand.logo}
              </span>
              <span className="font-display font-semibold text-lg lg:text-xl">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
