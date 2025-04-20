import React from 'react';
import { Calculator, Package, Truck } from 'lucide-react';

const Quotes = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Get Shipping Quote</h1>
        <p className="mt-2 text-gray-600">Calculate shipping costs for your package</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form>
              <div className="space-y-6">
                {/* Package Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Package Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                      <input
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Package Type
                      </label>
                      <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        <option>Small Box</option>
                        <option>Medium Box</option>
                        <option>Large Box</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Addresses</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">From</label>
                      <input
                        type="text"
                        placeholder="Enter pickup address"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">To</label>
                      <input
                        type="text"
                        placeholder="Enter delivery address"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Service Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative border rounded-lg p-4 cursor-pointer hover:border-blue-500">
                      <input
                        type="radio"
                        name="service-type"
                        className="sr-only"
                        defaultChecked
                      />
                      <div className="flex flex-col items-center">
                        <Truck className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="font-medium">Standard</span>
                        <span className="text-sm text-gray-500">2-3 days</span>
                      </div>
                    </div>
                    <div className="relative border rounded-lg p-4 cursor-pointer hover:border-blue-500">
                      <input
                        type="radio"
                        name="service-type"
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center">
                        <Package className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="font-medium">Express</span>
                        <span className="text-sm text-gray-500">1-2 days</span>
                      </div>
                    </div>
                    <div className="relative border rounded-lg p-4 cursor-pointer hover:border-blue-500">
                      <input
                        type="radio"
                        name="service-type"
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center">
                        <Calculator className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="font-medium">Same Day</span>
                        <span className="text-sm text-gray-500">Today</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Calculate Quote
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quote Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Rate</span>
                <span className="font-medium">$25.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight Charge</span>
                <span className="font-medium">$10.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium">$5.00</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-lg font-bold">$40.00</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Estimated delivery: Mar 20 - Mar 22
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotes;