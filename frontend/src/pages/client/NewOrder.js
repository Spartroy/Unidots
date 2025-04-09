import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';

const NewOrder = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Order form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    printType: 'flexographic',
    quantity: 1,
    width: '',
    height: '',
    material: 'paper',
    colors: 1,
    finishType: 'matte',
    additionalNotes: ''
  });
  
  // Files state
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle file drops
  const onDrop = acceptedFiles => {
    // Add new files to the existing files array
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    ]);
  };
  
  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/vnd.adobe.illustrator': ['.ai'],
      'application/postscript': ['.eps'],
      'application/x-indesign': ['.indd']
    },
    maxSize: 10485760, // 10MB
  });
  
  // Remove file from the list
  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(fileToRemove.preview);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // First, create the order
      const orderResponse = await axios.post('/api/orders', formData);
      const orderId = orderResponse.data._id;
      
      // Then, if there are files, upload them
      if (files.length > 0) {
        setUploading(true);
        
        // Create form data for file upload
        const uploadFormData = new FormData();
        uploadFormData.append('orderId', orderId);
        
        // Append all files
        files.forEach(file => {
          uploadFormData.append('files', file);
        });
        
        // Upload files
        await axios.post('/api/files/upload', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setUploading(false);
      }
      
      toast.success('Order submitted successfully!');
      navigate(`/client/orders/${orderId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit order');
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Order</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please fill in the details for your new printing order.
        </p>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Order Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., Product Labels for XYZ Brand"
                />
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Describe your order requirements"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Brief description of what you need printed.
              </p>
            </div>
          </div>
          
          {/* Print Specifications */}
          <div>
            <h4 className="text-md font-medium text-gray-900">Print Specifications</h4>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="printType" className="block text-sm font-medium text-gray-700">
                  Print Type
                </label>
                <div className="mt-1">
                  <select
                    id="printType"
                    name="printType"
                    value={formData.printType}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="flexographic">Flexographic</option>
                    <option value="digital">Digital</option>
                    <option value="offset">Offset</option>
                    <option value="screen">Screen</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                  Width (mm)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="width"
                    id="width"
                    min="1"
                    value={formData.width}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                  Height (mm)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="height"
                    id="height"
                    min="1"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="material" className="block text-sm font-medium text-gray-700">
                  Material
                </label>
                <div className="mt-1">
                  <select
                    id="material"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="paper">Paper</option>
                    <option value="vinyl">Vinyl</option>
                    <option value="plastic">Plastic</option>
                    <option value="cardboard">Cardboard</option>
                    <option value="fabric">Fabric</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="colors" className="block text-sm font-medium text-gray-700">
                  Number of Colors
                </label>
                <div className="mt-1">
                  <select
                    id="colors"
                    name="colors"
                    value={formData.colors}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="1">1 Color</option>
                    <option value="2">2 Colors</option>
                    <option value="3">3 Colors</option>
                    <option value="4">4 Colors (CMYK)</option>
                    <option value="5">5+ Colors (Special)</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="finishType" className="block text-sm font-medium text-gray-700">
                  Finish Type
                </label>
                <div className="mt-1">
                  <select
                    id="finishType"
                    name="finishType"
                    value={formData.finishType}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="matte">Matte</option>
                    <option value="glossy">Glossy</option>
                    <option value="satin">Satin</option>
                    <option value="uv">UV Coating</option>
                    <option value="laminated">Laminated</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <div className="mt-1">
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    rows={3}
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Any special instructions or requirements"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* File Upload */}
          <div>
            <h4 className="text-md font-medium text-gray-900">Upload Files</h4>
            <p className="mt-1 text-sm text-gray-500">
              Upload your design files, artwork, or reference materials (max 10MB per file).
            </p>
            
            <div className="mt-4">
              <div 
                {...getRootProps()} 
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <input {...getInputProps()} />
                    <p className="pl-1">
                      Drag and drop files here, or click to select files
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, AI, EPS, INDD, JPG, PNG up to 10MB</p>
                </div>
              </div>
            </div>
            
            {/* File Preview */}
            {files.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700">Attached Files</h5>
                <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex items-center">
                        <span className="font-medium text-gray-500 mr-2">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(file)}
                          className="font-medium text-primary-600 hover:text-primary-500"
                        >
                          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/client/orders')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {uploading ? 'Uploading Files...' : 'Submitting...'}
                  </>
                ) : 'Submit Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrder;