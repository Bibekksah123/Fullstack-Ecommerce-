import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSearchProductsQuery } from '../features/products/productsApi';
import ProductGrid from '../components/product/ProductGrid';
import Breadcrumb from '../components/layout/Breadcrumb';
import EmptyState from '../components/ui/EmptyState';

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data: searchData, isLoading } = useSearchProductsQuery({ q: query, page, limit: 12 });
  const products = searchData?.data || [];
  const pagination = searchData?.pagination || { total: 0 };

  return (
    <div className="section py-6 space-y-6">
      <Breadcrumb items={[{ label: 'Search Results' }]} />

      <div className="space-y-2">
        <h2 className="font-display font-black text-xl sm:text-2xl text-dark-900 dark:text-white">
          Search Results for: <span className="text-primary-500">"{query}"</span>
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-dark-400">
          Found {pagination.total} matching products
        </p>
      </div>

      {isLoading ? (
        <ProductGrid isLoading={true} count={8} />
      ) : products.length === 0 ? (
        <div className="card p-16 flex justify-center items-center">
          <EmptyState
            title="No Matching Products"
            description="We couldn't find any products matching your search term. Check spelling or try browsing our catalog."
            actionLabel="Browse All Products"
            actionPath="/products"
          />
        </div>
      ) : (
        <ProductGrid products={products} isLoading={false} />
      )}
    </div>
  );
};

export default SearchResults;
