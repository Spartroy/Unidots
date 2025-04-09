import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { DocumentTextIcon, ClipboardCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ClientOrders = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(statusFilter || 'all');
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Construct the API endpoint based on the filter
        let endpoint = '/api/orders/client';
        if (activeFilter !== 'all') {
          endpoint += `?status=${activeFilter}`;
        }
        
        const response = await axios.get(endpoint);
        setOrders(response.data);
      } catch (error) {
        toast.error('Failed to load orders');
        console.error('Orders fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeFilter]);
  
  // Set active filter based on URL parameter when component mounts
  useEffect(() => {
    if (statusFilter) {
      setActiveFilter(statusFilter);
    }
  }, [statusFilter]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to determine order status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`${
              activeFilter === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`${
              activeFilter === 'pending'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`${
              activeFilter === 'in_progress'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`${
              activeFilter === 'completed'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Completed
          </button>
        </nav>
      </div>

      {/* Create new order button */}
      <div className="flex justify-end">
        <Link
          to="/client/orders/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Create New Order
        </Link>
      </div>

      {/* Orders list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {orders.length > 0 ? (
            orders.map((order) => (
              <li key={order._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-primary-600 truncate">
                        Order #{order.orderNumber}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <Link
                        to={`/client/orders/${order._id}`}
                        className="font-medium text-primary-600 hover:text-primary-500 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        {order.title || 'Untitled Order'}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <ClipboardCheckIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        {order.printType ? `${order.printType.charAt(0).toUpperCase() + order.printType.slice(1)} Printing` : 'Printing Order'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Ordered on {formatDate(order.createdAt)}
                      </p>
                      <p className="ml-6 font-medium">
                        ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
              No orders found for the selected filter.
              <div className="mt-4">
                <Link
                  to="/client/orders/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Create Your First Order
                </Link>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ClientOrders;