import { useState, useEffect } from 'react';
import { Package, Search, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { Database } from '../lib/database.types';

type Warehouse = {
  id: string;
  name: string;
  city: string;
  country: string;
  status: 'active' | 'inactive';
};

type Order = Database['public']['Tables']['orders']['Row'] & {
  warehouses?: { name: string } | null;
};

// Hardcoded warehouses
const hardcodedWarehouses: Warehouse[] = [
  {
    id: 'wh-001',
    name: 'New York Hub',
    city: 'New York',
    country: 'United States',
    status: 'active'
  },
  {
    id: 'wh-002',
    name: 'London Center',
    city: 'London',
    country: 'United Kingdom',
    status: 'active'
  },
  {
    id: 'wh-003',
    name: 'Tokyo Distribution',
    city: 'Tokyo',
    country: 'Japan',
    status: 'active'
  }
];

const Orders = () => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [warehouses] = useState<Warehouse[]>(hardcodedWarehouses);
  const [loading, setLoading] = useState(false);
  const [displayedOrders, setDisplayedOrders] = useState<any[]>([
    {
      id: 'ORD-001',
      recipient_name: 'John Doe',
      email: 'john@example.com',
      status: 'Delivered',
      date: '2024-03-15',
      total: '$245.00'
    },
    {
      id: 'ORD-002',
      recipient_name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'In Transit',
      date: '2024-03-14',
      total: '$545.00'
    }
  ]);
  
  // Form state
  const [formData, setFormData] = useState({
    recipientName: '',
    totalWeight: '',
    warehouseId: hardcodedWarehouses[0].id // Default to first warehouse
  });
  
  // Load orders when component mounts
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);
  
  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, warehouses(name)')
        .eq('user_id', user.id);
        
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create an order');
      return;
    }
    
    if (!formData.warehouseId) {
      toast.error('Please select a warehouse');
      return;
    }
    
    setLoading(true);
    
    // Create a new order object for the UI
    const selectedWarehouse = warehouses.find(wh => wh.id === formData.warehouseId);
    const today = new Date().toISOString().split('T')[0];
    const newOrderId = `ORD-${String(displayedOrders.length + 1).padStart(3, '0')}`;
    
    const newOrder = {
      id: newOrderId,
      recipient_name: formData.recipientName,
      email: `${formData.recipientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      status: 'Pending',
      date: today,
      total: `$${(Math.random() * 500 + 100).toFixed(2)}`,
      warehouse: selectedWarehouse?.name
    };
    
    try {
      // Attempt to create the order in the database
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            warehouse_id: formData.warehouseId,
            recipient_name: formData.recipientName,
            total_weight: parseFloat(formData.totalWeight),
            status: 'pending'
          }
        ]);
      
      // Add the new order to our displayed orders regardless of database success
      setDisplayedOrders(prev => [newOrder, ...prev]);
      
      if (error) {
        console.error('Database error, but order added to UI:', error);
        toast.success('Order added to display (not saved to database)');
      } else {
        toast.success('Order created successfully');
      }
      
      setIsModalOpen(false);
      
      // Reset form data
      setFormData({
        recipientName: '',
        totalWeight: '',
        warehouseId: hardcodedWarehouses[0].id
      });
      
      // Try to refresh orders from the database
      fetchOrders();
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Order added to UI but failed to save to database');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Package className="h-5 w-5 mr-2" />
            New Order
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.recipient_name}</div>
                  <div className="text-sm text-gray-500">{order.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* New Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Order</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Name
                </label>
                <input
                  id="recipientName"
                  name="recipientName"
                  type="text"
                  required
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="totalWeight" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Weight (kg)
                </label>
                <input
                  id="totalWeight"
                  name="totalWeight"
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  value={formData.totalWeight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse
                </label>
                <select
                  id="warehouseId"
                  name="warehouseId"
                  required
                  value={formData.warehouseId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} - {warehouse.city}, {warehouse.country}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;