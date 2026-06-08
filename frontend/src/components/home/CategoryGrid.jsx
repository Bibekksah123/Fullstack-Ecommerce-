import React from 'react';
import { Link } from 'react-router-dom';
import { useGetCategoriesQuery } from '../../features/products/productsApi';
import Skeleton from '../ui/Skeleton';

export const CategoryGrid = () => {
  const { data: categoriesData, isLoading } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <Skeleton variant="circular" width="4.5rem" height="4.5rem" />
            <Skeleton variant="text" width="80%" height="0.8rem" />
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-lg sm:text-xl text-dark-900 dark:text-white">
          Shop by Category
        </h3>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
        {categories.map((cat) => {
          return (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-3 group text-center"
            >
              <div className="w-20 h-20 rounded-full border border-gray-100 dark:border-dark-800 bg-white dark:bg-dark-850 flex items-center justify-center overflow-hidden shadow-card group-hover:shadow-glow group-hover:border-primary-500/30 transition-all duration-300 transform group-hover:scale-105">
                <img
                  src={cat.image || `https://via.placeholder.com/100?text=${encodeURIComponent(cat.name)}`}
                  alt={cat.name}
                  className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold text-dark-800 dark:text-dark-250 group-hover:text-primary-500 transition-colors line-clamp-1">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;
