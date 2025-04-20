import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, Clock, Globe } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-32" 
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Global Shipping Solutions for Your Business
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Fast, reliable, and secure shipping services worldwide
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/register" 
              className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link 
              to="/quotes" 
              className="px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose ShippiGo?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
              <p className="text-gray-600">Ship to over 200 countries worldwide with reliable tracking</p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Express shipping options for time-sensitive deliveries</p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Package Protection</h3>
              <p className="text-gray-600">Secure handling and insurance for your valuable items</p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Warehouse Network</h3>
              <p className="text-gray-600">Strategic warehouse locations for efficient distribution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;