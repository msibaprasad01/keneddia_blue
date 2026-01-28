import React, { useState, useEffect } from 'react';
import { colors } from "@/lib/colors/colors";
import { X, Upload, Loader2, MapPin, Tag, Link as LinkIcon, FileText, Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import { createDailyOffer, updateDailyOfferById } from '@/Api/Api';
import { toast } from 'react-hot-toast';

function CreateOfferModal({ isOpen, onClose, editingOffer }) {
  const [formData, setFormData] = useState({
    // Required fields
    title: '',
    description: '',
    couponCode: '',
    ctaText: '',
    location: '',
    
    // Optional fields
    expiresAt: '',
    availableHours: '',
    
    // Image object
    image: {
      src: '',
      alt: '',
      width: 800,
      height: 600
    },
    
    // Legacy/backward compatibility fields
    targetType: 'GLOBAL',
    targetRefId: null,
    badgeTypeId: 1,
    imageMediaId: null,
    active: true
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'upload'
  const [selectedFile, setSelectedFile] = useState(null);

  // Populate form when editing
  useEffect(() => {
    if (editingOffer) {
      setFormData({
        // New format fields
        title: editingOffer.title || '',
        description: editingOffer.description || '',
        couponCode: editingOffer.couponCode || editingOffer.offerCode || '',
        ctaText: editingOffer.ctaText || '',
        location: editingOffer.location || editingOffer.targetName || '',
        expiresAt: editingOffer.expiresAt || '',
        availableHours: editingOffer.availableHours || '',
        
        // Image object
        image: {
          src: editingOffer.image?.src || editingOffer.imageUrl || '',
          alt: editingOffer.image?.alt || editingOffer.title || '',
          width: editingOffer.image?.width || 800,
          height: editingOffer.image?.height || 600
        },
        
        // Legacy fields for backward compatibility
        targetType: editingOffer.targetType || 'GLOBAL',
        targetRefId: editingOffer.targetRefId || null,
        badgeTypeId: editingOffer.badgeTypeId || 1,
        imageMediaId: editingOffer.imageMediaId || null,
        active: editingOffer.active ?? true
      });
      
      // Set image preview
      setImagePreview(editingOffer.image?.src || editingOffer.imageUrl || null);
    } else {
      // Reset form for new offer
      setFormData({
        title: '',
        description: '',
        couponCode: '',
        ctaText: '',
        location: '',
        expiresAt: '',
        availableHours: '',
        image: {
          src: '',
          alt: '',
          width: 800,
          height: 600
        },
        targetType: 'GLOBAL',
        targetRefId: null,
        badgeTypeId: 1,
        imageMediaId: null,
        active: true
      });
      setImagePreview(null);
      setSelectedFile(null);
    }
  }, [editingOffer]);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Clear targetRefId when switching to GLOBAL
      if (field === 'targetType' && value === 'GLOBAL') {
        updated.targetRefId = null;
      }
      
      // Auto-fill location based on targetType
      if (field === 'targetType') {
        if (value === 'GLOBAL') {
          updated.location = 'All Locations';
        } else if (value === 'LOCATION' && updated.targetRefId) {
          updated.location = `Location #${updated.targetRefId}`;
        } else if (value === 'PROPERTY' && updated.targetRefId) {
          updated.location = `Property #${updated.targetRefId}`;
        }
      }
      
      // Update location when targetRefId changes
      if (field === 'targetRefId' && value) {
        if (updated.targetType === 'LOCATION') {
          updated.location = `Location #${value}`;
        } else if (updated.targetType === 'PROPERTY') {
          updated.location = `Property #${value}`;
        }
      }
      
      return updated;
    });
  };

  const handleImageChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      image: {
        ...prev.image,
        [field]: value
      }
    }));
    
    // Update preview if src changes
    if (field === 'src') {
      setImagePreview(value);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        handleImageChange('src', reader.result); // Store base64 temporarily
      };
      reader.readAsDataURL(file);

      // Auto-fill alt text if empty
      if (!formData.image.alt) {
        handleImageChange('alt', file.name.split('.')[0]);
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    handleImageChange('src', '');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!formData.couponCode.trim()) {
      toast.error('Coupon code is required');
      return false;
    }
    if (!formData.ctaText.trim()) {
      toast.error('CTA text is required');
      return false;
    }
    if (!formData.image.src.trim()) {
      toast.error('Image is required');
      return false;
    }
    if (!formData.location.trim()) {
      toast.error('Location is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Prepare payload in recommended format
      const payload = {
        id: editingOffer?.id || undefined,
        title: formData.title,
        description: formData.description,
        couponCode: formData.couponCode,
        ctaText: formData.ctaText,
        location: formData.location,
        expiresAt: formData.expiresAt || null,
        availableHours: formData.availableHours || null,
        image: {
          src: formData.image.src,
          alt: formData.image.alt || formData.title,
          width: parseInt(formData.image.width) || 800,
          height: parseInt(formData.image.height) || 600
        },
        active: formData.active,
        
        // Include legacy fields for backward compatibility
        targetType: formData.targetType,
        targetRefId: formData.targetType === 'GLOBAL' ? null : parseInt(formData.targetRefId),
        badgeTypeId: parseInt(formData.badgeTypeId),
        imageMediaId: formData.imageMediaId ? parseInt(formData.imageMediaId) : null
      };

      let response;
      if (editingOffer) {
        // Update existing offer
        response = await updateDailyOfferById(editingOffer.id, payload);
        toast.success('Offer updated successfully');
      } else {
        // Create new offer
        response = await createDailyOffer(payload);
        toast.success('Offer created successfully');
      }

      console.log('Response:', response.data);
      onClose(true); // Pass true to indicate refresh needed
      
    } catch (error) {
      console.error('Error saving offer:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Failed to save offer';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg p-5 w-[90%] max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.contentBg }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 
            className="text-lg font-semibold m-0"
            style={{ color: colors.textPrimary }}
          >
            {editingOffer ? 'Edit Offer' : 'Create New Offer'}
          </h3>
          <button
            onClick={() => onClose(false)}
            className="p-1 rounded-md transition-colors"
            style={{ 
              backgroundColor: 'transparent',
              color: colors.textSecondary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.border;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label 
                className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
                style={{ color: colors.textSecondary }}
              >
                <Tag size={14} />
                Offer Title <span style={{ color: colors.error }}>*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.mainBg,
                  color: colors.textPrimary
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                }}
                placeholder="e.g., Winter Alpine Retreat - 20% Off"
              />
            </div>

            {/* Description */}
            <div>
              <label 
                className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
                style={{ color: colors.textSecondary }}
              >
                <FileText size={14} />
                Description <span style={{ color: colors.error }}>*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors resize-none"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.mainBg,
                  color: colors.textPrimary
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                }}
                placeholder="Describe the offer in detail..."
              />
            </div>

            {/* Coupon Code and CTA Text */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Coupon Code <span style={{ color: colors.error }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) => handleInputChange('couponCode', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors uppercase"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                  placeholder="WINTER2025"
                />
              </div>

              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  CTA Button Text <span style={{ color: colors.error }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => handleInputChange('ctaText', e.target.value)}
                  className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                  placeholder="Explore Winter Stay"
                />
              </div>
            </div>

            {/* Target Type and Target Ref ID */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  <MapPin size={14} />
                  Target Type
                </label>
                <select
                  value={formData.targetType}
                  onChange={(e) => handleInputChange('targetType', e.target.value)}
                  className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                >
                  <option value="GLOBAL">Global (All Locations)</option>
                  <option value="LOCATION">Specific Location</option>
                  <option value="PROPERTY">Specific Property</option>
                </select>
              </div>

              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  {formData.targetType === 'LOCATION' ? 'Location ID' : 
                   formData.targetType === 'PROPERTY' ? 'Property ID' : 
                   'Target Ref ID'}
                  {formData.targetType !== 'GLOBAL' && <span style={{ color: colors.error }}> *</span>}
                </label>
                <input
                  type="number"
                  value={formData.targetRefId || ''}
                  onChange={(e) => handleInputChange('targetRefId', e.target.value)}
                  disabled={formData.targetType === 'GLOBAL'}
                  className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                  placeholder={formData.targetType === 'GLOBAL' ? 'Not applicable' : 'Enter ID'}
                  min="1"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label 
                className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
                style={{ color: colors.textSecondary }}
              >
                <MapPin size={14} />
                Location <span style={{ color: colors.error }}>*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.mainBg,
                  color: colors.textPrimary
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                }}
                placeholder="e.g., Swiss Alps, Geneva"
              />
            </div>

            {/* Expiry Date and Available Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  <Calendar size={14} />
                  Expires At
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                  className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                />
              </div>

              <div>
                <label 
                  className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  <Clock size={14} />
                  Available Hours
                </label>
                <input
                  type="text"
                  value={formData.availableHours}
                  onChange={(e) => handleInputChange('availableHours', e.target.value)}
                  className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                  placeholder="e.g., 9 AM - 6 PM"
                />
              </div>
            </div>

            {/* Legacy Fields */}
            <div className="border rounded-lg p-4" style={{ borderColor: colors.border }}>
              <h4 
                className="text-sm font-medium mb-3"
                style={{ color: colors.textSecondary }}
              >
                Additional Settings (Optional)
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Badge Type ID
                  </label>
                  <input
                    type="number"
                    value={formData.badgeTypeId}
                    onChange={(e) => handleInputChange('badgeTypeId', e.target.value)}
                    className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.mainBg,
                      color: colors.textPrimary
                    }}
                    placeholder="1"
                    min="1"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Image Media ID
                  </label>
                  <input
                    type="number"
                    value={formData.imageMediaId || ''}
                    onChange={(e) => handleInputChange('imageMediaId', e.target.value)}
                    className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.mainBg,
                      color: colors.textPrimary
                    }}
                    placeholder="Optional"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="activeStatus"
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: colors.primary }}
              />
              <label
                htmlFor="activeStatus"
                className="text-xs font-medium cursor-pointer"
                style={{ color: colors.textSecondary }}
              >
                Set as Active
              </label>
            </div>
          </div>

          {/* Right Column - Image Section */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4 h-full" style={{ borderColor: colors.border }}>
              <h4 
                className="text-sm font-semibold mb-3 flex items-center gap-2"
                style={{ color: colors.textPrimary }}
              >
                <ImageIcon size={16} />
                Offer Image <span style={{ color: colors.error }}>*</span>
              </h4>

              {/* Upload Method Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  className="flex-1 px-3 py-2 rounded text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: uploadMethod === 'url' ? colors.primary : 'transparent',
                    color: uploadMethod === 'url' ? '#ffffff' : colors.textSecondary,
                    border: `1px solid ${uploadMethod === 'url' ? colors.primary : colors.border}`
                  }}
                >
                  <LinkIcon size={14} className="inline mr-1" />
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('upload')}
                  className="flex-1 px-3 py-2 rounded text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: uploadMethod === 'upload' ? colors.primary : 'transparent',
                    color: uploadMethod === 'upload' ? '#ffffff' : colors.textSecondary,
                    border: `1px solid ${uploadMethod === 'upload' ? colors.primary : colors.border}`
                  }}
                >
                  <Upload size={14} className="inline mr-1" />
                  Upload File
                </button>
              </div>

              <div className="space-y-3">
                {uploadMethod === 'url' ? (
                  /* URL Input */
                  <div>
                    <label 
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: colors.textSecondary }}
                    >
                      Image URL <span style={{ color: colors.error }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.image.src}
                      onChange={(e) => handleImageChange('src', e.target.value)}
                      className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors"
                      style={{ 
                        borderColor: colors.border,
                        backgroundColor: colors.mainBg,
                        color: colors.textPrimary
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.border;
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                ) : (
                  /* File Upload */
                  <div>
                    <label 
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: colors.textSecondary }}
                    >
                      Upload Image <span style={{ color: colors.error }}>*</span>
                    </label>
                    <div
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
                      style={{ 
                        borderColor: colors.border,
                        backgroundColor: colors.mainBg
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = colors.border;
                      }}
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {selectedFile ? (
                        <div className="space-y-2">
                          <FileText size={32} className="mx-auto" style={{ color: colors.primary }} />
                          <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                            {selectedFile.name}
                          </p>
                          <p className="text-xs" style={{ color: colors.textSecondary }}>
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage();
                            }}
                            className="text-xs px-3 py-1 rounded transition-colors"
                            style={{
                              color: colors.error,
                              backgroundColor: 'transparent',
                              border: `1px solid ${colors.error}`
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload size={32} className="mx-auto" style={{ color: colors.textSecondary }} />
                          <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs" style={{ color: colors.textSecondary }}>
                            PNG, JPG, WEBP up to 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Image Metadata */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label 
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: colors.textSecondary }}
                    >
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={formData.image.alt}
                      onChange={(e) => handleImageChange('alt', e.target.value)}
                      className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors"
                      style={{ 
                        borderColor: colors.border,
                        backgroundColor: colors.mainBg,
                        color: colors.textPrimary
                      }}
                      placeholder="Description"
                    />
                  </div>

                  <div>
                    <label 
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: colors.textSecondary }}
                    >
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={formData.image.width}
                      onChange={(e) => handleImageChange('width', e.target.value)}
                      className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors"
                      style={{ 
                        borderColor: colors.border,
                        backgroundColor: colors.mainBg,
                        color: colors.textPrimary
                      }}
                      placeholder="800"
                      min="1"
                    />
                  </div>

                  <div>
                    <label 
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: colors.textSecondary }}
                    >
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={formData.image.height}
                      onChange={(e) => handleImageChange('height', e.target.value)}
                      className="w-full px-3 py-2 rounded border text-sm outline-none transition-colors"
                      style={{ 
                        borderColor: colors.border,
                        backgroundColor: colors.mainBg,
                        color: colors.textPrimary
                      }}
                      placeholder="600"
                      min="1"
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4">
                    <label 
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: colors.textSecondary }}
                    >
                      Preview
                    </label>
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Offer preview"
                        className="w-full h-64 object-cover rounded-lg border"
                        style={{ borderColor: colors.border }}
                        onError={() => {
                          setImagePreview(null);
                          toast.error('Failed to load image');
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-3 mt-6 pt-4 border-t" style={{ borderColor: colors.border }}>
          <button
            onClick={() => onClose(false)}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded border text-sm font-medium transition-colors"
            style={{ 
              borderColor: colors.border,
              color: colors.textPrimary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = colors.border;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: colors.primary,
              color: '#ffffff'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = colors.primaryHover;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = colors.primary;
              }
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{editingOffer ? 'Update Offer' : 'Create Offer'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateOfferModal;