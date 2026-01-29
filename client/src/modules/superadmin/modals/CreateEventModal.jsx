import React, { useState, useEffect } from 'react';
import { colors } from "@/lib/colors/colors";
import { X, Upload, Loader2, MapPin, Tag, Link as LinkIcon, FileText, Calendar as CalendarIcon, Building2, Globe, Image as ImageIcon } from 'lucide-react';
import { createEventUpdated, updateEventById, getAllLocations, getPropertyTypes, uploadMedia } from '@/Api/Api';
import { toast } from 'react-hot-toast';

function CreateEventModal({ isOpen, onClose, editingEvent }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    locationId: '',
    propertyTypeId: '', 
    eventDate: '',
    description: '',
    status: 'ACTIVE',
    ctaText: '',
    ctaLink: '',
    active: true
  });

  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('upload');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedMediaId, setUploadedMediaId] = useState(null);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  useEffect(() => {
    if (isOpen) {
      fetchLocations();
      fetchPropertyTypes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || '',
        slug: editingEvent.slug || '',
        locationId: editingEvent.locationId || '',
        propertyTypeId: editingEvent.propertyTypeId || '',
        eventDate: editingEvent.eventDate || '',
        description: editingEvent.description || '',
        status: editingEvent.status || 'ACTIVE',
        ctaText: editingEvent.ctaText || '',
        ctaLink: editingEvent.ctaLink || '',
        active: editingEvent.active ?? true
      });
      
      // Handle existing image
      if (editingEvent.image?.url) {
        setImagePreview(editingEvent.image.url);
        setImageUrl(editingEvent.image.url);
        setUploadedMediaId(editingEvent.image.mediaId);
        setUploadMethod('url');
      }
    } else {
      resetForm();
    }
  }, [editingEvent, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '', 
      slug: '', 
      locationId: '', 
      propertyTypeId: '',
      eventDate: '', 
      description: '', 
      status: 'ACTIVE',
      ctaText: '', 
      ctaLink: '', 
      active: true
    });
    setImagePreview(null);
    setSelectedFile(null);
    setImageUrl('');
    setUploadedMediaId(null);
    setUploadMethod('upload');
  };

  const fetchLocations = async () => {
    try {
      const response = await getAllLocations();
      console.log("Locations response:", response);
      
      if (response?.data && Array.isArray(response.data)) {
        const activeLocations = response.data.filter(loc => loc.isActive);
        setLocations(activeLocations);
      }
    } catch (error) {
      console.error('Failed to load locations:', error);
      toast.error('Failed to load locations');
      setLocations([]);
    }
  };

  const fetchPropertyTypes = async () => {
    try {
      const response = await getPropertyTypes();
      console.log("Property types response:", response);
      
      if (response?.data && Array.isArray(response.data)) {
        const activeTypes = response.data.filter(type => type.isActive);
        setPropertyTypes(activeTypes);
      }
    } catch (error) {
      console.error('Failed to load property types:', error);
      toast.error('Failed to load property types');
      setPropertyTypes([]);
    }
  };

  const handleTitleChange = (val) => {
    const trimmedVal = val.slice(0, 200);
    setFormData(prev => ({
      ...prev,
      title: trimmedVal,
      slug: generateSlug(trimmedVal)
    }));
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
      setImagePreview(reader.result);
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
      formDataUpload.append('alt', formData.title || 'Event image');
      formDataUpload.append('width', '800');
      formDataUpload.append('height', '600');

      // Upload media
      const response = await uploadMedia(formDataUpload);
      
      console.log('Upload response:', response);
      
      // Handle different response formats
      let mediaId = null;
      
      if (typeof response === 'number') {
        mediaId = response;
      } else if (typeof response?.data === 'number') {
        mediaId = response.data;
      } else if (typeof response?.data?.data === 'number') {
        mediaId = response.data.data;
      } else if (response?.data?.data?.id) {
        mediaId = response.data.data.id;
      } else if (response?.data?.id) {
        mediaId = response.data.id;
      }

      console.log('Extracted media ID:', mediaId);

      if (mediaId) {
        setUploadedMediaId(mediaId);
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

  const handleUrlChange = (url) => {
    setImageUrl(url);
    if (url.trim()) {
      setImagePreview(url);
      setSelectedFile(null);
      setUploadedMediaId(null);
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    if (!formData.title?.trim()) {
      toast.error('Event title is required');
      return false;
    }
    if (!formData.locationId) {
      toast.error('Location is required');
      return false;
    }
    if (!formData.propertyTypeId) {
      toast.error('Property type is required');
      return false;
    }
    if (!formData.eventDate) {
      toast.error('Event date is required');
      return false;
    }
    if (!formData.description?.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!formData.ctaText?.trim()) {
      toast.error('CTA text is required');
      return false;
    }
    if (!formData.ctaLink?.trim()) {
      toast.error('CTA link is required');
      return false;
    }
    
    // Validate image - must have either uploadedMediaId or imageUrl
    if (!uploadedMediaId && !imageUrl) {
      toast.error('Event image is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Create FormData
      const formDataToSend = new FormData();
      
      // Append core fields
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('locationId', parseInt(formData.locationId));
      formDataToSend.append('propertyTypeId', parseInt(formData.propertyTypeId));
      formDataToSend.append('eventDate', formData.eventDate);
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('status', formData.status);
      formDataToSend.append('ctaText', formData.ctaText.trim());
      formDataToSend.append('ctaLink', formData.ctaLink.trim());
      formDataToSend.append('active', formData.active);
      
      // Append image (ONLY ONE of these)
      if (uploadedMediaId) {
        // Priority 1: Use uploaded media ID
        formDataToSend.append('imageMediaId', uploadedMediaId);
      } else if (imageUrl) {
        // Priority 2: External URL
        formDataToSend.append('imageMediaUrl', imageUrl);
      }

      // Log FormData for debugging
      console.log('Submitting FormData:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      if (editingEvent) {
        await updateEventById(editingEvent.id, formDataToSend);
        toast.success('Event updated successfully');
      } else {
        const response = await createEventUpdated(formDataToSend);
        console.log('Create event response:', response);
        toast.success('Event created successfully');
      }
      
      onClose(true);
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to save event';
      toast.error(errorMessage);
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
      <div 
        className="rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl" 
        style={{ backgroundColor: colors.contentBg }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between mb-6 border-b pb-4" 
          style={{ borderColor: colors.border }}
        >
          <div>
            <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h3>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Fill in the event details and upload an image
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={20} style={{ color: colors.textSecondary }} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form Fields */}
          <div className="space-y-5">
            {/* Event Title */}
            <div>
              <label 
                className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                style={{ color: colors.textSecondary }}
              >
                <Tag size={14} /> Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                style={{ 
                  borderColor: colors.border, 
                  backgroundColor: colors.mainBg, 
                  color: colors.textPrimary 
                }}
                placeholder="e.g., Summer Wine Festival"
                maxLength={200}
              />
              
              {/* Slug Preview */}
              <div 
                className="mt-2 flex items-center gap-2 text-[10px] font-mono p-2 rounded bg-gray-50 border border-dashed" 
                style={{ color: colors.textSecondary, borderColor: colors.border }}
              >
                <Globe size={12} /> 
                <span className="truncate">
                  {window.location.origin}/events/{formData.slug || 'slug-preview'}
                </span>
              </div>
            </div>

            {/* Property Type & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  <Building2 size={14} /> Property Type *
                </label>
                <select
                  value={formData.propertyTypeId}
                  onChange={(e) => handleInputChange('propertyTypeId', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: formData.propertyTypeId ? colors.textPrimary : '#9CA3AF'
                  }}
                >
                  <option value="">Select Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.typeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  <MapPin size={14} /> Location *
                </label>
                <select
                  value={formData.locationId}
                  onChange={(e) => handleInputChange('locationId', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: formData.locationId ? colors.textPrimary : '#9CA3AF'
                  }}
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.locationName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Event Date & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  <CalendarIcon size={14} /> Event Date *
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: colors.textPrimary 
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: colors.textPrimary 
                  }}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="COMING_SOON">Coming Soon</option>
                  <option value="SOLD_OUT">Sold Out</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label 
                className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                style={{ color: colors.textSecondary }}
              >
                <FileText size={14} /> Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                placeholder="Describe your event in detail..."
                className="w-full px-4 py-2.5 rounded-lg border outline-none resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                style={{ 
                  borderColor: colors.border, 
                  backgroundColor: colors.mainBg, 
                  color: colors.textPrimary 
                }}
                maxLength={1000}
              />
              <div className="text-right text-[10px] text-gray-400 mt-1">
                {formData.description.length}/1000 characters
              </div>
            </div>

            {/* CTA Text & Link */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  CTA Button Text *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Book Now"
                  value={formData.ctaText}
                  onChange={(e) => handleInputChange('ctaText', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: colors.textPrimary 
                  }}
                  maxLength={30}
                />
              </div>
              
              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  <LinkIcon size={14} /> CTA Link *
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/booking"
                  value={formData.ctaLink}
                  onChange={(e) => handleInputChange('ctaLink', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: colors.textPrimary 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Image Upload */}
          <div className="space-y-5">
            <div 
              className="border rounded-xl p-5 h-full" 
              style={{ borderColor: colors.border, backgroundColor: colors.mainBg }}
            >
              <label 
                className="flex items-center gap-2 text-xs font-semibold uppercase mb-4" 
                style={{ color: colors.textSecondary }}
              >
                <ImageIcon size={14} /> Event Image *
              </label>

              {/* Upload Method Tabs */}
              <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                <button 
                  type="button"
                  onClick={() => setUploadMethod('upload')} 
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                    uploadMethod === 'upload' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'
                  }`}
                >
                  Upload File
                </button>
                <button 
                  type="button"
                  onClick={() => setUploadMethod('url')} 
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                    uploadMethod === 'url' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'
                  }`}
                >
                  Image URL
                </button>
              </div>

              {/* Upload Method Content */}
              {uploadMethod === 'upload' ? (
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all ${uploadingImage ? 'pointer-events-none opacity-60' : ''}`}
                  onClick={() => !uploadingImage && document.getElementById('file-upload')?.click()}
                  style={{ borderColor: colors.border }}
                >
                  <input 
                    id="file-upload" 
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
                      <p className="text-xs font-medium text-gray-600">
                        {selectedFile ? selectedFile.name : 'Click to upload image'}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    style={{ borderColor: colors.border, backgroundColor: 'white' }}
                  />
                  <p className="text-[10px] text-gray-400 mt-2">
                    Enter a direct image URL (must start with http:// or https://)
                  </p>
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-6 relative">
                  <img 
                    src={imagePreview} 
                    className="w-full h-56 object-cover rounded-xl shadow-lg border" 
                    style={{ borderColor: colors.border }} 
                    alt="Event preview" 
                  />
                  {uploadedMediaId && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                      <span>✓</span>
                      <span>ID: {uploadedMediaId}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setSelectedFile(null);
                      setImageUrl('');
                      setUploadedMediaId(null);
                    }}
                    disabled={uploadingImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div 
          className="flex gap-4 mt-8 pt-6 border-t" 
          style={{ borderColor: colors.border }}
        >
          <button 
            type="button"
            onClick={handleClose}
            disabled={loading || uploadingImage}
            className="flex-1 py-3 rounded-lg font-bold text-sm border hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: colors.border, color: colors.textPrimary }}
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit} 
            disabled={loading || uploadingImage || !formData.title || !formData.locationId || !formData.propertyTypeId || (!uploadedMediaId && !imageUrl)}
            className="flex-[2] py-3 rounded-lg font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              editingEvent ? 'Update Event' : 'Publish Event'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateEventModal;