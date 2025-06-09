import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import {
  ChartBarIcon,
  ClockIcon,
  StarIcon,
  EyeIcon,
  ArrowLeftIcon,
  SparklesIcon,
  PhotoIcon,
  PresentationChartLineIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const TemplateDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/templates/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load template dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatEstimatedTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/employee/templates"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Templates
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                <PresentationChartLineIcon className="h-7 w-7 mr-3 text-primary-600" />
                Template Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Analytics and insights for your template usage
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {dashboardData?.stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <PhotoIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Templates</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {dashboardData.stats.totalTemplates || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Templates Used</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {dashboardData.stats.userUsageCount || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Time Saved</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {Math.round((dashboardData.stats.userUsageCount || 0) * 2.5)}h
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <SparklesIcon className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Efficiency Gain</p>
                  <p className="text-2xl font-semibold text-gray-900">75%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Templates */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
                Most Popular Templates
              </h3>
            </div>
            <div className="p-6">
              {dashboardData?.popular && dashboardData.popular.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.popular.slice(0, 5).map((template) => (
                    <div key={template._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {template.previewImage ? (
                          <img
                            src={template.previewImage.fileUrl}
                            alt={template.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {template.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {template.category} • {template.subCategory}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {template.stats?.usageCount || 0} uses
                        </span>
                        <Link
                          to={`/employee/templates/${template._id}/customize`}
                          className="text-primary-600 hover:text-primary-800 text-sm"
                        >
                          Use
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No popular templates data available
                </p>
              )}
            </div>
          </div>

          {/* Quick Start Templates */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-green-500" />
                Quick Start (Beginner Friendly)
              </h3>
            </div>
            <div className="p-6">
              {dashboardData?.quickStart && dashboardData.quickStart.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.quickStart.slice(0, 5).map((template) => (
                    <div key={template._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {template.previewImage ? (
                          <img
                            src={template.previewImage.fileUrl}
                            alt={template.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {template.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                              {template.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatEstimatedTime(template.estimatedTimeMinutes)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/employee/templates/${template._id}/customize`}
                        className="text-primary-600 hover:text-primary-800 text-sm"
                      >
                        Start
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No quick start templates available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Category Analytics */}
        {dashboardData?.byCategory && dashboardData.byCategory.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
                Templates by Category
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.byCategory.map((category) => (
                  <div key={category._id} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{category._id}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Templates:</span>
                        <span className="font-medium">{category.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Usage:</span>
                        <span className="font-medium">{category.totalUsage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg. Time:</span>
                        <span className="font-medium">{Math.round(category.avgTime || 0)}min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recently Used Templates */}
        {dashboardData?.recentlyUsed && dashboardData.recentlyUsed.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-purple-500" />
                Recently Used Templates
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.recentlyUsed.map((usage, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Order #{usage.orderNumber}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Template used: {usage.template?.templateId || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(usage.usedAt).toLocaleDateString()}
                      </p>
                      <Link
                        to={`/employee/orders/${usage.orderId}`}
                        className="text-xs text-primary-600 hover:text-primary-800"
                      >
                        View Order
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/employee/templates"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <PhotoIcon className="h-5 w-5 mr-2" />
            Browse All Templates
          </Link>
          <Link
            to="/employee/orders"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <EyeIcon className="h-5 w-5 mr-2" />
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplateDashboard; 