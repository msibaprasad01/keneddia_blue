import React, { useState, useEffect } from 'react';
import { colors } from "@/lib/colors/colors";
import { X, Upload, Loader2, MapPin, Tag, Link as LinkIcon, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { createEvent, updateEventById, getAllLocations } from '@/Api/Api';
import { toast } from 'react-hot-toast';

function CreateEventModal({ isOpen, onClose, editingEvent }) {
  const [formData, setFormData] = useState({
    title: '',
    locationId: '',
    eventDate: '',
    description: '',
    status: 'ACTIVE',
    ctaText: '',
    ctaLink: '',
    imageMediaId: null,
    active: true
  });

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  // Fetch locations on mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || '',
        locationId: editingEvent.location?.id || '',
        eventDate: editingEvent.eventDate || '',
        description: editingEvent.description || '',
        status: editingEvent.status || 'ACTIVE',
        ctaText: editingEvent.ctaText || '',
        ctaLink: editingEvent.ctaLink || '',
        imageMediaId: editingEvent.imageMediaId || null,
        active: editingEvent.active ?? true
      });
      setImagePreview(editingEvent.imageMediaUrl || null);
      setImageUrl(editingEvent.imageMediaUrl || '');
    } else {
      // Reset form for new event
      setFormData({
        title: '',
        locationId: '',
        eventDate: '',
        description: '',
        status: 'ACTIVE',
        ctaText: '',
        ctaLink: '',
        imageMediaId: null,
        active: true
      });
      setImagePreview(null);
      setSelectedFile(null);
      setImageUrl('');
    }
  }, [editingEvent]);

  const fetchLocations = async () => {
    try {
      const response = await getAllLocations();
      if (response.data.success) {
        setLocations(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to fetch locations');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setImageUrl('');
  };

  const handleUrlChange = (url) => {
    setImageUrl(url);
    setImagePreview(url);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Event title is required');
      return false;
    }
    if (!formData.locationId) {
      toast.error('Location is required');
      return false;
    }
    if (!formData.eventDate) {
      toast.error('Event date is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!formData.ctaText.trim()) {
      toast.error('CTA text is required');
      return false;
    }
    if (!formData.ctaLink.trim()) {
      toast.error('CTA link is required');
      return false;
    }
    if (uploadMethod === 'url' && !imageUrl.trim()) {
      toast.error('Image URL is required');
      return false;
    }
    if (uploadMethod === 'upload' && !selectedFile && !editingEvent) {
      toast.error('Please select an image');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Prepare payload
      const payload = {
        title: formData.title,
        locationId: parseInt(formData.locationId),
        eventDate: formData.eventDate,
        description: formData.description,
        status: formData.status,
        ctaText: formData.ctaText,
        ctaLink: formData.ctaLink,
        imageMediaId: formData.imageMediaId ? parseInt(formData.imageMediaId) : null,
        active: formData.active
      };

      // If using URL method, add image URL to payload
      if (uploadMethod === 'url' && imageUrl) {
        payload.imageUrl = imageUrl;
      }

      // If using file upload, you might need to upload the file first
      if (uploadMethod === 'upload' && selectedFile) {
        // TODO: Implement file upload to get imageMediaId
        // const uploadResponse = await uploadImage(selectedFile);
        // payload.imageMediaId = uploadResponse.data.id;
        toast.info('File upload not yet implemented. Please use URL method.');
        setLoading(false);
        return;
      }

      let response;
      if (editingEvent) {
        response = await updateEventById(editingEvent.id, payload);
        toast.success('Event updated successfully');
      } else {
        response = await createEvent(payload);
        toast.success('Event created successfully');
      }

      console.log('Response:', response.data);
      onClose(true); // Pass true to indicate refresh needed
      
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
            {editingEvent ? 'Edit Event' : 'Create New Event'}
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
            {/* Event Title */}
            <div>
              <label 
                className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
                style={{ color: colors.textSecondary }}
              >
                <Tag size={14} />
                Event Title <span style={{ color: colors.error }}>*</span>
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
                placeholder="Jazz Night Under the Stars"
              />
            </div>

            {/* Location and Event Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  <MapPin size={14} />
                  Location <span style={{ color: colors.error }}>*</span>
                </label>
                <select
                  value={formData.locationId}
                  onChange={(e) => handleInputChange('locationId', e.target.value)}
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
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label 
                  className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  <CalendarIcon size={14} />
                  Event Date <span style={{ color: colors.error }}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
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
                placeholder="An evening of smooth jazz and signature cocktails..."
              />
            </div>

            {/* Status */}
            <div>
              <label 
                className="block text-xs font-medium mb-1.5"
                style={{ color: colors.textSecondary }}
              >
                Status <span style={{ color: colors.error }}>*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
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
                <option value="ACTIVE">Active</option>
                <option value="COMING_SOON">Coming Soon</option>
                <option value="SOLD_OUT">Sold Out</option>
              </select>
            </div>

            {/* CTA Text and Link */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  CTA Text <span style={{ color: colors.error }}>*</span>
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
                  placeholder="Details →"
                />
              </div>

              <div>
                <label 
                  className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  <LinkIcon size={14} />
                  CTA Link <span style={{ color: colors.error }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.ctaLink}
                  onChange={(e) => handleInputChange('ctaLink', e.target.value)}
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
                  placeholder="https://www.example.com"
                />
              </div>
            </div>

            {/* Image Media ID (Optional) */}
            <div>
              <label 
                className="block text-xs font-medium mb-1.5"
                style={{ color: colors.textSecondary }}
              >
                Image Media ID (Optional)
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
                placeholder="Enter media ID"
                min="1"
              />
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
                <Upload size={16} />
                Event Image
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
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
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
                      Upload Image
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
                      onClick={() => document.getElementById('eventFileInput').click()}
                    >
                      <input
                        id="eventFileInput"
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
                        alt="Event preview"
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
              <span>{editingEvent ? 'Update Event' : 'Create Event'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateEventModal;