import React, { useEffect, useState } from 'react';
import { Package, TrendingUp, Users, Clock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    activeOrders: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
    avgDeliveryTime: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Fetch active orders
        const { count: activeOrders } = await supabase
          .from('orders')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('status', 'pending');

        // Fetch order history for revenue calculation
        const { data: orderHistory } = await supabase
          .from('order_history')
          .select('shipping_price')
          .gte('delivery_date', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

        const monthlyRevenue = orderHistory?.reduce((sum, order) => sum + order.shipping_price, 0) || 0;

        // Calculate average delivery time
        const { data: deliveries } = await supabase
          .from('order_history')
          .select('delivery_date')
          .eq('delivery_status', 'delivered');

        const avgDeliveryTime = deliveries?.length ? 
          deliveries.reduce((sum, delivery) => {
            const deliveryDate = new Date(delivery.delivery_date);
            const diff = Math.ceil((deliveryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return sum + diff;
          }, 0) / deliveries.length : 0;

        setStats({
          activeOrders: activeOrders || 0,
          monthlyRevenue,
          totalCustomers: user.role === 'admin' ? await fetchTotalCustomers() : 0,
          avgDeliveryTime: Math.abs(avgDeliveryTime)
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, [user]);

  const fetchTotalCustomers = async () => {
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'customer');
    return count || 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, {user?.business_name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeOrders}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.monthlyRevenue.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Delivery Time</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.avgDeliveryTime.toFixed(1)} days</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Recipient</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">#ORD-001</td>
                <td className="py-3 px-4">John Doe</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Delivered
                  </span>
                </td>
                <td className="py-3 px-4">$245.00</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">#ORD-002</td>
                <td className="py-3 px-4">Jane Smith</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    In Transit
                  </span>
                </td>
                <td className="py-3 px-4">$545.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;