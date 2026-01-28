import React, { useState, useEffect } from 'react';
import { colors } from "@/lib/colors/colors";
import { X, Upload, Loader2, MapPin, Tag, FileText, Calendar, Clock, Image as ImageIcon, Building2, Hotel } from 'lucide-react';
import { createDailyOffer, updateDailyOfferById } from '@/Api/Api';
import { toast } from 'react-hot-toast';

function CreateOfferModal({ isOpen, onClose, editingOffer }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    couponCode: '',
    ctaText: 'Claim Offer',
    location: '',
    propertyType: '',
    propertyName: '',
    expiresAt: '',
    availableHours: '',
    image: { src: '', alt: '', width: 800, height: 600 },
    active: true
  });

  // Mock list of properties - replace with actual API call
  const availableProperties = [
    { id: 1, name: 'Kennedia Grand Hotel', type: 'HOTEL' },
    { id: 2, name: 'Blue Lagoon Cafe', type: 'CAFE' },
    { id: 3, name: 'The Steakhouse Grill', type: 'RESTAURANT' },
    { id: 4, name: 'Alpine Resort & Spa', type: 'HOTEL' }
  ];

  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (editingOffer) {
      setFormData({
        title: editingOffer.title || '',
        description: editingOffer.description || '',
        couponCode: editingOffer.couponCode || '',
        ctaText: editingOffer.ctaText || 'Claim Offer',
        location: editingOffer.location || '',
        propertyType: editingOffer.propertyType || '',
        propertyName: editingOffer.propertyName || '',
        expiresAt: editingOffer.expiresAt ? new Date(editingOffer.expiresAt).toISOString().split('T')[0] : '',
        availableHours: editingOffer.availableHours || '',
        image: {
          src: editingOffer.image?.src || '',
          alt: editingOffer.image?.alt || '',
          width: editingOffer.image?.width || 800,
          height: editingOffer.image?.height || 600
        },
        active: editingOffer.active ?? true
      });
      setImagePreview(editingOffer.image?.src || null);
    } else {
      resetForm();
    }
  }, [editingOffer, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      couponCode: '',
      ctaText: 'Claim Offer',
      location: '',
      propertyType: '',
      propertyName: '',
      expiresAt: '',
      availableHours: '',
      image: { src: '', alt: '', width: 800, height: 600 },
      active: true
    });
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-set property type if property name is selected
      if (field === 'propertyName') {
        const selected = availableProperties.find(p => p.name === value);
        if (selected) {
          updated.propertyType = selected.type;
        } else {
          updated.propertyType = '';
        }
      }
      return updated;
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
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
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          image: {
            ...prev.image,
            src: result,
            alt: formData.title || 'Offer image'
          }
        }));
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title?.trim()) {
      toast.error('Please enter offer title');
      return;
    }
    if (!formData.propertyName) {
      toast.error('Please select a property');
      return;
    }

    try {
      setLoading(true);
      
      if (editingOffer) {
        await updateDailyOfferById(editingOffer.id, formData);
        toast.success('Offer updated successfully');
      } else {
        await createDailyOffer(formData);
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
              
              <select
                value={formData.propertyName}
                onChange={(e) => handleInputChange('propertyName', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border outline-none bg-white font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                style={{ 
                  borderColor: colors.primary,
                  color: formData.propertyName ? colors.textPrimary : '#9CA3AF'
                }}
              >
                <option value="">Choose Property...</option>
                {availableProperties.map(p => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.type})
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Auto-detected Type
                  </label>
                  <div 
                    className="mt-1 px-3 py-2 bg-gray-100 rounded border text-sm font-bold"
                    style={{ color: formData.propertyType ? colors.textPrimary : '#9CA3AF' }}
                  >
                    {formData.propertyType || 'None'}
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Location Display
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g. City Center"
                    className="mt-1 w-full px-3 py-2 rounded border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    style={{ borderColor: colors.border }}
                  />
                </div>
              </div>
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
                style={{ borderColor: colors.border }}
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
                  style={{ borderColor: colors.border }}
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
                  style={{ borderColor: colors.border }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2 text-gray-500">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                placeholder="Enter offer details and terms..."
                className="w-full px-4 py-2.5 rounded-lg border resize-none outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                style={{ borderColor: colors.border }}
                maxLength={500}
              />
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
                  style={{ borderColor: colors.border }}
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
                  style={{ borderColor: colors.border }}
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
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer bg-white hover:bg-gray-50 hover:border-primary/50 transition-all"
                onClick={() => document.getElementById('offer-assign-img')?.click()}
                style={{ borderColor: colors.border }}
              >
                <input
                  id="offer-assign-img"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <Upload size={30} className="mx-auto mb-2 opacity-20" />
                <p className="text-xs text-gray-400 mb-1">
                  Click to upload property-specific offer image
                </p>
                <p className="text-[10px] text-gray-300">
                  PNG, JPG up to 5MB
                </p>
              </div>
              
              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview}
                    className="w-full h-48 object-cover rounded-xl shadow-md"
                    alt="Preview"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setSelectedFile(null);
                      setFormData(prev => ({
                        ...prev,
                        image: { ...prev.image, src: '' }
                      }));
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
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
                    style={{ color: formData.active ? '#10B981' : '#EF4444' }}
                  >
                    {formData.active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('active', !formData.active)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.active ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.active ? 'translate-x-6' : 'translate-x-1'
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
            disabled={loading}
            className="flex-1 py-3 rounded-lg font-bold text-sm border hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: colors.border, color: colors.textPrimary }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.title?.trim() || !formData.propertyName}
            className="flex-[2] py-3 rounded-lg font-bold text-sm text-white bg-primary flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: colors.primary }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Saving...
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