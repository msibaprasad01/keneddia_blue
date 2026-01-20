import React, { useState } from 'react';
import { colors } from "@/lib/colors/colors";
import { X, MapPin } from 'lucide-react';
import { addLocation } from '@/Api/Api';
function AddLocationModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    country: 'India',
    status: 'active',
    address: '',
    pincode: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Location name is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLocation = {
        id: Date.now(),
        ...formData
      };

      onSuccess(newLocation);
    } catch (error) {
      console.error('Error adding location:', error);
      setErrors({ submit: 'Failed to add location. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <MapPin size={20} style={{ color: colors.primary }} />
            </div>
            <div>
              <h2 
                className="text-xl font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Add New Location
              </h2>
              <p 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Enter location details below
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: colors.textSecondary }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {errors.submit && (
              <div 
                className="mb-4 p-3 rounded-lg text-sm"
                style={{ 
                  backgroundColor: '#fef2f2',
                  color: '#dc2626'
                }}
              >
                {errors.submit}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location Name */}
              <div className="md:col-span-2">
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Location Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter location name (e.g., Mumbai)"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: errors.name ? '#ef4444' : colors.border,
                    color: colors.textPrimary
                  }}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: errors.state ? '#ef4444' : colors.border,
                    color: colors.textPrimary
                  }}
                />
                {errors.state && (
                  <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: errors.country ? '#ef4444' : colors.border,
                    color: colors.textPrimary
                  }}
                />
                {errors.country && (
                  <p className="mt-1 text-xs text-red-500">{errors.country}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.textPrimary
                  }}
                />
              </div>

              {/* Pincode */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter 6-digit pincode"
                  maxLength="6"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: errors.pincode ? '#ef4444' : colors.border,
                    color: colors.textPrimary
                  }}
                />
                {errors.pincode && (
                  <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone"
                  maxLength="10"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: errors.phone ? '#ef4444' : colors.border,
                    color: colors.textPrimary
                  }}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: errors.email ? '#ef4444' : colors.border,
                    color: colors.textPrimary
                  }}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.textPrimary
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div 
            className="flex items-center justify-end gap-3 px-6 py-4 border-t"
            style={{ borderColor: colors.border }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border"
              style={{ 
                borderColor: colors.border,
                color: colors.textPrimary,
                backgroundColor: 'white'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.primary }}
              onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = colors.primaryHover)}
              onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = colors.primary)}
            >
              {isSubmitting ? 'Adding...' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLocationModal;