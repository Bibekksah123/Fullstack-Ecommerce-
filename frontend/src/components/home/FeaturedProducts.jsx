import React from 'react';
import { useGetFeaturedProductsQuery } from '../../features/products/productsApi';
import ProductGrid from '../product/ProductGrid';

export const FeaturedProducts = () => {
  const { data: featuredData, isLoading } = useGetFeaturedProductsQuery();
  const products = featuredData?.data || [];

  if (!isLoading && products.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-lg sm:text-xl text-dark-900 dark:text-white">
            Featured Products
          </h3>
          <p className="text-xs text-dark-400 font-semibold mt-0.5">Handpicked premium products for you</p>
        </div>
      </div>

      <ProductGrid products={products} isLoading={isLoading} count={8} />
    </div>
  );
};

export default FeaturedProducts;
