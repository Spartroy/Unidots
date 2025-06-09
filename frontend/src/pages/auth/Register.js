import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    department: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    role: 'client' // Default role is client
  });

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleSelected, setRoleSelected] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Update form fields based on role selection
  useEffect(() => {
    if (formData.role === 'manager') {
      // Reset to step 1 when switching to manager role
      setCurrentStep(1);
    }
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'role') {
      // If changing role, reset role-specific fields and form progress
      setFormData({
        ...formData,
        [name]: value,
        // Reset role-specific fields
        company: '',
        department: '',
      });
      setRoleSelected(true);
      // Reset to step 1 whenever role changes
      setCurrentStep(1);
    } else if (name.startsWith('address.')) {
      // Handle nested address fields
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Validate email with regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate step 1 based on role
  const validateStep1 = () => {
    // For role selection step (client/employee flow)
    if (formData.role === 'client' || formData.role === 'employee') {
      return true;
    }
    
    // For manager role in step 1, validate name and email
    if (formData.role === 'manager') {
      if (!formData.name) {
        toast.error('Full name is required');
        return false;
      }
      if (!formData.email) {
        toast.error('Email address is required');
        return false;
      }
      if (!validateEmail(formData.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
      return true;
    }
    
    return true;
  };

  // Validate step 2 based on role
  const validateStep2 = () => {
    if (formData.role === 'manager') {
      // For manager role in step 2, validate password
      if (!formData.password) {
        toast.error('Password is required');
        return false;
      }
      if (!formData.confirmPassword) {
        toast.error('Please confirm your password');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return false;
      }
      return true;
    } else {
      // For client/employee roles in step 2, validate name and email
      if (!formData.name) {
        toast.error('Full name is required');
        return false;
      }
      if (!formData.email) {
        toast.error('Email address is required');
        return false;
      }
      if (!validateEmail(formData.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
      return true;
    }
  };

  // Validate step 3 based on role
  const validateStep3 = () => {
    if (formData.role === 'manager') {
      // For manager role in step 3, validate department
      if (!formData.department) {
        toast.error('Department is required for manager accounts');
        return false;
      }
      return true;
    } else {
      // For client/employee in step 3, validate password
      if (!formData.password) {
        toast.error('Password is required');
        return false;
      }
      if (!formData.confirmPassword) {
        toast.error('Please confirm your password');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return false;
      }
      return true;
    }
  };

  // Validate step 4 (only for client/employee roles)
  const validateStep4 = () => {
    if (formData.role === 'client') {
      if (!formData.company) {
        toast.error('Company name is required for client accounts');
        return false;
      }
      return true;
    } else if (formData.role === 'employee') {
      if (!formData.department) {
        toast.error('Department is required for employee accounts');
        return false;
      }
      return true;
    }
    return true;
  };

  // Move to next step
  const nextStep = () => {
    // Different validation for each step based on role and current step
    if (currentStep === 1) {
      if (!validateStep1()) return;
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
    } else if (currentStep === 3) {
      if (!validateStep3()) return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  // Move to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation based on role and current step
    if (formData.role === 'manager' && currentStep === 3) {
      if (!validateStep3()) return;
    } else if (formData.role !== 'manager' && currentStep === 4) {
      if (!validateStep4()) return;
    }
    
    // Common validations for all roles
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Role-specific validations
    if (formData.role === 'client' && !formData.company) {
      toast.error('Company name is required for client accounts');
      return;
    }

    if ((formData.role === 'employee' || formData.role === 'manager') && !formData.department) {
      toast.error('Department is required');
      return;
    }

    try {
      setIsSubmitting(true);
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      // Successful registration will redirect in the AuthContext
    } catch (error) {
      // Handle different error types
      if (error.response) {
        // Server responded with an error status
        const errorMessage = error.response.data?.message || 'Registration failed';
        toast.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response was received
        toast.error('Network error. Please check your connection.');
      } else {
        // Something else caused the error
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get total steps based on role
  const getTotalSteps = () => formData.role === 'manager' ? 3 : 4;

  // Render step indicators
  const renderStepIndicators = () => {
    const totalSteps = getTotalSteps();
    
    return (
      <div className="flex justify-center mb-8">
        {[...Array(totalSteps)].map((_, index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          
          return (
            <div key={stepNum} className="flex items-center">
              {/* Step circle */}
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isActive ? 'border-primary-600 bg-primary-600 text-white' : isCompleted ? 'border-primary-600 bg-white text-primary-600' : 'border-gray-300 bg-white text-gray-300'}`}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              
              {/* Connector line (except after last step) */}
              {stepNum < totalSteps && (
                <div className={`w-12 h-1 ${currentStep > stepNum ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    // Different flow for manager role vs client/employee
    if (formData.role === 'manager') {
      switch (currentStep) {
        case 1:
          return renderManagerStep1();
        case 2:
          return renderManagerStep2();
        case 3:
          return renderManagerStep3();
        default:
          return null;
      }
    }
    
    // Flow for client and employee roles
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  // Step 1: Role Selection (Client/Employee flow)
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-900">Choose your account type</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            id="role-client"
            name="role"
            type="radio"
            value="client"
            checked={formData.role === 'client'}
            onChange={handleChange}
            className="h-5 w-5 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="role-client" className="block text-sm font-medium text-gray-700">
            Client
            <p className="text-xs text-gray-500">I want to place orders and submit claims</p>
          </label>
        </div>
        
        {/* Note informing users that employee/manager accounts require authorization */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Employee and manager accounts can only be created by existing managers. 
            If you need an employee or manager account, please contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );

  // Step 2: Account Information (Client/Employee flow)
  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-900">Your account information</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Password (Client/Employee flow)
  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-900">Create a password</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

  // Step 4: Role-specific information (Client/Employee flow)
  const renderStep4 = () => {
    if (formData.role === 'client') {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900">Company Information</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <h4 className="text-md font-medium text-gray-700 mt-4">Shipping Address</h4>
            <div>
              <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                id="address.street"
                name="address.street"
                type="text"
                autoComplete="street-address"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="123 Main St"
                value={formData.address.street}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  id="address.city"
                  name="address.city"
                  type="text"
                  autoComplete="address-level2"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="New York"
                  value={formData.address.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">State / Province</label>
                <input
                  id="address.state"
                  name="address.state"
                  type="text"
                  autoComplete="address-level1"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="NY"
                  value={formData.address.state}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                <input
                  id="address.postalCode"
                  name="address.postalCode"
                  type="text"
                  autoComplete="postal-code"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="10001"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  id="address.country"
                  name="address.country"
                  type="text"
                  autoComplete="country"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="United States"
                  value={formData.address.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else if (formData.role === 'employee') {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900">Employee Information</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
              <select
                id="department"
                name="department"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option value="design">Design</option>
                <option value="prepress">Prepress</option>
                <option value="production">Production</option>
                <option value="management">Management</option>
              </select>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Manager-specific steps
  // Step 1: Account Information (Manager flow)
  const renderManagerStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-900">Manager Account Information</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

  // Step 2: Password (Manager flow)
  const renderManagerStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-900">Create a secure password</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Department Information (Manager flow)
  const renderManagerStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-900">Management Information</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
          <select
            id="department"
            name="department"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="design">Design</option>
            <option value="prepress">Prepress</option>
            <option value="production">Production</option>
            <option value="management">Management</option>
            <option value="sales">Sales</option>
          </select>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

  // Render navigation buttons
  const renderNavButtons = () => {
    const isLastStep = 
      (formData.role === 'manager' && currentStep === 3) || 
      (formData.role !== 'manager' && currentStep === 4);

    return (
      <div className="flex justify-between mt-8">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back
          </button>
        )}
        
        {!isLastStep ? (
          <button
            type="button"
            onClick={nextStep}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${currentStep > 1 ? 'ml-auto' : 'w-full justify-center'}`}
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden" style={{ width: '70%' }}>
        <div className="md:flex">
          {/* Left side - Image/Branding */}
          <div className="hidden md:block md:w-1/3 bg-primary-600 py-10 px-6 text-white">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-6">Welcome to Unidots</h2>
                <p className="text-primary-100 mb-6">Create your account to get started with our services.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Streamlined workflow</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Real-time updates</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Secure communication</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="md:w-2/3 py-10 px-6">
            <div className="mb-6">
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                ← Back to Login
              </Link>
            </div>
            
            {renderStepIndicators()}
            
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              {renderNavButtons()}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;