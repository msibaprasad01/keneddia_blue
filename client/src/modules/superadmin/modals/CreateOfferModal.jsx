import React, { useState, useEffect } from 'react';
import { colors } from "@/lib/colors/colors";
import { X, Upload, Loader2, MapPin, Tag, FileText, Calendar, Clock, Image as ImageIcon, Building2, Hotel, AlignLeft } from 'lucide-react';
import { createDailyOffer, updateDailyOfferById, uploadMedia, getMediaById, getAllProperties } from '@/Api/Api';
import { toast } from 'react-hot-toast';

// Add styles for placeholder text
const inputStyles = `
  input::placeholder, textarea::placeholder {
    color: #9CA3AF !important;
    opacity: 1;
  }
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: #9CA3AF !important;
    opacity: 1;
  }
  input::-moz-placeholder, textarea::-moz-placeholder {
    color: #9CA3AF !important;
    opacity: 1;
  }
`;

function CreateOfferModal({ isOpen, onClose, editingOffer }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDesc: '',
    couponCode: '',
    ctaText: 'Claim Offer',
    location: '',
    propertyId: null,
    propertyName: '',
    propertyType: '',
    expiresAt: '',
    availableHours: '',
    imageMediaId: null,
    image: { src: '', alt: '', width: 800, height: 600 },
    isActive: true
  });

  // Properties state
  const [availableProperties, setAvailableProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedMediaId, setUploadedMediaId] = useState(null);

  // Fetch properties when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProperties();
    }
  }, [isOpen]);

  // Handle editing offer data
  useEffect(() => {
    if (editingOffer) {
      // If editing and has imageMediaId, fetch the media details
      if (editingOffer.imageMediaId) {
        fetchMediaDetails(editingOffer.imageMediaId);
      }
      
      // Find the property to get full details
      const selectedProperty = availableProperties.find(p => p.id === editingOffer.propertyId);
      
      setFormData({
        title: editingOffer.title || '',
        description: editingOffer.description || '',
        longDesc: editingOffer.longDesc || '',
        couponCode: editingOffer.couponCode || '',
        ctaText: editingOffer.ctaText || 'Claim Offer',
        location: selectedProperty ? `${selectedProperty.area}, ${selectedProperty.locationName}` : editingOffer.location || '',
        propertyId: editingOffer.propertyId || null,
        propertyName: selectedProperty?.propertyName || editingOffer.propertyName || '',
        propertyType: selectedProperty?.propertyTypes?.join(', ') || editingOffer.propertyType || '',
        expiresAt: editingOffer.expiresAt ? new Date(editingOffer.expiresAt).toISOString().split('T')[0] : '',
        availableHours: editingOffer.availableHours || '',
        imageMediaId: editingOffer.imageMediaId || null,
        image: {
          src: editingOffer.image?.src || '',
          alt: editingOffer.image?.alt || '',
          width: editingOffer.image?.width || 800,
          height: editingOffer.image?.height || 600
        },
        isActive: editingOffer.isActive ?? true
      });
      setUploadedMediaId(editingOffer.imageMediaId || null);
      setImagePreview(editingOffer.image?.src || null);
    } else {
      resetForm();
    }
  }, [editingOffer, isOpen, availableProperties]);

  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);
      const response = await getAllProperties();
      
      // Handle different response structures
      const propertiesData = response.data?.data || response.data || response;
      
      if (Array.isArray(propertiesData)) {
        // Filter only active properties
        const activeProperties = propertiesData.filter(p => p.isActive);
        setAvailableProperties(activeProperties);
        console.log('Properties loaded:', activeProperties.length);
      } else {
        console.warn('Unexpected properties response format:', propertiesData);
        setAvailableProperties([]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
      setAvailableProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  const fetchMediaDetails = async (mediaId) => {
    try {
      const response = await getMediaById(mediaId);
      const mediaData = response.data?.data;
      
      if (mediaData) {
        setImagePreview(mediaData.url);
        setFormData(prev => ({
          ...prev,
          image: {
            src: mediaData.url,
            alt: mediaData.alt || '',
            width: mediaData.width || 800,
            height: mediaData.height || 600
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching media details:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      longDesc: '',
      couponCode: '',
      ctaText: 'Claim Offer',
      location: '',
      propertyId: null,
      propertyName: '',
      propertyType: '',
      expiresAt: '',
      availableHours: '',
      imageMediaId: null,
      image: { src: '', alt: '', width: 800, height: 600 },
      isActive: true
    });
    setImagePreview(null);
    setSelectedFile(null);
    setUploadedMediaId(null);
  };

  const handlePropertySelect = (propertyId) => {
    if (!propertyId) {
      // Reset property-related fields
      setFormData(prev => ({
        ...prev,
        propertyId: null,
        propertyName: '',
        propertyType: '',
        location: ''
      }));
      return;
    }

    const selectedProperty = availableProperties.find(p => p.id === parseInt(propertyId));
    
    if (selectedProperty) {
      // Auto-populate all property-related fields
      setFormData(prev => ({
        ...prev,
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.propertyName,
        propertyType: selectedProperty.propertyTypes?.join(', ') || '',
        location: `${selectedProperty.area || ''}, ${selectedProperty.locationName || ''}`.replace(/^, |, $/g, '')
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      const result = reader.result;
      setImagePreview(result);
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);

    // Upload the image immediately
    await uploadImageFile(file);
  };

  const uploadImageFile = async (file) => {
    try {
      setUploadingImage(true);
      
      // Create FormData for upload
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'IMAGE');
      formDataUpload.append('alt', formData.title || 'Offer image');
      formDataUpload.append('width', '800');
      formDataUpload.append('height', '600');

      // Upload media
      const response = await uploadMedia(formDataUpload);
      
      console.log('Upload response:', response);
      
      // Handle different response formats:
      // 1. Direct number: 11
      // 2. response.data as number: { data: 11 }
      // 3. response.data.data as number: { data: { data: 11 } }
      // 4. response.data.data.id: { data: { data: { id: 11, url: '...' } } }
      // 5. response.data.id: { data: { id: 11, url: '...' } }
      
      let mediaId = null;
      let mediaUrl = null;
      
      // Extract media ID from various response formats
      if (typeof response === 'number') {
        mediaId = response;
      } else if (typeof response?.data === 'number') {
        mediaId = response.data;
      } else if (typeof response?.data?.data === 'number') {
        mediaId = response.data.data;
      } else if (response?.data?.data?.id) {
        mediaId = response.data.data.id;
        mediaUrl = response.data.data.url;
      } else if (response?.data?.id) {
        mediaId = response.data.id;
        mediaUrl = response.data.url;
      }

      console.log('Extracted media ID:', mediaId);

      if (mediaId) {
        setUploadedMediaId(mediaId);
        setFormData(prev => ({
          ...prev,
          imageMediaId: mediaId,
          image: {
            src: mediaUrl || prev.image.src,
            alt: formData.title || 'Offer image',
            width: 800,
            height: 600
          }
        }));
        toast.success(`Image uploaded successfully (ID: ${mediaId})`);
      } else {
        console.error('Could not extract media ID from response:', response);
        throw new Error('Invalid response from upload');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error?.response?.data?.message || 'Failed to upload image');
      // Clear the preview if upload failed
      setImagePreview(null);
      setSelectedFile(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setUploadedMediaId(null);
    setFormData(prev => ({
      ...prev,
      imageMediaId: null,
      image: { src: '', alt: '', width: 800, height: 600 }
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title?.trim()) {
      toast.error('Please enter offer title');
      return;
    }
    if (!formData.propertyId) {
      toast.error('Please select a property');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare payload matching API format
      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        longDesc: formData.longDesc?.trim() || '',
        couponCode: formData.couponCode?.trim() || '',
        ctaText: formData.ctaText?.trim() || 'Claim Offer',
        availableHours: formData.availableHours?.trim() || '',
        propertyId: formData.propertyId,
        imageMediaId: uploadedMediaId || formData.imageMediaId || null,
        expiresAt: formData.expiresAt || null,
        isActive: formData.isActive
      };

      console.log('Submitting offer payload:', payload);

      if (editingOffer) {
        await updateDailyOfferById(editingOffer.id, payload);
        toast.success('Offer updated successfully');
      } else {
        await createDailyOffer(payload);
        toast.success('Offer created successfully');
      }
      
      onClose(true);
      resetForm();
    } catch (error) {
      console.error('Error saving offer:', error);
      toast.error(error?.response?.data?.message || 'Failed to save offer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style>{inputStyles}</style>
      <div 
        className="rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: colors.contentBg }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between mb-6 border-b pb-4"
          style={{ borderColor: colors.border }}
        >
          <h3 
            className="text-xl font-bold"
            style={{ color: colors.textPrimary }}
          >
            {editingOffer ? 'Edit Offer' : 'Assign Offer to Property'}
          </h3>
          <button
            onClick={handleClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form Fields */}
          <div className="space-y-5">
            {/* Property Assignment Section */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-4">
              <label 
                className="flex items-center gap-2 text-xs font-bold uppercase"
                style={{ color: colors.primary }}
              >
                <Hotel size={14} /> Assign to Property
              </label>
              
              <div className="relative">
                <select
                  value={formData.propertyId || ''}
                  onChange={(e) => handlePropertySelect(e.target.value)}
                  disabled={loadingProperties}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none font-medium focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  style={{ 
                    borderColor: colors.primary,
                    backgroundColor: '#F3F4F6',
                    color: formData.propertyId ? '#000000' : '#6B7280'
                  }}
                >
                  <option value="">
                    {loadingProperties ? 'Loading properties...' : 'Choose Property...'}
                  </option>
                  {availableProperties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.propertyName} - {p.locationName} ({p.propertyTypes?.join(', ') || 'N/A'})
                    </option>
                  ))}
                </select>
                {loadingProperties && (
                  <Loader2 size={16} className="absolute right-10 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
                )}
              </div>

              {/* Auto-populated Property Details */}
              {formData.propertyId && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Property Type
                    </label>
                    <div 
                      className="mt-1 px-3 py-2 rounded border text-sm font-bold"
                      style={{ 
                        backgroundColor: '#E8F5E9',
                        borderColor: '#81C784',
                        color: '#2E7D32'
                      }}
                    >
                      {formData.propertyType || 'N/A'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Location
                    </label>
                    <div 
                      className="mt-1 px-3 py-2 rounded border text-sm font-bold flex items-center gap-1"
                      style={{ 
                        backgroundColor: '#E3F2FD',
                        borderColor: '#64B5F6',
                        color: '#1565C0'
                      }}
                    >
                      <MapPin size={12} />
                      {formData.location || 'N/A'}
                    </div>
                  </div>
                </div>
              )}

              {/* Show selected property full details */}
              {formData.propertyId && (
                <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                  <span className="font-semibold">Selected: </span>
                  {formData.propertyName}
                  {(() => {
                    const prop = availableProperties.find(p => p.id === formData.propertyId);
                    if (prop) {
                      return (
                        <>
                          {prop.address && ` • ${prop.address}`}
                          {prop.pincode && ` - ${prop.pincode}`}
                          {prop.parentPropertyName && (
                            <span className="text-primary"> (Part of {prop.parentPropertyName})</span>
                          )}
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>

            {/* Offer Title */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2 text-gray-500">
                <FileText size={12} /> Offer Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="e.g., Anniversary Special 30% Off"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: '#F3F4F6',
                  color: '#000000'
                }}
              />
            </div>

            {/* Coupon Code & Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2 text-gray-500">
                  <Tag size={12} /> Coupon Code
                </label>
                <input
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) => handleInputChange('couponCode', e.target.value.toUpperCase())}
                  placeholder="e.g., SAVE30"
                  className="w-full px-4 py-2.5 rounded-lg border uppercase font-mono outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: '#F3F4F6',
                    color: '#000000'
                  }}
                  maxLength={20}
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2 text-gray-500">
                  <Clock size={12} /> Available Hours
                </label>
                <input
                  type="text"
                  value={formData.availableHours}
                  onChange={(e) => handleInputChange('availableHours', e.target.value)}
                  placeholder="e.g., 24/7 or 9AM-5PM"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: '#F3F4F6',
                    color: '#000000'
                  }}
                />
              </div>
            </div>

            {/* Short Description (max 50 chars) */}
            <div>
              <label className="flex items-center justify-between gap-2 text-xs font-semibold uppercase mb-2 text-gray-500">
                <span className="flex items-center gap-2">
                  <FileText size={12} /> Short Description
                </span>
                <span className={`text-[10px] font-mono ${formData.description.length > 50 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                  {formData.description.length}/50
                </span>
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief tagline (max 50 characters)"
                className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                style={{ 
                  borderColor: formData.description.length > 50 ? '#EF4444' : colors.border,
                  backgroundColor: '#F3F4F6',
                  color: '#000000'
                }}
                maxLength={50}
              />
              {formData.description.length > 50 && (
                <p className="text-xs text-red-500 mt-1">
                  Description must be 50 characters or less
                </p>
              )}
            </div>

            {/* Long Description */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2 text-gray-500">
                <AlignLeft size={12} /> Detailed Description
              </label>
              <textarea
                value={formData.longDesc}
                onChange={(e) => handleInputChange('longDesc', e.target.value)}
                rows={4}
                placeholder="Enter full offer details, terms & conditions..."
                className="w-full px-4 py-2.5 rounded-lg border resize-none outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: '#F3F4F6',
                  color: '#000000'
                }}
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-gray-400">
                  Full description with all terms and conditions
                </p>
                <span className="text-[10px] font-mono text-gray-400">
                  {formData.longDesc.length}/1000
                </span>
              </div>
            </div>

            {/* Expiry Date & CTA Text */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2 text-gray-500">
                  <Calendar size={12} /> Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: '#F3F4F6',
                    color: '#000000'
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2 text-gray-500">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => handleInputChange('ctaText', e.target.value)}
                  placeholder="e.g., Claim Offer"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: '#F3F4F6',
                    color: '#000000'
                  }}
                  maxLength={30}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Image Upload */}
          <div className="space-y-5">
            <div className="border rounded-xl p-5 bg-gray-50">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-4 text-gray-500">
                <ImageIcon size={14} /> Offer Visuals
              </label>
              
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer bg-white hover:bg-gray-50 hover:border-primary/50 transition-all ${uploadingImage ? 'pointer-events-none opacity-60' : ''}`}
                onClick={() => !uploadingImage && document.getElementById('offer-assign-img')?.click()}
                style={{ borderColor: colors.border }}
              >
                <input
                  id="offer-assign-img"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploadingImage}
                />
                {uploadingImage ? (
                  <>
                    <Loader2 size={30} className="mx-auto mb-2 animate-spin text-primary" />
                    <p className="text-xs text-gray-500 mb-1">
                      Uploading image...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload size={30} className="mx-auto mb-2 opacity-20" />
                    <p className="text-xs text-gray-400 mb-1">
                      Click to upload property-specific offer image
                    </p>
                    <p className="text-[10px] text-gray-300">
                      PNG, JPG up to 5MB
                    </p>
                  </>
                )}
              </div>
              
              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview}
                    className="w-full h-48 object-cover rounded-xl shadow-md"
                    alt="Preview"
                  />
                  {uploadedMediaId && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                      <span>✓</span>
                      <span>ID: {uploadedMediaId}</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    disabled={uploadingImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Status Toggle */}
            <div className="border rounded-xl p-5 bg-gray-50">
              <label className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Offer Status
                </span>
                <div className="flex items-center gap-3">
                  <span 
                    className="text-sm font-medium"
                    style={{ color: formData.isActive ? '#10B981' : '#EF4444' }}
                  >
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('isActive', !formData.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div 
          className="flex gap-4 mt-8 pt-6 border-t"
          style={{ borderColor: colors.border }}
        >
          <button
            onClick={handleClose}
            disabled={loading || uploadingImage}
            className="flex-1 py-3 rounded-lg font-bold text-sm border hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: colors.border, color: colors.textPrimary }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || uploadingImage || !formData.title?.trim() || !formData.propertyId || formData.description.length > 50}
            className="flex-[2] py-3 rounded-lg font-bold text-sm text-white bg-primary flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: colors.primary }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Saving...
              </>
            ) : uploadingImage ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Uploading Image...
              </>
            ) : (
              editingOffer ? 'Update Offer' : 'Save Offer'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateOfferModal;