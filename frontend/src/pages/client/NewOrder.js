import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const NewOrder = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Calculate default deadline (7 days from now)
  const defaultDeadline = new Date();
  defaultDeadline.setDate(defaultDeadline.getDate() + 7);
  // Format for input date field: YYYY-MM-DD
  const formattedDefaultDeadline = defaultDeadline.toISOString().split('T')[0];

  // Calculate initial color count
  const calculateInitialColorCount = () => {
    return Math.max(1, 0); // Start with minimum 1 color
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    orderType: 'New Order',
    specifications: {
      dimensions: {
    width: '',
    height: '',
        widthRepeatCount: 1,
        heightRepeatCount: 1,
        unit: 'mm',
      },
      colors: calculateInitialColorCount(),
      usedColors: [],
      customColors: [],
      printingMode: 'Surface Printing',
      material: 'Flint',
      materialThickness: 1.7,
      additionalDetails: '',
    },
    priority: 'Medium',
    deadline: formattedDefaultDeadline,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // Standard color options with color codes
  const standardColorOptions = [
    { value: 'Cyan', label: 'Cyan (C)', color: '#00FFFF' },
    { value: 'Magenta', label: 'Magenta (M)', color: '#FF00FF' },
    { value: 'Yellow', label: 'Yellow (Y)', color: '#FFFF00' },
    { value: 'Black', label: 'Black (K)', color: '#000000' },
    { value: 'CMYK Combined', label: 'CMYK Combined', color: '#333333' },
    { value: 'Red', label: 'Red', color: '#FF0000' },
    { value: 'Blue', label: 'Blue', color: '#0000FF' },
    { value: 'Green', label: 'Green', color: '#008000' },
    { value: 'Golden', label: 'Golden', color: '#FFD700' },
    { value: 'Silver', label: 'Silver', color: '#C0C0C0' },
    { value: 'White', label: 'White', color: '#FFFFFF' },
    { value: 'Other', label: 'Transparent', color: '#AAAAAA' },
  ];

  // Calculate estimated price whenever relevant form fields change
  useEffect(() => {
    calculateEstimatedPrice();
  }, [
    formData.specifications.dimensions.width,
    formData.specifications.dimensions.height,
    formData.specifications.dimensions.widthRepeatCount,
    formData.specifications.dimensions.heightRepeatCount,
    formData.specifications.colors,
    formData.specifications.usedColors,
    formData.specifications.customColors,
    formData.specifications.materialThickness,
  ]);

  const calculateEstimatedPrice = () => {
    const { width, height, widthRepeatCount, heightRepeatCount } = formData.specifications.dimensions;
    const { usedColors, customColors, materialThickness } = formData.specifications;

    // If any required field is missing, don't calculate
    if (!width || !height) {
      setEstimatedPrice(0);
      return;
    }

    // Determine material price factor based on thickness
    let materialPriceFactor = 0.77; // Default to 1.7 thickness
    if (materialThickness === 1.14) {
      materialPriceFactor = 0.75;
    } else if (materialThickness === 1.7) {
      materialPriceFactor = 0.85;
    } else if (materialThickness === 2.54) {
      materialPriceFactor = 0.95;
    }

    // Count colors - with special handling for CMYK Combined
    const cmykWeight = usedColors.includes('CMYK Combined') ? 4 : 0;
    const otherColorsCount = usedColors.filter(c => c !== 'CMYK Combined').length;
    const numberOfCustomColors = customColors?.length > 0 ? customColors.filter(color => color.trim() !== '').length : 0;
    const totalColorsUsed = Math.max(cmykWeight + otherColorsCount + numberOfCustomColors, 1); // minimum 1

    // Calculate dimensions with repeat counts
    const totalWidth = parseFloat(width) * (widthRepeatCount || 1);
    const totalHeight = parseFloat(height) * (heightRepeatCount || 1);

    // Calculate price
    const price = ((totalWidth * totalHeight * totalColorsUsed) * materialPriceFactor).toFixed(2);
    setEstimatedPrice(price);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('specifications.')) {
      // Handle nested specifications object
      const specField = name.split('.')[1];
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specField]: value,
        },
      });
    } else if (name.includes('dimensions.')) {
      // Handle nested dimensions object within specifications
      const dimField = name.split('.')[1];
      
      let processedValue = value;
      if (dimField === 'widthRepeatCount' || dimField === 'heightRepeatCount') {
        processedValue = Math.max(1, parseInt(value) || 1); // Ensure minimum value of 1
      }
      
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          dimensions: {
            ...formData.specifications.dimensions,
            [dimField]: processedValue,
          },
        },
      });
    } else {
      // Handle top-level fields
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleColorToggle = (color) => {
    const currentColors = [...formData.specifications.usedColors];
    const colorIndex = currentColors.indexOf(color);
    
    if (colorIndex === -1) {
      // Add color if not already selected
      currentColors.push(color);
    } else {
      // Remove color if already selected
      currentColors.splice(colorIndex, 1);
    }
    
    // Calculate total number of colors including custom colors
    const cmykWeight = currentColors.includes('CMYK Combined') ? 4 : 0;
    const otherColorsCount = currentColors.filter(c => c !== 'CMYK Combined').length;
    const customColorsCount = formData.specifications.customColors?.filter(c => c.trim() !== '').length || 0;
    
    const totalColors = Math.max(
      cmykWeight + otherColorsCount + customColorsCount,
      1 // Minimum of 1 color
    );
    
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        usedColors: currentColors,
        colors: totalColors, // Update the colors count
      },
    });
  };

  const handleCustomColorChange = (index, value) => {
    const newCustomColors = [...formData.specifications.customColors];
    newCustomColors[index] = value;
    
    // Calculate total number of colors including standard colors
    const cmykWeight = formData.specifications.usedColors.includes('CMYK Combined') ? 4 : 0;
    const otherColorsCount = formData.specifications.usedColors.filter(c => c !== 'CMYK Combined').length;
    const customColorsCount = newCustomColors.filter(c => c.trim() !== '').length;
    
    const totalColors = Math.max(
      cmykWeight + otherColorsCount + customColorsCount,
      1 // Minimum of 1 color
    );
    
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        customColors: newCustomColors,
        colors: totalColors, // Update the colors count
      },
    });
  };

  const addCustomColorField = () => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        customColors: [...formData.specifications.customColors, ''],
      },
    });
  };

  const removeCustomColorField = (index) => {
    const newCustomColors = [...formData.specifications.customColors];
    newCustomColors.splice(index, 1);
    
    // Calculate total number of colors after removing a custom color
    const cmykWeight = formData.specifications.usedColors.includes('CMYK Combined') ? 4 : 0;
    const otherColorsCount = formData.specifications.usedColors.filter(c => c !== 'CMYK Combined').length;
    const customColorsCount = newCustomColors.filter(c => c.trim() !== '').length;
    
    const totalColors = Math.max(
      cmykWeight + otherColorsCount + customColorsCount,
      1 // Minimum of 1 color
    );
    
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        customColors: newCustomColors,
        colors: totalColors, // Update the colors count
      },
    });
  };

  // Function to try to get color for custom color inputs
  const getColorForCustomColor = (colorName) => {
    if (!colorName || colorName.trim() === '') return '#333333';
    
    // Check if the color name matches any of our standard colors
    const matchedColor = standardColorOptions.find(
      option => option.label.toLowerCase() === colorName.toLowerCase() || 
                option.value.toLowerCase() === colorName.toLowerCase()
    );
    
    if (matchedColor) return matchedColor.color;
    
    // Try to use the color name directly (works for standard CSS color names)
    try {
      // Common color names that might be entered
      const commonColors = {
        'gold': '#FFD700',
        'silver': '#C0C0C0',
        'bronze': '#CD7F32',
        'navy': '#000080',
        'teal': '#008080',
        'maroon': '#800000',
        'olive': '#808000',
        'lime': '#00FF00',
        'aqua': '#00FFFF',
        'fuchsia': '#FF00FF'
      };
      
      if (commonColors[colorName.toLowerCase()]) {
        return commonColors[colorName.toLowerCase()];
      }
      
      return colorName;
    } catch (e) {
      return '#333333'; // Default color if can't be determined
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      
      // Check if any custom colors need to be marked as 'Other'
      const formattedOrderData = {
        ...formData,
        specifications: {
          ...formData.specifications,
          // Filter out empty custom colors
          customColors: formData.specifications.customColors.filter(color => color.trim() !== '')
        },
      };
      
      const res = await api.post('/api/orders', formattedOrderData);
      
      toast.success('Order submitted successfully');
      navigate('/client/orders');
    } catch (error) {
      console.error('Error submitting order:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit order');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Order</h1>
        <p className="mt-2 text-sm text-gray-500">
          Please provide the details for your new order request.
        </p>
        <p className="mt-1 text-sm text-gray-500 font-medium">
          Note: You can upload design files and reference materials after submitting your order from the order details page.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8 divide-y divide-gray-200">
          {/* Basic Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Order Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                      required
                    value={formData.title}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Order Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
              </div>
            </div>
            
                <div className="sm:col-span-3">
                  <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">
                    Order Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="orderType"
                      name="orderType"
                      value={formData.orderType}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="New Order">New Order</option>
                      <option value="Existing">Existing Order</option>
                      <option value="Existing With Changes">Existing With Modifications</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <div className="mt-1">
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                    Deadline
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="deadline"
                      id="deadline"
                      required
                      value={formData.deadline}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
                  </div>
                </div>
                
          {/* Technical Specifications */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Technical Specifications</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Dimensions */}
                <div className="sm:col-span-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Dimensions</h4>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                  <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                        Width
                  </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                        name="dimensions.width"
                    id="width"
                        required
                    min="1"
                        step="0.1"
                        value={formData.specifications.dimensions.width}
                    onChange={handleChange}
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <label htmlFor="widthRepeatCount" className="block text-sm font-medium text-gray-700">
                      Width Repeat
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="number"
                        name="dimensions.widthRepeatCount"
                        id="widthRepeatCount"
                    required
                        min="1"
                        step="1"
                        value={formData.specifications.dimensions.widthRepeatCount}
                        onChange={handleChange}
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
                  <div className="sm:col-span-2">
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                        Height
                  </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                        name="dimensions.height"
                    id="height"
                        required
                    min="1"
                        step="0.1"
                        value={formData.specifications.dimensions.height}
                    onChange={handleChange}
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <label htmlFor="heightRepeatCount" className="block text-sm font-medium text-gray-700">
                      Height Repeat
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="number"
                        name="dimensions.heightRepeatCount"
                        id="heightRepeatCount"
                    required
                        min="1"
                        step="1"
                        value={formData.specifications.dimensions.heightRepeatCount}
                        onChange={handleChange}
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Material */}
                <div className="sm:col-span-3">
                  <label htmlFor="material" className="block text-sm font-medium text-gray-700">
                    Material Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="material"
                      name="specifications.material"
                      value={formData.specifications.material}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="Flint">Flint</option>
                      <option value="Strong">Strong</option>
                      <option value="Taiwan">Taiwan</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="materialThickness" className="block text-sm font-medium text-gray-700">
                    Material Thickness (microns)
                  </label>
                  <div className="mt-1">
                    <select
                      id="materialThickness"
                      name="specifications.materialThickness"
                      value={formData.specifications.materialThickness}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value={1.14}>1.14</option>
                      <option value={1.7}>1.7</option>
                      <option value={2.54}>2.54</option>
                    </select>
                  </div>
                </div>
                
                {/* Printing Mode */}
                <div className="sm:col-span-3">
                  <label htmlFor="printingMode" className="block text-sm font-medium text-gray-700">
                    Printing Mode
                  </label>
                  <div className="mt-1">
                    <select
                      id="printingMode"
                      name="specifications.printingMode"
                      value={formData.specifications.printingMode}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="Surface Printing">Surface Printing</option>
                      <option value="Reverse Printing">Reverse Printing</option>
                    </select>
                  </div>
                </div>

                {/* Colors */}
                <div className="sm:col-span-3">
                  <label htmlFor="colors" className="block text-sm font-medium text-gray-700">
                    Number of Colors
                  </label>
                  <div className="mt-1">
                    <div className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 bg-gray-50">
                      {(() => {
                        const cmykWeight = formData.specifications.usedColors.includes('CMYK Combined') ? 4 : 0;
                        const otherColorsCount = formData.specifications.usedColors.filter(c => c !== 'CMYK Combined').length;
                        const customColorsCount = formData.specifications.customColors?.filter(c => c.trim() !== '').length || 0;
                        return Math.max(cmykWeight + otherColorsCount + customColorsCount, 1);
                      })()}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Based on your selected colors below (CMYK Combined counts as 4 colors)
                  </p>
                </div>

                {/* Color Selection */}
                <div className="sm:col-span-6">
                  <fieldset>
                    <legend className="text-sm font-medium text-gray-700">Select Colors</legend>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">Choose the colors you need for this order:</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {standardColorOptions.map((colorOption) => (
                          <div key={colorOption.value} className="relative flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id={`color-${colorOption.value}`}
                                name={`color-${colorOption.value}`}
                                type="checkbox"
                                checked={formData.specifications.usedColors.includes(colorOption.value)}
                                onChange={() => handleColorToggle(colorOption.value)}
                                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label 
                                htmlFor={`color-${colorOption.value}`} 
                                className="font-bold" 
                                style={{ 
                                  color: colorOption.color,
                                  // Add text shadow for better visibility of light colors
                                  textShadow: colorOption.value === 'white' || colorOption.value === 'yellow' ? '0px 0px 1px #666666' : 'none',
                                  // Special style for transparent
                                  opacity: colorOption.value === 'transparent' ? 0.7 : 1,
                                  background: colorOption.value === 'transparent' ? 'repeating-linear-gradient(45deg, #ddd, #ddd 2px, #fff 2px, #fff 4px)' : 'none',
                                  padding: colorOption.value === 'transparent' ? '0 3px' : '0'
                                }}
                              >
                                {colorOption.label}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Custom Colors */}
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Custom Colors</p>
                        <p className="text-xs text-gray-500">Add any specific colors not listed above:</p>
                        
                        {formData.specifications.customColors.map((color, index) => (
                          <div key={index} className="flex mt-2">
                            <input
                              type="text"
                              value={color}
                              onChange={(e) => handleCustomColorChange(index, e.target.value)}
                              placeholder="Enter custom color"
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              style={{
                                color: color.trim() !== '' ? getColorForCustomColor(color) : 'inherit',
                                fontWeight: color.trim() !== '' ? 'bold' : 'normal'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeCustomColorField(index)}
                              className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={addCustomColorField}
                          className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          + Add Custom Color
                        </button>
                      </div>
                    </div>
                  </fieldset>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="additionalDetails"
                      name="specifications.additionalDetails"
                      rows={3}
                      value={formData.specifications.additionalDetails}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Any additional details or special instructions..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Estimation */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Estimated Price</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Based on your specifications, the estimated price for this order is:
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="text-center">
                <span className="text-3xl font-bold text-gray-900">${estimatedPrice}</span>
                <p className="mt-2 text-sm text-gray-500">
                  This is an estimate based on the dimensions, colors, and material you've selected.
                  Final pricing may vary based on additional factors.
                </p>
                <div className="mt-3 text-xs text-gray-500 text-left">
                  <p>Calculation: (Height × Height Repeat) × (Width × Width Repeat) × Number of Colors × Material Factor</p>
                  <p className="mt-1">
                    = ({formData.specifications.dimensions.height || 0} × {formData.specifications.dimensions.heightRepeatCount || 1}) 
                    × ({formData.specifications.dimensions.width || 0} × {formData.specifications.dimensions.widthRepeatCount || 1}) 
                    × {(() => {
                        const cmykWeight = formData.specifications.usedColors.includes('CMYK Combined') ? 4 : 0;
                        const otherColorsCount = formData.specifications.usedColors.filter(c => c !== 'CMYK Combined').length;
                        const customColorsCount = formData.specifications.customColors?.filter(c => c.trim() !== '').length || 0;
                        return Math.max(cmykWeight + otherColorsCount + customColorsCount, 1);
                      })()} 
                    × {formData.specifications.materialThickness === 1.14 ? 0.75 : 
                       formData.specifications.materialThickness === 1.7 ? 0.77 : 0.79}
                  </p>
                  </div>
                </div>
              </div>
            </div>
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
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
              </button>
            </div>
          </div>
          
        </div>
      </form>

      {/* Info Section */}
      <div className="mt-10 bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
        <p className="font-medium text-gray-700">What happens next?</p>
        <ol className="mt-2 list-decimal list-inside space-y-1">
          <li>Your order will be reviewed by our team.</li>
          <li>We'll process your request and estimate delivery times.</li>
          <li>You can check the status of your order in the Orders page.</li>
          <li>You can upload reference files in the order details page after submission.</li>
        </ol>
      </div>
    </div>
  );
};

export default NewOrder;