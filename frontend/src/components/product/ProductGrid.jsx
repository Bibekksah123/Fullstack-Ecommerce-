import React from 'react';
import ProductCard from './ProductCard';
import Skeleton from '../ui/Skeleton';

export const ProductGrid = ({ products = [], isLoading, count = 8 }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="card p-4 space-y-4">
            <Skeleton variant="rectangular" className="aspect-[4/3] w-full" />
            <Skeleton variant="text" width="60%" height="1.25rem" />
            <Skeleton variant="text" width="90%" height="1rem" />
            <Skeleton variant="text" width="40%" height="1rem" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton variant="text" width="50%" height="1.5rem" />
              <Skeleton variant="text" width="30%" height="1.2rem" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
