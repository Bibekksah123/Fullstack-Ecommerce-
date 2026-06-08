import { useState, useEffect } from 'react';
import { useGetFlashSaleProductsQuery } from '../../features/products/productsApi';
import ProductGrid from '../product/ProductGrid';
import { SparklesIcon } from '@heroicons/react/24/solid';

export const FlashSale = () => {
  const { data: flashData, isLoading } = useGetFlashSaleProductsQuery();
  const products = flashData?.data || [];

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 32,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  if (!isLoading && products.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Header with Countdown */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent p-5 rounded-3xl border border-primary-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-500 text-white rounded-2xl shadow-glow">
            <SparklesIcon className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-dark-900 dark:text-white">
              Flash Sale
            </h3>
            <p className="text-xs text-dark-400 font-semibold">Limited stock deals available now</p>
          </div>
        </div>

        {/* Countdown boxes */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-dark-400 mr-1 uppercase tracking-wider">Ends In</span>
          <div className="flex gap-1.5 items-center">
            <div className="w-10 h-10 rounded-xl bg-dark-900 dark:bg-dark-800 text-white flex items-center justify-center font-display font-extrabold text-sm shadow-md">
              {formatNumber(timeLeft.hours)}
            </div>
            <span className="text-dark-400 font-bold">:</span>
            <div className="w-10 h-10 rounded-xl bg-dark-900 dark:bg-dark-800 text-white flex items-center justify-center font-display font-extrabold text-sm shadow-md">
              {formatNumber(timeLeft.minutes)}
            </div>
            <span className="text-dark-400 font-bold">:</span>
            <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center font-display font-extrabold text-sm shadow-glow">
              {formatNumber(timeLeft.seconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Flash Sale Items */}
      <ProductGrid products={products} isLoading={isLoading} count={4} />
    </div>
  );
};

export default FlashSale;
