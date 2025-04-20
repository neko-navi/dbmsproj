import React, { useState, useEffect } from 'react';
import { Warehouse as WarehouseIcon, Plus, Search, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { Database } from '../lib/database.types';

type Warehouse = Database['public']['Tables']['warehouses']['Row'];

const Warehouses = () => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    status: 'active' as 'active' | 'inactive'
  });
  
  // Load warehouses when component mounts
  useEffect(() => {
    if (user) {
      fetchWarehouses();
    }
  }, [user]);
  
  const fetchWarehouses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      setWarehouses(data || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a warehouse');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create new warehouse
      const { error } = await supabase
        .from('warehouses')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            city: formData.city,
            country: formData.country,
            status: formData.status
          }
        ]);
        
      if (error) throw error;
      
      toast.success('Warehouse created successfully');
      setIsModalOpen(false);
      
      // Reset form data
      setFormData({
        name: '',
        city: '',
        country: '',
        status: 'active'
      });
      
      // Refresh warehouses list
      fetchWarehouses();
      
    } catch (error) {
      console.error('Error creating warehouse:', error);
      toast.error('Failed to create warehouse');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search warehouses..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Warehouse
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Warehouse Cards */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <WarehouseIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">New York Hub</h3>
            </div>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">123 Logistics Ave</p>
            <p className="text-sm text-gray-600">New York, NY 10001</p>
            <p className="text-sm text-gray-600">United States</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-medium text-gray-900">75%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <WarehouseIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">London Center</h3>
            </div>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">456 Storage Lane</p>
            <p className="text-sm text-gray-600">London, E1 6AN</p>
            <p className="text-sm text-gray-600">United Kingdom</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-medium text-gray-900">60%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Warehouse Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Warehouse</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter warehouse name"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter city"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter country"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
                  {loading ? 'Creating...' : 'Create Warehouse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouses;