import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import FlashSale from '../components/home/FlashSale';
import FeaturedProducts from '../components/home/FeaturedProducts';

export const Home = () => {
  return (
    <div className="section space-y-16 py-8 md:py-12">
      {/* Hero Slider */}
      <section className="animate-fade-in">
        <HeroBanner />
      </section>

      {/* Category Icons */}
      <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <CategoryGrid />
      </section>

      {/* Flash Sale Deal Tickers */}
      <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <FlashSale />
      </section>

      {/* Featured Products Showcase */}
      <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <FeaturedProducts />
      </section>
    </div>
  );
};

export default Home;
