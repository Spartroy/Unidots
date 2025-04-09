import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const EmployeeTasks = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(statusFilter || 'all');
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        
        // Construct the API endpoint based on the filter
        let endpoint = '/api/tasks/assigned';
        if (activeFilter !== 'all') {
          endpoint += `?status=${activeFilter}`;
        }
        
        const response = await axios.get(endpoint);
        setTasks(response.data);
      } catch (error) {
        toast.error('Failed to load tasks');
        console.error('Tasks fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
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

  // Function to determine task status color
  const getStatusColor = (status) => {
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
  
  // Function to update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}/status`, { status: newStatus });
      
      // Update the task in the local state
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
      
      toast.success('Task status updated successfully');
    } catch (error) {
      toast.error('Failed to update task status');
      console.error('Task update error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-600"></div>
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
                ? 'border-secondary-500 text-secondary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`${
              activeFilter === 'pending'
                ? 'border-secondary-500 text-secondary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`${
              activeFilter === 'in_progress'
                ? 'border-secondary-500 text-secondary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`${
              activeFilter === 'completed'
                ? 'border-secondary-500 text-secondary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveFilter('overdue')}
            className={`${
              activeFilter === 'overdue'
                ? 'border-secondary-500 text-secondary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overdue
          </button>
        </nav>
      </div>

      {/* Tasks list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-secondary-600 truncate">{task.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <Link
                        to={`/employee/tasks/${task._id}`}
                        className="font-medium text-secondary-600 hover:text-secondary-500 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {task.order ? (
                          <>
                            <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Order: {task.order.orderNumber}
                          </>
                        ) : (
                          <>
                            <ClipboardCheckIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            General Task
                          </>
                        )}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Due: {formatDate(task.dueDate)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      {/* Status update buttons */}
                      <div className="flex space-x-2">
                        {task.status !== 'in_progress' && task.status !== 'completed' && (
                          <button
                            onClick={() => updateTaskStatus(task._id, 'in_progress')}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Start
                          </button>
                        )}
                        
                        {task.status !== 'completed' && (
                          <button
                            onClick={() => updateTaskStatus(task._id, 'completed')}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
              No tasks found for the selected filter.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeTasks;