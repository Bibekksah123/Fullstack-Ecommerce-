import React from 'react';
import { Link } from 'react-router-dom';
import { useGetSellerAnalyticsQuery } from '../../features/seller/sellerApi';
import Skeleton from '../../components/ui/Skeleton';
import Breadcrumb from '../../components/layout/Breadcrumb';
import formatCurrency from '../../utils/formatCurrency';
import { formatDate } from '../../utils/helpers';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  SquaresPlusIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const SellerSidebar = () => (
  <div className="card p-5 space-y-2 lg:sticky lg:top-24 self-start">
    <Link
      to="/seller/dashboard"
      className="block px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-50 text-primary-500 dark:bg-primary-500/10 dark:text-primary-400"
    >
      Overview
    </Link>
    <Link
      to="/seller/products"
      className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-dark-700 dark:text-dark-350 hover:bg-gray-50 dark:hover:bg-dark-800"
    >
      Manage Products
    </Link>
    <Link
      to="/seller/orders"
      className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-dark-700 dark:text-dark-350 hover:bg-gray-50 dark:hover:bg-dark-800"
    >
      Manage Orders
    </Link>
    <Link
      to="/seller/analytics"
      className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-dark-700 dark:text-dark-350 hover:bg-gray-50 dark:hover:bg-dark-800"
    >
      Earnings Report
    </Link>
  </div>
);

export const SellerDashboard = () => {
  const { data: analyticsData, isLoading } = useGetSellerAnalyticsQuery();
  const analytics = analyticsData?.data;

  // Format Recharts monthly data
  const chartData = analytics?.monthlyRevenue?.map((r) => {
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      name: `${months[r._id.month]} ${r._id.year}`,
      Revenue: r.revenue,
    };
  }) || [];

  if (isLoading) {
    return (
      <div className="section py-8 space-y-6">
        <Skeleton variant="text" width="30%" height="2rem" />
        <Skeleton variant="rectangular" className="h-64 w-full" />
      </div>
    );
  }

  const overview = analytics?.overview || {};

  return (
    <div className="section py-6 space-y-8 animate-fade-in">
      <Breadcrumb items={[{ label: 'Seller Central', path: '/seller/dashboard' }, { label: 'Overview' }]} />

      <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
        Seller Central Overview
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <SellerSidebar />

        {/* Dashboard Main Stats Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Card stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Total Sales */}
            <div className="card p-6 flex justify-between items-center bg-gradient-to-tr from-white to-gray-50/50 dark:from-dark-850 dark:to-dark-800">
              <div className="text-left space-y-1">
                <span className="text-xs font-bold text-dark-400 uppercase tracking-wider block">Total Sales</span>
                <span className="text-xl sm:text-2xl font-black text-dark-900 dark:text-white">
                  {formatCurrency(overview.totalSales || 0)}
                </span>
              </div>
              <div className="p-3 bg-primary-50 dark:bg-primary-500/10 text-primary-500 rounded-2xl">
                <CurrencyDollarIcon className="w-7 h-7" />
              </div>
            </div>

            {/* Total Earnings */}
            <div className="card p-6 flex justify-between items-center bg-gradient-to-tr from-white to-gray-50/50 dark:from-dark-850 dark:to-dark-800">
              <div className="text-left space-y-1">
                <span className="text-xs font-bold text-dark-400 uppercase tracking-wider block">Net Earnings</span>
                <span className="text-xl sm:text-2xl font-black text-secondary-500">
                  {formatCurrency(overview.totalEarnings || 0)}
                </span>
              </div>
              <div className="p-3 bg-secondary-50 dark:bg-secondary-500/10 text-secondary-500 rounded-2xl">
                <ArrowTrendingUpIcon className="w-7 h-7" />
              </div>
            </div>

            {/* Total Orders */}
            <div className="card p-6 flex justify-between items-center bg-gradient-to-tr from-white to-gray-50/50 dark:from-dark-850 dark:to-dark-800">
              <div className="text-left space-y-1">
                <span className="text-xs font-bold text-dark-400 uppercase tracking-wider block">Total Orders</span>
                <span className="text-xl sm:text-2xl font-black text-dark-900 dark:text-white">
                  {overview.totalOrders || 0}
                </span>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-2xl">
                <ShoppingBagIcon className="w-7 h-7" />
              </div>
            </div>

          </div>

          {/* Revenue Chart */}
          {chartData.length > 0 && (
            <div className="card p-6 space-y-4">
              <h3 className="font-display font-bold text-base text-dark-900 dark:text-white">
                Revenue History
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} tickLine={false} />
                    <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="Revenue" stroke="#FF6B35" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recent Orders List */}
          <div className="card p-6 space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h3 className="font-display font-bold text-base text-dark-900 dark:text-white">
                Recent Customer Orders
              </h3>
              <Link to="/seller/orders" className="text-xs font-bold text-primary-500 hover:underline">
                View All Orders
              </Link>
            </div>

            {(!analytics?.recentOrders || analytics.recentOrders.length === 0) ? (
              <p className="text-sm text-dark-500 font-semibold text-center py-6">
                No customer orders received yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-dark-800 text-[10px] uppercase font-extrabold text-dark-400">
                      <th className="py-3">Order ID</th>
                      <th className="py-3">Customer</th>
                      <th className="py-3">Amount</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-dark-850 text-xs sm:text-sm font-semibold">
                    {analytics.recentOrders.map((ord) => (
                      <tr key={ord._id}>
                        <td className="py-3.5 text-primary-500 font-bold">
                          #{ord.orderNumber || ord._id.substring(18)}
                        </td>
                        <td className="py-3.5 text-dark-800 dark:text-dark-200">
                          {ord.user?.name || 'Guest User'}
                        </td>
                        <td className="py-3.5 text-dark-900 dark:text-white font-bold">
                          {formatCurrency(ord.totalPrice)}
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                            ord.status === 'delivered' ? 'bg-green-50 text-green-500 dark:bg-green-500/10' : 'bg-amber-50 text-amber-500 dark:bg-amber-500/10'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-dark-400">
                          {formatDate(ord.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;
export { SellerSidebar };
