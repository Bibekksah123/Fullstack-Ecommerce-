import { useState } from 'react';
import { useValidateCouponMutation } from '../../features/products/productsApi';
import formatCurrency from '../../utils/formatCurrency';
import { toast } from 'react-hot-toast';

export const CartSummary = ({
  subtotal,
  onCheckout,
  coupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [validateCouponApi, { isLoading: isApplying }] = useValidateCouponMutation();

  const shippingCost = subtotal > 1500 ? 0 : 150;
  
  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percent') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }
  }

  const grandTotal = Math.max(subtotal + shippingCost - discount, 0);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const res = await validateCouponApi({
        code: couponCode.trim(),
        orderValue: subtotal,
      }).unwrap();

      if (res.success) {
        onApplyCoupon(res.data);
        setCouponCode('');
        toast.success(`Coupon "${res.data.code}" applied!`);
      }
    } catch (err) {
      toast.error(err.data?.message || 'Invalid coupon code');
    }
  };

  return (
    <div className="card p-6 md:p-8 space-y-6 sticky top-24 self-start">
      <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white">
        Order Summary
      </h3>

      {/* Summary lines */}
      <div className="space-y-3.5 text-sm font-semibold text-dark-600 dark:text-dark-300">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-dark-900 dark:text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping Fee</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-500 font-bold uppercase tracking-wider text-xs">Free</span>
            ) : (
              formatCurrency(shippingCost)
            )}
          </span>
        </div>
        {coupon && (
          <div className="flex justify-between text-green-500 font-bold">
            <div className="flex items-center gap-1.5">
              <span>Discount ({coupon.code})</span>
              <button
                onClick={onRemoveCoupon}
                className="text-[10px] text-red-500 hover:underline cursor-pointer"
              >
                (Remove)
              </button>
            </div>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="border-t border-gray-100 dark:border-dark-800 my-4" />

        <div className="flex justify-between items-end">
          <span className="text-base font-bold text-dark-900 dark:text-white">Grand Total</span>
          <span className="text-2xl font-black text-primary-600 dark:text-primary-400">
            {formatCurrency(grandTotal)}
          </span>
        </div>
      </div>

      {/* Coupon Form */}
      <form onSubmit={handleApplyCoupon} className="flex gap-2">
        <input
          type="text"
          placeholder="Promo code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="input flex-1 px-3.5 py-2 text-xs font-semibold"
          disabled={coupon || isApplying}
        />
        <button
          type="submit"
          disabled={!couponCode.trim() || coupon || isApplying}
          className="btn bg-dark-900 text-white dark:bg-dark-800 dark:hover:bg-dark-700 py-2.5 px-4 text-xs font-bold"
        >
          Apply
        </button>
      </form>

      {/* Action button */}
      <button
        onClick={() => onCheckout({ shippingCost, discount, couponCode: coupon?.code, grandTotal })}
        className="w-full btn-primary py-3.5 font-bold shadow-glow text-sm"
        disabled={subtotal === 0}
      >
        Proceed to Checkout
      </button>

      {subtotal < 1500 && (
        <p className="text-[11px] text-center text-dark-400 font-medium leading-relaxed bg-gray-50 dark:bg-dark-900/50 p-2.5 rounded-xl border border-gray-100 dark:border-dark-800">
          Add <span className="font-bold text-primary-500">{formatCurrency(1500 - subtotal)}</span> more to unlock <span className="font-bold text-green-500">Free Shipping</span>!
        </p>
      )}
    </div>
  );
};

export default CartSummary;
