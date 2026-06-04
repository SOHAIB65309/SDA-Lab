import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 text-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-4">
            <Link to="/admin" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/admin/add-product" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              Add Product
            </Link>
            <Link to="/admin/view-products" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              View Products
            </Link>
            <Link to="/admin/edit-product" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              Edit Product
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          <Link to="/admin" className="text-white block px-3 py-2 rounded-md text-base font-medium">
            Dashboard
          </Link>
          <Link to="/admin/add-product" className="text-white block px-3 py-2 rounded-md text-base font-medium">
            Add Product
          </Link>
          <Link to="/admin/view-products" className="text-white block px-3 py-2 rounded-md text-base font-medium">
            View Products
          </Link>
          <Link to="/admin/edit-product" className="text-white block px-3 py-2 rounded-md text-base font-medium">
            Edit Product
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
