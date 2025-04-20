import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Package, Warehouse, Calculator, User, Settings } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">ShipMe</span>
            </Link>
            
            {user && (
              <div className="hidden md:flex md:ml-10">
                <Link to="/dashboard" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
                  <Package className="h-5 w-5 mr-1" />
                  Dashboard
                </Link>
                {['admin', 'customer'].includes(user.role) && (
                  <>
                    <Link to="/warehouses" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
                      <Warehouse className="h-5 w-5 mr-1" />
                      Warehouses
                    </Link>
                    <Link to="/orders" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
                      <Package className="h-5 w-5 mr-1" />
                      Orders
                    </Link>
                    <Link to="/quotes" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
                      <Calculator className="h-5 w-5 mr-1" />
                      Get Quote
                    </Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
                    <Settings className="h-5 w-5 mr-1" />
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.business_name}</span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600">
                  <User className="h-5 w-5 mr-1" />
                  Login
                </Link>
                <Link to="/register" className="ml-4 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;