import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderQuery } from '../features/user/userApi';
import Skeleton from '../components/ui/Skeleton';
import formatCurrency from '../utils/formatCurrency';
import { formatDate } from '../utils/helpers';
import { CheckCircleIcon, SparklesIcon, CalendarDaysIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

export const OrderConfirmation = () => {
  const { id } = useParams();
  const { data: orderData, isLoading } = useGetOrderQuery(id);
  const order = orderData?.data;

  if (isLoading) {
    return (
      <div className="section py-16 text-center max-w-lg mx-auto space-y-4">
        <Skeleton variant="circular" width="4rem" height="4rem" className="mx-auto" />
        <Skeleton variant="text" width="60%" className="mx-auto" />
        <Skeleton variant="rectangular" className="h-44 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="section py-16 text-center">
        <h2 className="text-2xl font-bold">Order Details Not Found</h2>
        <p className="text-gray-500 mt-2">We couldn't load the details for this confirmation page.</p>
        <Link to="/" className="btn-primary mt-6">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="section py-12 max-w-2xl mx-auto space-y-8 animate-fade-in">
      
      {/* Success Banner */}
      <div className="text-center space-y-4">
        <div className="p-4 bg-green-500/10 text-green-500 rounded-full w-fit mx-auto shadow-glow ring-8 ring-green-500/5">
          <CheckCircleIcon className="w-16 h-16" />
        </div>
        <h2 className="font-display font-black text-3xl text-dark-900 dark:text-white">
          Thank You for Your Order!
        </h2>
        <p className="text-sm font-semibold text-dark-500 max-w-md mx-auto">
          Your order has been placed successfully and is being processed. An email confirmation has been sent.
        </p>
      </div>

      {/* Summary card */}
      <div className="card p-6 md:p-8 space-y-6">
        <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white pb-3 border-b border-gray-100 dark:border-dark-800">
          Order Details
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-dark-600 dark:text-dark-400">
          <div className="space-y-1">
            <p className="text-xs text-dark-400">Order Number</p>
            <p className="font-bold text-dark-900 dark:text-white">{order.orderNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-dark-400">Payment Mode</p>
            <p className="font-bold text-dark-900 dark:text-white uppercase">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Stripe Card'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-dark-400">Total Price Paid</p>
            <p className="text-base font-black text-primary-500">
              {formatCurrency(order.totalPrice)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-dark-400">Estimated Delivery</p>
            <p className="font-bold text-dark-900 dark:text-white flex items-center gap-1">
              <CalendarDaysIcon className="w-4 h-4 text-secondary-500" />
              {formatDate(order.estimatedDelivery)}
            </p>
          </div>
        </div>

        {/* Shipping address recap */}
        <div className="bg-gray-50/50 dark:bg-dark-950/20 border border-gray-100 dark:border-dark-800 p-4 rounded-2xl">
          <h4 className="text-xs uppercase tracking-wider font-extrabold text-dark-500 mb-2">Ship To</h4>
          <p className="text-sm font-bold text-dark-900 dark:text-white">{order.shippingAddress?.fullName}</p>
          <p className="text-sm text-dark-600 dark:text-dark-350 mt-1">
            {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Link
          to={`/orders/${order._id}/track`}
          className="flex-1 btn-primary py-3.5 font-bold shadow-glow text-sm flex items-center justify-center gap-2"
        >
          Track My Order <ArrowRightIcon className="w-4 h-4" />
        </Link>
        <Link
          to="/"
          className="flex-1 btn bg-gray-100 hover:bg-gray-250 dark:bg-dark-800 dark:hover:bg-dark-750 text-dark-800 dark:text-white py-3.5 font-bold text-sm"
        >
          Continue Shopping
        </Link>
      </div>
      
    </div>
  );
};

export default OrderConfirmation;
