import React from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import formatCurrency from '../../utils/formatCurrency';
import { getImageUrl } from '../../utils/helpers';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const product = item.product;
  if (!product) return null;

  const price = item.price || (product.discountPrice > 0 ? product.discountPrice : product.price) || 0;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-b border-gray-100 dark:border-dark-800 last:border-b-0 animate-fade-in">
      
      {/* Product Image and description */}
      <div className="flex gap-4 items-center flex-1">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 dark:bg-dark-900 border border-gray-100 dark:border-dark-800 flex-shrink-0">
          <img
            src={product.thumbnail || (product.images && product.images[0]) || 'https://via.placeholder.com/150'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <Link
            to={`/products/${product._id}`}
            className="font-display font-bold text-sm sm:text-base text-dark-900 dark:text-white hover:text-primary-500 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
          
          {/* Selected variants */}
          {item.variant && Object.keys(item.variant).length > 0 && (
            <div className="flex flex-wrap gap-2.5 mt-1.5">
              {Object.entries(item.variant).map(([key, val]) => (
                <span
                  key={key}
                  className="inline-flex text-[10px] font-bold bg-gray-50 dark:bg-dark-800 text-dark-500 dark:text-dark-400 px-2 py-0.5 rounded-md border border-gray-150 dark:border-dark-750"
                >
                  {key}: <span className="text-dark-700 dark:text-dark-200 ml-1">{val}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pricing and Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto flex-shrink-0">
        
        {/* Quantity control */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-dark-800 rounded-xl p-1">
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-dark-700 text-dark-500 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-all active:scale-95"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-bold text-dark-800 dark:text-dark-200">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-dark-700 text-dark-500 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-all active:scale-95"
            aria-label="Increase quantity"
          >
            <PlusIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pricing */}
        <div className="text-right flex flex-col justify-center min-w-[100px]">
          <span className="text-base font-extrabold text-dark-900 dark:text-white">
            {formatCurrency(price * item.quantity)}
          </span>
          <span className="text-xs text-dark-400">
            {formatCurrency(price)} each
          </span>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onRemove(item._id)}
          className="p-2.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-500 transition-all duration-200"
          aria-label="Remove item"
        >
          <TrashIcon className="w-4.5 h-4.5" />
        </button>

      </div>
    </div>
  );
};

export default CartItem;
