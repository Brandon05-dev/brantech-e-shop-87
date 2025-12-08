import React, { useEffect, useRef } from 'react';

const brands = [
  { name: 'Apple', logo: '/brand logos/apple logo.png' },
  { name: 'Samsung', logo: '/samsung logo.png' },
  { name: 'Sony', logo: '/sony logo.png' },
  { name: 'Dell', logo: '/dell logo.png' },
  { name: 'HP', logo: '/hp logo.png' },
  { name: 'Asus', logo: '/asus logo.png' },
  { name: 'Microsoft', logo: '/microsoft logo.png' },
];

const BrandsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 1;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 30);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="py-12 lg:py-16 bg-secondary/30 border-y border-border overflow-hidden">
      <div className="container">
        <p className="text-center text-sm text-muted-foreground uppercase tracking-widest mb-8">
          Trusted Brands We Carry
        </p>
        
        <div
          ref={scrollRef}
          className="flex items-center gap-12 lg:gap-20 overflow-hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Duplicate brands for infinite scroll effect */}
          {[...brands, ...brands, ...brands].map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex-shrink-0 group cursor-pointer"
            >
              <div className="w-32 h-20 lg:w-40 lg:h-24 flex items-center justify-center bg-background/50 rounded-lg p-4 hover:bg-background transition-all duration-300 hover:scale-110">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain transition-all duration-300"
                  onError={(e) => {
                    // Fallback if image doesn't load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<span class="font-display font-bold text-xl text-muted-foreground">${brand.name}</span>`;
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
