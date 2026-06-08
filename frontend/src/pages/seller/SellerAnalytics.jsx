import React from 'react';
import { useGetSellerAnalyticsQuery } from '../../features/seller/sellerApi';
import { SellerSidebar } from './SellerDashboard';
import Skeleton from '../../components/ui/Skeleton';
import Breadcrumb from '../../components/layout/Breadcrumb';
import formatCurrency from '../../utils/formatCurrency';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  CurrencyDollarIcon,
  CircleStackIcon,
  ShoppingBagIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

export const SellerAnalytics = () => {
  const { data: analyticsData, isLoading } = useGetSellerAnalyticsQuery();
  const analytics = analyticsData?.data;

  const chartData = analytics?.monthlyRevenue?.map((r) => {
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      name: `${months[r._id.month]} ${r._id.year}`,
      Sales: r.revenue,
      Orders: r.orders?.length || 0,
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
      <Breadcrumb items={[{ label: 'Seller Central', path: '/seller/dashboard' }, { label: 'Analytics' }]} />

      <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
        Store Earnings & Performance Reports
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar */}
        <SellerSidebar />

        {/* Analytics Main Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Detailed stats grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Total Sales */}
            <div className="card p-5 space-y-3">
              <div className="p-2.5 bg-primary-50 dark:bg-primary-500/10 text-primary-500 rounded-xl w-fit">
                <CurrencyDollarIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider">Gross Sales</p>
                <p className="text-lg font-black text-dark-900 dark:text-white mt-0.5">{formatCurrency(overview.totalSales || 0)}</p>
              </div>
            </div>

            {/* Net Earnings */}
            <div className="card p-5 space-y-3">
              <div className="p-2.5 bg-secondary-50 dark:bg-secondary-500/10 text-secondary-500 rounded-xl w-fit">
                <BanknotesIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider">Net Earnings</p>
                <p className="text-lg font-black text-secondary-500 mt-0.5">{formatCurrency(overview.totalEarnings || 0)}</p>
              </div>
            </div>

            {/* Pending Payouts */}
            <div className="card p-5 space-y-3">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl w-fit">
                <CircleStackIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider">Pending Payout</p>
                <p className="text-lg font-black text-amber-500 mt-0.5">{formatCurrency(overview.pendingEarnings || 0)}</p>
              </div>
            </div>

            {/* Active Products */}
            <div className="card p-5 space-y-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl w-fit">
                <ShoppingBagIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-dark-400 uppercase font-extrabold tracking-wider">Total Products</p>
                <p className="text-lg font-black text-dark-900 dark:text-white mt-0.5">{overview.totalProducts || 0}</p>
              </div>
            </div>

          </div>

          {/* Charts area */}
          {chartData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Sales area chart */}
              <div className="card p-6 space-y-4">
                <h3 className="font-display font-bold text-sm text-dark-900 dark:text-white uppercase tracking-wider text-xs">
                  Sales Growth Report
                </h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="Sales" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.1} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Order volume bar chart */}
              <div className="card p-6 space-y-4">
                <h3 className="font-display font-bold text-sm text-dark-900 dark:text-white uppercase tracking-wider text-xs">
                  Order Volume Report
                </h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickCount={5} />
                      <Tooltip />
                      <Bar dataKey="Orders" fill="#14B89A" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
