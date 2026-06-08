import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../features/products/productsApi';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/product/FilterSidebar';
import Breadcrumb from '../components/layout/Breadcrumb';
import EmptyState from '../components/ui/EmptyState';
import { FunnelIcon } from '@heroicons/react/24/outline';

export const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // States from URL search parameters to ensure link shareability
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'newest';
  const category = searchParams.get('category') || undefined;
  const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const search = searchParams.get('search') || undefined;

  const filters = { page, limit: 12, sort, category, rating, minPrice, maxPrice, search };

  const { data: productsData, isLoading, isFetching } = useGetProductsQuery(filters);
  const products = productsData?.data || [];
  const pagination = productsData?.pagination || { page: 1, pages: 1, total: 0 };

  const updateFilters = (newFilters) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, value);
      }
    });

    // Reset page on filter change
    if (!newFilters.page) {
      updatedParams.set('page', '1');
    }
    
    setSearchParams(updatedParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    updateFilters({ sort: e.target.value });
  };

  return (
    <div className="section py-6">
      <Breadcrumb items={[{ label: 'Products', path: '/products' }]} />

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* Filter Sidebar (collapsible on mobile, static on desktop) */}
        <FilterSidebar
          filters={filters}
          onChange={updateFilters}
          onClear={handleClearFilters}
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
        />

        {/* Product listing main area */}
        <div className="flex-1 space-y-6">
          {/* Header toolbar */}
          <div className="flex items-center justify-between bg-white dark:bg-dark-850 p-4 rounded-2xl border border-gray-100 dark:border-dark-800">
            <p className="text-xs sm:text-sm font-bold text-dark-500">
              Showing <span className="text-dark-900 dark:text-white">{products.length}</span> of{' '}
              <span className="text-dark-900 dark:text-white">{pagination.total}</span> products
            </p>

            <div className="flex items-center gap-3">
              {/* Sort selector */}
              <select
                value={sort}
                onChange={handleSortChange}
                className="input py-2 px-3 text-xs sm:text-sm font-semibold border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 rounded-xl focus:ring-primary-500 w-auto"
              >
                <option value="newest">New Arrivals</option>
                <option value="popular">Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden p-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:text-primary-500"
              >
                <FunnelIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <ProductGrid isLoading={true} count={8} />
          ) : products.length === 0 ? (
            <div className="card p-16 flex justify-center items-center">
              <EmptyState
                title="No Products Found"
                description="We couldn't find any products matching your selected criteria. Try adjusting your filters."
                actionLabel="Clear All Filters"
                onAction={handleClearFilters}
              />
            </div>
          ) : (
            <div className={`${isFetching ? 'opacity-60 pointer-events-none' : ''} transition-opacity`}>
              <ProductGrid products={products} isLoading={false} />
            </div>
          )}

          {/* Pagination controls */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2.5 pt-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="btn border border-gray-200 dark:border-dark-750 px-4 py-2 disabled:opacity-40"
              >
                Prev
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => {
                const isActive = p === page;
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-glow'
                        : 'border border-gray-200 dark:border-dark-750 hover:bg-gray-50 dark:hover:bg-dark-800 text-dark-700 dark:text-dark-300'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.pages}
                className="btn border border-gray-200 dark:border-dark-750 px-4 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
