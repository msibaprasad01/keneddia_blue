import React, { useState } from 'react';
import { colors } from "@/lib/colors/colors";
import { X, User, Eye, EyeOff } from 'lucide-react';

function AddUserModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Staff',
    location: '',
    phone: '',
    status: 'active'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = ['Admin', 'Manager', 'Staff', 'Reception'];
  const locations = ['Mumbai Central', 'Delhi Branch', 'Bangalore Office', 'Pune Branch'];

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
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
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
      
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        location: formData.location,
        status: formData.status
      };

      onSuccess(newUser);
    } catch (error) {
      console.error('Error adding user:', error);
      setErrors({ submit: 'Failed to add user. Please try again.' });
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
              <User size={20} style={{ color: colors.primary }} />
            </div>
            <div>
              <h2 
                className="text-xl font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Add New User
              </h2>
              <p 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Enter user details below
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
              {/* Full Name */}
              <div className="md:col-span-2">
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
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

              {/* Email */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Email <span className="text-red-500">*</span>
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

              {/* Password */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: errors.password ? '#ef4444' : colors.border,
                      color: colors.textPrimary
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: colors.textSecondary }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: errors.confirmPassword ? '#ef4444' : colors.border,
                      color: colors.textPrimary
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: colors.textSecondary }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.textPrimary
                  }}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: errors.location ? '#ef4444' : colors.border,
                    color: colors.textPrimary
                  }}
                >
                  <option value="">Select location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {errors.location && (
                  <p className="mt-1 text-xs text-red-500">{errors.location}</p>
                )}
              </div>

              {/* Status */}
              <div className="md:col-span-2">
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
              {isSubmitting ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;