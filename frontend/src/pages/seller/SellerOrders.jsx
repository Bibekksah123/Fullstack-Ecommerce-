import React from 'react';
import { useGetSellerOrdersQuery, useUpdateOrderStatusMutation } from '../../features/seller/sellerApi';
import { SellerSidebar } from './SellerDashboard';
import Skeleton from '../../components/ui/Skeleton';
import Breadcrumb from '../../components/layout/Breadcrumb';
import EmptyState from '../../components/ui/EmptyState';
import formatCurrency from '../../utils/formatCurrency';
import { formatDate } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

export const SellerOrders = () => {
  const { data: ordersData, isLoading, refetch } = useGetSellerOrdersQuery();
  const orders = ordersData?.data || [];
  const [updateStatusApi, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const handleStatusTransition = async (orderId, currentStatus) => {
    let nextStatus = '';
    let actionLabel = '';
    
    if (currentStatus === 'confirmed') {
      nextStatus = 'processing';
      actionLabel = 'packing';
    } else if (currentStatus === 'processing') {
      nextStatus = 'shipped';
      actionLabel = 'shipping';
    } else if (currentStatus === 'shipped') {
      nextStatus = 'delivered';
      actionLabel = 'delivery';
    } else {
      return;
    }

    if (!window.confirm(`Advance status to "${nextStatus}"?`)) return;

    try {
      await updateStatusApi({
        id: orderId,
        status: nextStatus,
        message: `Order marked as ${nextStatus} by seller.`,
      }).unwrap();
      toast.success(`Order advanced to "${nextStatus}" successfully`);
      refetch();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update order status');
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
      <Breadcrumb items={[{ label: 'Seller Central', path: '/seller/dashboard' }, { label: 'Orders' }]} />

      <div className="flex justify-between items-center">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
          Manage Store Orders
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <SellerSidebar />

        {/* Dashboard Main Area */}
        <div className="lg:col-span-3 space-y-6">
          {orders.length === 0 ? (
            <div className="card p-16 flex justify-center items-center">
              <EmptyState
                title="No Orders Received"
                description="Your store hasn't received any customer orders yet. Promote your listings to attract buyers!"
                actionLabel="Manage Store Products"
                actionPath="/seller/products"
              />
            </div>
          ) : (
            orders.map((order) => {
              const isCancellable = false; // Seller advances status
              return (
                <div key={order._id} className="card p-6 space-y-4">
                  
                  {/* Order header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-150 dark:border-dark-800 text-xs font-semibold text-dark-600 dark:text-dark-400">
                    <div className="space-y-1">
                      <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider">Order ID</p>
                      <p className="font-bold text-dark-900 dark:text-white">#{order.orderNumber || order._id.substring(18)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider">Placed Date</p>
                      <p>{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider">Buyer Name</p>
                      <p className="font-bold text-dark-900 dark:text-white">{order.user?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider">Status</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-500 dark:bg-green-500/10' : 'bg-amber-50 text-amber-500 dark:bg-amber-500/10'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="divide-y divide-gray-150 dark:divide-dark-850">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                        <div className="flex gap-3 items-center">
                          <img
                            src={item.image || 'https://via.placeholder.com/80'}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-150 dark:border-dark-800"
                          />
                          <div>
                            <p className="text-sm font-bold text-dark-900 dark:text-white line-clamp-1">{item.name}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-dark-500">
                          {formatCurrency(item.price)} x {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Status update buttons */}
                  {['confirmed', 'processing', 'shipped'].includes(order.status) && (
                    <div className="flex justify-end pt-3 border-t border-gray-150 dark:border-dark-800">
                      <button
                        onClick={() => handleStatusTransition(order._id, order.status)}
                        disabled={isUpdating}
                        className="btn-primary py-2 px-6 text-xs font-bold uppercase tracking-wider"
                      >
                        {order.status === 'confirmed' && 'Mark as Packing (Processing)'}
                        {order.status === 'processing' && 'Mark as Shipped'}
                        {order.status === 'shipped' && 'Mark as Delivered'}
                      </button>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default SellerOrders;
