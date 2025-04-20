import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { Settings, Users, Package, TrendingUp } from 'lucide-react';

const Admin = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    activeSubscriptions: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [users, orders, subscriptions] = await Promise.all([
        supabase.from('users').select('count'),
        supabase.from('orders').select('count'),
        supabase.from('subscriptions').select('count').eq('status', 'active')
      ]);

      setStats({
        totalUsers: users.count || 0,
        totalOrders: orders.count || 0,
        activeSubscriptions: subscriptions.count || 0,
        revenue: 0 // Calculate based on your business logic
      });
    };

    fetchStats();
  }, []);

  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeSubscriptions}</p>
            </div>
            <Settings className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.revenue}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Admin Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
          {/* Add user management functionality */}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vendor Management</h2>
          {/* Add vendor management functionality */}
        </div>
      </div>
    </div>
  );
};

export default Admin;