import React from 'react';
import formatCurrency from '../../utils/formatCurrency';

export const VariantSelector = ({ variants = [], selectedVariants = {}, onChange }) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-5">
      {variants.map((v) => (
        <div key={v._id || v.name} className="space-y-2.5">
          <label className="text-xs uppercase tracking-wider font-bold text-dark-500 dark:text-dark-400">
            {v.name}
          </label>
          <div className="flex flex-wrap gap-2.5">
            {v.options.map((opt) => {
              const isSelected = selectedVariants[v.name] === opt.value;
              const hasModifier = opt.priceModifier > 0;
              const isOutOfStock = opt.stock <= 0;

              return (
                <button
                  key={opt._id || opt.value}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => onChange(v.name, opt.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all flex flex-col items-center gap-0.5 ${
                    isOutOfStock
                      ? 'border-gray-100 bg-gray-50 text-gray-400 dark:border-dark-800 dark:bg-dark-900 line-through cursor-not-allowed opacity-55'
                      : isSelected
                      ? 'border-primary-500 bg-primary-50/20 text-primary-600 dark:text-primary-400 dark:bg-primary-500/10'
                      : 'border-gray-200 hover:border-gray-300 dark:border-dark-700 dark:hover:border-dark-600 text-dark-800 dark:text-dark-200'
                  }`}
                >
                  <span>{opt.value}</span>
                  {hasModifier && !isOutOfStock && (
                    <span className="text-[10px] opacity-75 font-normal">
                      +{formatCurrency(opt.priceModifier)}
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="text-[9px] uppercase tracking-wide font-medium text-red-500">
                      Out of Stock
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariantSelector;
