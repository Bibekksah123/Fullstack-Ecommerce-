import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCategoryBySlugQuery, useGetProductsQuery } from '../features/products/productsApi';
import ProductGrid from '../components/product/ProductGrid';
import Breadcrumb from '../components/layout/Breadcrumb';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';

export const CategoryPage = () => {
  const { slug } = useParams();

  // 1. Fetch category details to get ID
  const { data: categoryData, isLoading: catLoading } = useGetCategoryBySlugQuery(slug);
  const category = categoryData?.data;

  // 2. Fetch products under category ID
  const { data: productsData, isLoading: prodLoading } = useGetProductsQuery(
    { category: category?._id },
    { skip: !category?._id }
  );
  
  const products = productsData?.data || [];

  if (catLoading) {
    return (
      <div className="section py-8 space-y-6">
        <Skeleton variant="text" width="30%" height="2rem" />
        <Skeleton variant="rectangular" className="h-44 w-full" />
        <Skeleton variant="rectangular" className="h-64 w-full" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="section py-16 text-center">
        <h2 className="text-2xl font-bold">Category Not Found</h2>
        <p className="text-gray-500 mt-2">The category you are trying to view does not exist.</p>
      </div>
    );
  }

  return (
    <div className="section py-6 space-y-8 animate-fade-in">
      <Breadcrumb
        items={[
          { label: 'Products', path: '/products' },
          { label: category.name },
        ]}
      />

      {/* Category Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-secondary-600 via-secondary-700 to-primary-600 text-white p-8 sm:p-12 shadow-soft">
        <div className="max-w-xl space-y-3 relative z-10">
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-none drop-shadow">
            {category.name}
          </h2>
          {category.description && (
            <p className="text-sm sm:text-base text-white/95 leading-relaxed font-semibold drop-shadow-sm">
              {category.description}
            </p>
          )}
        </div>
        {/* Banner graphics */}
        <div className="absolute right-0 bottom-0 opacity-15 translate-x-12 translate-y-12">
          <span className="text-[150px] font-black leading-none uppercase select-none">
            {category.name.substring(0, 3)}
          </span>
        </div>
      </div>

      {/* Products under category */}
      <div className="space-y-6">
        <h3 className="font-display font-bold text-lg sm:text-xl text-dark-900 dark:text-white">
          Explore {category.name}
        </h3>

        {prodLoading ? (
          <ProductGrid isLoading={true} count={8} />
        ) : products.length === 0 ? (
          <div className="card p-16 flex justify-center items-center">
            <EmptyState
              title="No Products Available"
              description={`We don't have any products available in "${category.name}" at this moment. Please check back later!`}
              actionLabel="Browse Other Products"
              actionPath="/products"
            />
          </div>
        ) : (
          <ProductGrid products={products} isLoading={false} />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
