import React from 'react';
import { TruckIcon, BoltIcon, CheckIcon } from '@heroicons/react/24/outline';
import formatCurrency from '../../utils/formatCurrency';

export const ShippingStep = ({ selectedOption, onSelect, onBack, onNext }) => {
  const options = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      time: '3 - 5 business days',
      cost: 0, // In CartSummary we calculate shipping cost dynamically, let's keep it aligned.
      description: 'Standard delivery to your doorstep. Free for orders over Rs. 1,500.',
      icon: TruckIcon,
    },
    {
      id: 'express',
      name: 'Express Shipping',
      time: '1 - 2 business days',
      cost: 200,
      description: 'Guaranteed quick delivery with top priority tracking and support.',
      icon: BoltIcon,
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white">
        Shipping Method
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const Icon = opt.icon;

          return (
            <div
              key={opt.id}
              onClick={() => onSelect(opt.id, opt.cost)}
              className={`card p-5 border-2 transition-all cursor-pointer flex justify-between items-start gap-4 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50/10'
                  : 'border-gray-100 hover:border-gray-250 dark:border-dark-800 dark:hover:border-dark-700'
              }`}
            >
              <div className="p-3 bg-gray-50 dark:bg-dark-900 text-primary-500 rounded-2xl flex-shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-dark-900 dark:text-white">
                    {opt.name}
                  </span>
                  <span className="text-[11px] font-bold text-dark-400 bg-gray-100 dark:bg-dark-800 px-2 py-0.5 rounded">
                    {opt.time}
                  </span>
                </div>
                <p className="text-sm font-medium text-dark-500 dark:text-dark-400">
                  {opt.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <span className="text-base font-extrabold text-dark-950 dark:text-white">
                  {opt.cost === 0 ? (
                    <span className="text-green-500 font-bold uppercase text-xs">Included</span>
                  ) : (
                    `+ ${formatCurrency(opt.cost)}`
                  )}
                </span>
                {isSelected && (
                  <span className="p-1 rounded-full bg-primary-500 text-white shadow-glow">
                    <CheckIcon className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="btn border border-gray-200 hover:border-gray-300 dark:border-dark-750 px-8"
        >
          Back
        </button>
        <button onClick={onNext} className="btn-primary px-8">
          Continue
        </button>
      </div>
    </div>
  );
};

export default ShippingStep;
