import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { DocumentTextIcon, ClipboardCheckIcon, PaperClipIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch order details
        const orderResponse = await axios.get(`/api/orders/${id}`);
        setOrder(orderResponse.data);
        
        // Fetch order tasks
        const tasksResponse = await axios.get(`/api/orders/${id}/tasks`);
        setTasks(tasksResponse.data);
        
        // Fetch order files
        const filesResponse = await axios.get(`/api/orders/${id}/files`);
        setFiles(filesResponse.data);
      } catch (error) {
        toast.error('Failed to load order details');
        console.error('Order details fetch error:', error);
        navigate('/client/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, navigate]);
  
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
  
  // Function to determine task status color
  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Function to download a file
  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`/api/files/${fileId}/download`, {
        responseType: 'blob'
      });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download file');
      console.error('File download error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <p className="text-center text-gray-500">Order not found or you don't have permission to view it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order header */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{order.title || 'Order Details'}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Order #{order.orderNumber}
            </p>
          </div>
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Order Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(order.createdAt)}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Print Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.printType ? `${order.printType.charAt(0).toUpperCase() + order.printType.slice(1)} Printing` : 'N/A'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Quantity</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.quantity || 'N/A'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.width && order.height ? `${order.width} × ${order.height} mm` : 'N/A'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Material</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.material ? order.material.charAt(0).toUpperCase() + order.material.slice(1) : 'N/A'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Colors</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.colors ? `${order.colors} ${order.colors === '1' ? 'Color' : 'Colors'}` : 'N/A'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Finish Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.finishType ? order.finishType.charAt(0).toUpperCase() + order.finishType.slice(1) : 'N/A'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.description || 'No description provided.'}</dd>
            </div>
            {order.additionalNotes && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Additional Notes</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.additionalNotes}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
          <div className="flex space-x-3">
            <Link
              to="/client/orders"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Orders
            </Link>
            {order.status !== 'completed' && order.status !== 'cancelled' && (
              <Link
                to={`/client/claims/new?orderId=${order._id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Submit a Claim
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Order progress */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Order Progress</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Current status and tasks for this order
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {tasks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task._id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                      <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTaskStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No tasks have been created for this order yet.</p>
          )}
        </div>
      </div>

      {/* Files section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Files</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Order attachments and related documents
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {/* Uploaded files list */}
          {files.length > 0 ? (
            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
              {files.map((file) => (
                <li key={file._id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span className="ml-2 flex-1 w-0 truncate">{file.originalName}</span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => downloadFile(file._id, file.originalName)}
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      Download
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No files attached to this order.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;