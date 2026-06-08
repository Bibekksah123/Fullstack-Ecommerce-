import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export const HeroBanner = () => {
  const slides = [
    {
      id: 1,
      title: 'Upgrade Your Digital Lifestyle',
      subtitle: 'Flash Sale: Up to 40% Off on Premium Smart Gadgets',
      link: '/products?category=electronics',
      bgGradient: 'from-blue-600 via-indigo-700 to-primary-600',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      tag: 'Mega Deal',
    },
    {
      id: 2,
      title: 'Elevate Your Wardrobe Essentials',
      subtitle: 'Explore the new Summer Collection with up to 50% discount codes.',
      link: '/products?category=fashion',
      bgGradient: 'from-amber-500 via-primary-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
      tag: 'New Season',
    },
    {
      id: 3,
      title: 'Premium Home Makeover',
      subtitle: 'Create a sanctuary with handcrafted furniture and modern accents.',
      link: '/products?category=home-appliances',
      bgGradient: 'from-emerald-600 via-teal-700 to-secondary-600',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80',
      tag: 'Trending Now',
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-dark-900 shadow-soft h-[350px] sm:h-[420px] md:h-[480px] w-full animate-fade-in group">
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col md:flex-row items-center gap-6 p-8 sm:p-12 md:p-16 bg-gradient-to-tr ${slide.bgGradient} ${
              isActive ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-12 z-0 pointer-events-none'
            }`}
          >
            {/* Slide Text */}
            <div className="text-left text-white max-w-xl space-y-4 sm:space-y-6 flex-1">
              <span className="inline-block text-[10px] uppercase tracking-widest font-extrabold bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                {slide.tag}
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none drop-shadow-md">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed drop-shadow-sm font-medium">
                {slide.subtitle}
              </p>
              <div className="pt-2">
                <Link
                  to={slide.link}
                  className="btn bg-white hover:bg-gray-50 text-dark-900 font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-glow/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Shop the Sale
                </Link>
              </div>
            </div>

            {/* Slide Image */}
            <div className="hidden md:block w-1/3 lg:w-2/5 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-white/10">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-md z-25 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-md z-25 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-25">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === current ? 'w-6 bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
