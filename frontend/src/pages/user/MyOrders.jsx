import React from 'react';
import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery, useCancelOrderMutation } from '../../features/user/userApi';
import Skeleton from '../../components/ui/Skeleton';
import Breadcrumb from '../../components/layout/Breadcrumb';
import EmptyState from '../../components/ui/EmptyState';
import formatCurrency from '../../utils/formatCurrency';
import { formatDate } from '../../utils/helpers';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export const MyOrders = () => {
  const { data: ordersData, isLoading, refetch } = useGetMyOrdersQuery();
  const orders = ordersData?.data || [];

  const [cancelOrderApi, { isLoading: isCancelling }] = useCancelOrderMutation();

  const handleCancelOrder = async (orderId) => {
    const reason = window.prompt('Please enter the reason for cancellation:');
    if (reason === null) return; // cancelled prompt
    
    try {
      await cancelOrderApi({ id: orderId, reason: reason.trim() || 'Cancelled by customer' }).unwrap();
      toast.success('Order cancelled successfully');
      refetch();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to cancel order');
    }
  };

  if (isLoading) {
    return (
      <div className="section py-8 space-y-6">
        <Skeleton variant="text" width="30%" height="2rem" />
        <Skeleton variant="rectangular" className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="section py-6 space-y-8 animate-fade-in">
      <Breadcrumb items={[{ label: 'My Account', path: '/account/profile' }, { label: 'My Orders' }]} />

      <div className="flex justify-between items-center">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
          My Orders
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="card p-16 flex justify-center items-center">
          <EmptyState
            title="No Orders Placed Yet"
            description="You haven't purchased anything yet. Browse our selection and place your first order today!"
            actionLabel="Browse Products"
            actionPath="/products"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isCancellable = ['pending', 'confirmed'].includes(order.status);
            return (
              <div key={order._id} className="card p-6 border border-gray-100 dark:border-dark-800 space-y-4">
                
                {/* Order header information */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100 dark:border-dark-800 text-xs sm:text-sm font-semibold text-dark-600 dark:text-dark-400">
                  <div className="space-y-1">
                    <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider">Order Number</p>
                    <p className="font-bold text-dark-900 dark:text-white">#{order.orderNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider">Date Placed</p>
                    <p>{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider">Total Price</p>
                    <p className="text-primary-500 font-extrabold">{formatCurrency(order.totalPrice)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider">Status</p>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      order.status === 'cancelled'
                        ? 'bg-red-50 text-red-500 dark:bg-red-500/15'
                        : order.status === 'delivered'
                        ? 'bg-green-50 text-green-600 dark:bg-green-500/15'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-500/15'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Ordered items listing */}
                <div className="divide-y divide-gray-100 dark:divide-dark-800">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                      <div className="flex gap-3 items-center">
                        <img
                          src={item.image || 'https://via.placeholder.com/80'}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-150 dark:border-dark-800"
                        />
                        <div>
                          <p className="text-sm font-bold text-dark-900 dark:text-white line-clamp-1">{item.name}</p>
                          {item.variant && Object.keys(item.variant).length > 0 && (
                            <p className="text-[10px] text-dark-400 mt-0.5">
                              {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-dark-500">
                        {formatCurrency(item.price)} x {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  {isCancellable && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isCancelling}
                      className="btn border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10 px-4 py-2 text-xs font-bold"
                    >
                      {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                  <Link
                    to={`/orders/${order._id}/track`}
                    className="btn-primary py-2 px-5 text-xs font-bold"
                  >
                    Track Shipment
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
