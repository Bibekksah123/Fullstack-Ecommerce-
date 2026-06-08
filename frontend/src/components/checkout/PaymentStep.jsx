import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { CreditCardIcon, BanknotesIcon, CheckIcon } from '@heroicons/react/24/outline';
import formatCurrency from '../../utils/formatCurrency';

export const PaymentStep = ({
  paymentMethod,
  onSelect,
  grandTotal,
  stripeError,
  isProcessing,
  onBack,
  onNext,
}) => {
  const methods = [
    {
      id: 'cod',
      name: 'Cash on Delivery (COD)',
      description: 'Pay with cash upon delivery of your products.',
      icon: BanknotesIcon,
    },
    {
      id: 'stripe',
      name: 'Credit / Debit Card (Stripe)',
      description: 'Secure credit card payment processed by Stripe.',
      icon: CreditCardIcon,
    },
  ];

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#1e293b',
        fontFamily: 'Inter, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '15px',
        '::placeholder': {
          color: '#cbd5e1',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  return (
    <div className="space-y-6">
      <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white">
        Payment Method
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {methods.map((method) => {
          const isSelected = paymentMethod === method.id;
          const Icon = method.icon;

          return (
            <div key={method.id} className="space-y-4">
              <div
                onClick={() => onSelect(method.id)}
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
                  <span className="font-display font-bold text-dark-900 dark:text-white block">
                    {method.name}
                  </span>
                  <p className="text-sm font-medium text-dark-500 dark:text-dark-400">
                    {method.description}
                  </p>
                </div>
                {isSelected && (
                  <span className="p-1 rounded-full bg-primary-500 text-white shadow-glow">
                    <CheckIcon className="w-4 h-4" />
                  </span>
                )}
              </div>

              {/* Card input field if Stripe selected */}
              {isSelected && method.id === 'stripe' && (
                <div className="card p-5 border border-gray-150 dark:border-dark-850 bg-gray-50/50 dark:bg-dark-950/20 space-y-4 animate-slide-down">
                  <label className="label">Card Details</label>
                  <div className="p-4 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                  {stripeError && (
                    <p className="text-xs text-red-500 font-semibold">{stripeError}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="btn border border-gray-200 hover:border-gray-300 dark:border-dark-750 px-8"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={isProcessing || !paymentMethod}
          className="btn-primary px-8"
        >
          {isProcessing ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;
