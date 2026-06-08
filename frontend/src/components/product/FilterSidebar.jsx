import { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useGetCategoriesQuery } from '../../features/products/productsApi';

export const FilterSidebar = ({
  filters,
  onChange,
  onClear,
  isOpen,
  onClose,
}) => {
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');

  // Sync inputs with outer filter state changes
  useEffect(() => {
    setMinPrice(filters.minPrice || '');
    setMaxPrice(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceApply = (e) => {
    e.preventDefault();
    onChange({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const handleCategorySelect = (categoryId) => {
    onChange({
      category: filters.category === categoryId ? undefined : categoryId,
    });
  };

  const handleRatingSelect = (rating) => {
    onChange({
      rating: filters.rating === rating ? undefined : rating,
    });
  };

  const SidebarContent = () => (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-dark-800">
        <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-primary-500" /> Filters
        </h3>
        <button
          onClick={onClear}
          className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-wider"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-display font-bold text-sm text-dark-900 dark:text-white uppercase tracking-wider text-xs">
          Categories
        </h4>
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat._id)}
              className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex justify-between items-center ${
                filters.category === cat._id
                  ? 'bg-primary-500 text-white'
                  : 'text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-display font-bold text-sm text-dark-900 dark:text-white uppercase tracking-wider text-xs">
          Price Range (Rs.)
        </h4>
        <form onSubmit={handlePriceApply} className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input w-full px-3 py-2"
          />
          <span className="text-gray-300 dark:text-dark-600 font-bold">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input w-full px-3 py-2"
          />
          <button
            type="submit"
            className="btn bg-primary-500 text-white hover:bg-primary-600 p-2.5 rounded-xl shadow-glow"
          >
            Apply
          </button>
        </form>
      </div>

      {/* Customer Ratings */}
      <div className="space-y-3">
        <h4 className="font-display font-bold text-sm text-dark-900 dark:text-white uppercase tracking-wider text-xs">
          Customer Rating
        </h4>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => handleRatingSelect(stars)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm font-semibold transition-colors ${
                filters.rating === stars
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
                  : 'text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800'
              }`}
            >
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => {
                  const Star = i < stars ? StarSolid : StarIcon;
                  return <Star key={i} className="w-4 h-4" />;
                })}
              </div>
              <span className="text-xs font-bold">& Up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 card p-6 h-fit sticky top-24 self-start">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-dark-950/40 backdrop-blur-sm animate-fade-in"
          />

          {/* Drawer content */}
          <div className="relative flex flex-col w-80 max-w-full bg-white dark:bg-dark-900 h-full p-6 shadow-hover overflow-y-auto animate-slide-up z-50">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-dark-500 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-xl"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
