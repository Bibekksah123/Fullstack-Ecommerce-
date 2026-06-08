import React from 'react';
import formatCurrency from '../../utils/formatCurrency';

export const ReviewStep = ({
  cartItems = [],
  address = {},
  shippingMethod = 'standard',
  paymentMethod = 'cod',
  subtotal = 0,
  shippingCost = 0,
  discount = 0,
  isProcessing = false,
  onBack,
  onPlaceOrder,
}) => {
  const taxPrice = Math.round(subtotal * 0.05); // 5% tax like backend
  const finalTotal = Math.max(subtotal + shippingCost + taxPrice - discount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white pb-3 border-b border-gray-100 dark:border-dark-800">
        Review Your Order
      </h3>

      {/* Grid of info panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shipping Address */}
        <div className="card p-5 space-y-2">
          <h4 className="font-display font-bold text-sm text-dark-900 dark:text-white uppercase tracking-wider text-xs">
            Ship To
          </h4>
          <div className="text-sm font-semibold text-dark-700 dark:text-dark-350 space-y-0.5">
            <p className="font-bold text-dark-900 dark:text-white">{address.name}</p>
            <p>{address.street}</p>
            <p>{address.city}, {address.state} {address.postalCode}</p>
            <p>Phone: {address.phone}</p>
          </div>
        </div>

        {/* Payment & Shipping Speed */}
        <div className="card p-5 space-y-4">
          <div>
            <h4 className="font-display font-bold text-sm text-dark-900 dark:text-white uppercase tracking-wider text-xs mb-1.5">
              Payment Method
            </h4>
            <span className="text-sm font-bold bg-secondary-50 text-secondary-600 dark:bg-secondary-500/10 dark:text-secondary-400 px-3 py-1 rounded-lg">
              {paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Credit Card (Stripe)'}
            </span>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-dark-900 dark:text-white uppercase tracking-wider text-xs mb-1.5">
              Shipping Method
            </h4>
            <span className="text-sm font-bold bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 px-3 py-1 rounded-lg">
              {shippingMethod === 'standard' ? 'Standard Delivery' : 'Express Delivery'}
            </span>
          </div>
        </div>

      </div>

      {/* Review items */}
      <div className="card p-5 space-y-4">
        <h4 className="font-display font-bold text-sm text-dark-900 dark:text-white uppercase tracking-wider text-xs pb-2 border-b border-gray-100 dark:border-dark-800">
          Order Items
        </h4>
        <div className="divide-y divide-gray-100 dark:divide-dark-800">
          {cartItems.map((item) => {
            const product = item.product;
            const price = item.price || (product?.discountPrice > 0 ? product.discountPrice : product?.price) || 0;

            return (
              <div key={item._id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                <div className="flex gap-3 items-center">
                  <img
                    src={product?.thumbnail || 'https://via.placeholder.com/100'}
                    alt={product?.name}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-150 dark:border-dark-800"
                  />
                  <div>
                    <p className="text-sm font-bold text-dark-900 dark:text-white line-clamp-1">{product?.name}</p>
                    {item.variant && Object.keys(item.variant).length > 0 && (
                      <p className="text-[10px] text-dark-400 mt-0.5">
                        {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-dark-900 dark:text-white">
                    {formatCurrency(price * item.quantity)}
                  </p>
                  <p className="text-xs text-dark-400">Qty: {item.quantity}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Costs detail */}
      <div className="card p-6 space-y-3.5 text-sm font-semibold text-dark-600 dark:text-dark-300 ml-auto max-w-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-dark-900 dark:text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping Fee</span>
          <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Tax (5%)</span>
          <span className="text-dark-900 dark:text-white">{formatCurrency(taxPrice)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-500 font-bold">
            <span>Discount Applied</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="border-t border-gray-100 dark:border-dark-800 my-3" />
        <div className="flex justify-between items-end">
          <span className="text-base font-bold text-dark-900 dark:text-white">Total Amount</span>
          <span className="text-xl font-black text-primary-600 dark:text-primary-400">
            {formatCurrency(finalTotal)}
          </span>
        </div>
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
          onClick={onPlaceOrder}
          disabled={isProcessing}
          className="btn-primary px-10 shadow-glow font-bold text-sm"
        >
          {isProcessing ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
