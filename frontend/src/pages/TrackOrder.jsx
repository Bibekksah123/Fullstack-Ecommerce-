import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderQuery } from '../features/user/userApi';
import Skeleton from '../components/ui/Skeleton';
import Breadcrumb from '../components/layout/Breadcrumb';
import formatCurrency from '../utils/formatCurrency';
import { formatDate } from '../utils/helpers';
import { CheckIcon, ClockIcon, TruckIcon, ShieldCheckIcon, CubeIcon } from '@heroicons/react/24/solid';

export const TrackOrder = () => {
  const { id } = useParams();
  const { data: orderData, isLoading } = useGetOrderQuery(id);
  const order = orderData?.data;

  // Static tracking step configurations
  const steps = [
    { key: 'pending', label: 'Order Placed', desc: 'We have received your order details.', icon: ClockIcon },
    { key: 'confirmed', label: 'Confirmed', desc: 'Order confirmed and payment verified.', icon: ShieldCheckIcon },
    { key: 'processing', label: 'Processing', desc: 'Seller is packing your items.', icon: CubeIcon },
    { key: 'shipped', label: 'Shipped', desc: 'Package is handed over to courier.', icon: TruckIcon },
    { key: 'delivered', label: 'Delivered', desc: 'Package arrived at your delivery address.', icon: CheckIcon },
  ];

  const getTimelineEvent = (key) => {
    return order?.timeline?.find((t) => t.status === key);
  };

  const getStepStatus = (key, idx) => {
    if (!order) return 'upcoming';
    
    // Exact match
    const event = getTimelineEvent(key);
    if (event) return 'completed';

    // Map current index
    const activeIndex = steps.findIndex((s) => s.key === order.status);
    if (idx < activeIndex) return 'completed';
    if (idx === activeIndex) return 'active';
    return 'upcoming';
  };

  if (isLoading) {
    return (
      <div className="section py-8 space-y-6">
        <Skeleton variant="text" width="40%" height="1.5rem" />
        <Skeleton variant="rectangular" className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="section py-16 text-center">
        <h2 className="text-2xl font-bold">Track Details Not Found</h2>
        <p className="text-gray-500 mt-2">The order tracker could not resolve details for ID: {id}</p>
        <Link to="/" className="btn-primary mt-6">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="section py-6 space-y-8 animate-fade-in">
      <Breadcrumb
        items={[
          { label: 'My Account', path: '/account/profile' },
          { label: 'My Orders', path: '/account/orders' },
          { label: `Order Tracker` },
        ]}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-850 p-6 rounded-3xl border border-gray-100 dark:border-dark-800">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-dark-900 dark:text-white">
            Tracking Order: #{order.orderNumber}
          </h2>
          <p className="text-xs text-dark-400 font-semibold mt-1">
            Placed on: {formatDate(order.createdAt)} | Total: {formatCurrency(order.totalPrice)}
          </p>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-500 dark:bg-primary-500/10 px-4 py-2 rounded-full">
          Status: {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Timeline status tracker */}
        <div className="lg:col-span-2 card p-6 md:p-8 space-y-8">
          <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white">
            Delivery Status Timeline
          </h3>

          <div className="relative pl-8 border-l-2 border-gray-100 dark:border-dark-800 space-y-10 ml-4">
            {steps.map((s, idx) => {
              const status = getStepStatus(s.key, idx);
              const event = getTimelineEvent(s.key);
              const StepIcon = s.icon;

              let circleBg = 'bg-gray-100 dark:bg-dark-800 text-gray-400';
              let lineClass = 'border-gray-100 dark:border-dark-800';

              if (status === 'completed') {
                circleBg = 'bg-green-500 text-white shadow-glow';
              } else if (status === 'active') {
                circleBg = 'bg-primary-500 text-white shadow-glow animate-pulse-slow';
              }

              return (
                <div key={s.key} className="relative animate-fade-in">
                  {/* Circle Pin Icon */}
                  <span className={`absolute -left-12.5 top-0 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white dark:border-dark-850 z-10 ${circleBg}`}>
                    <StepIcon className="w-4.5 h-4.5" />
                  </span>

                  {/* Text Details */}
                  <div className="space-y-1 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className={`font-display font-bold text-sm sm:text-base ${
                        status === 'upcoming' ? 'text-gray-400' : 'text-dark-900 dark:text-white'
                      }`}>
                        {s.label}
                      </h4>
                      {event && (
                        <span className="text-[11px] font-bold text-dark-400">
                          {formatDate(event.timestamp)} at {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm font-medium ${
                      status === 'upcoming' ? 'text-gray-400' : 'text-dark-500'
                    }`}>
                      {event?.message || s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Order items list */}
        <div className="card p-6 space-y-6">
          <h3 className="font-display font-bold text-base text-dark-900 dark:text-white">
            Shipping Information
          </h3>

          <div className="text-xs sm:text-sm font-semibold text-dark-600 dark:text-dark-450 space-y-3">
            <div>
              <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider mb-0.5">Estimated Arrival</p>
              <p className="font-bold text-dark-900 dark:text-white">{formatDate(order.estimatedDelivery)}</p>
            </div>
            <div>
              <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider mb-0.5">Delivery Address</p>
              <p className="font-bold text-dark-950 dark:text-white">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}</p>
              <p>{order.shippingAddress?.state}, {order.shippingAddress?.postalCode}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;
