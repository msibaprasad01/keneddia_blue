import React, { useState, useEffect } from 'react';
import { colors } from "@/lib/colors/colors";
import { 
  X, Upload, Loader2, Tag, FileText, Calendar, 
  Clock, User, Hash, Globe, Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { createNews, updateNewsById, uploadMedia, getPropertyTypes } from '@/Api/Api';
import { toast } from 'react-hot-toast';

function CreateNewsModal({ isOpen, onClose, editingNews }) {
  const [formData, setFormData] = useState({
    category: 'PRESS',
    title: '',
    slug: '',
    description: '',
    longDesc: '',
    dateBadge: '',
    badgeTypeId: '',
    ctaText: 'Read Story',
    ctaLink: '',
    authorName: '',
    authorDescription: '',
    readTime: '',
    tags: '',
    newsDate: '',
    active: true
  });

  const [badgeTypes, setBadgeTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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
      fetchBadgeTypes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingNews) {
      setFormData({
        category: editingNews.category || 'PRESS',
        title: editingNews.title || '',
        slug: editingNews.slug || '',
        description: editingNews.description || '',
        longDesc: editingNews.longDesc || '',
        dateBadge: editingNews.dateBadge || '',
        badgeTypeId: editingNews.badgeTypeId || '',
        ctaText: editingNews.ctaText || 'Read Story',
        ctaLink: editingNews.ctaLink || '',
        authorName: editingNews.authorName || '',
        authorDescription: editingNews.authorDescription || '',
        readTime: editingNews.readTime || '',
        tags: editingNews.tags || '',
        newsDate: editingNews.newsDate || '',
        active: editingNews.active ?? true
      });
      
      if (editingNews.imageMediaId) {
        setUploadedMediaId(editingNews.imageMediaId);
        setImagePreview(editingNews.image || null);
      }
    } else {
      resetForm();
    }
  }, [editingNews, isOpen]);

  const resetForm = () => {
    setFormData({
      category: 'PRESS',
      title: '',
      slug: '',
      description: '',
      longDesc: '',
      dateBadge: '',
      badgeTypeId: '',
      ctaText: 'Read Story',
      ctaLink: '',
      authorName: '',
      authorDescription: '',
      readTime: '',
      tags: '',
      newsDate: '',
      active: true
    });
    setImagePreview(null);
    setSelectedFile(null);
    setUploadedMediaId(null);
  };

  const fetchBadgeTypes = async () => {
    try {
      const response = await getPropertyTypes();
      console.log("Badge types response:", response);
      
      if (response?.data && Array.isArray(response.data)) {
        const activeTypes = response.data.filter(type => type.isActive);
        setBadgeTypes(activeTypes);
      }
    } catch (error) {
      console.error('Failed to load badge types:', error);
      toast.error('Failed to load badge types');
      setBadgeTypes([]);
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
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);

    await uploadImageFile(file);
  };

  const uploadImageFile = async (file) => {
    try {
      setUploadingImage(true);
      
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'IMAGE');
      formDataUpload.append('alt', formData.title || 'News image');
      formDataUpload.append('width', '800');
      formDataUpload.append('height', '600');

      const response = await uploadMedia(formDataUpload);
      
      console.log('Upload response:', response);
      
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
  };

  const validateForm = () => {
    if (!formData.title?.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.description?.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!formData.badgeTypeId) {
      toast.error('Badge type is required');
      return false;
    }
    if (!formData.newsDate) {
      toast.error('News date is required');
      return false;
    }
    if (!uploadedMediaId) {
      toast.error('News image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const payload = {
        category: formData.category,
        title: formData.title.trim(),
        slug: formData.slug,
        description: formData.description.trim(),
        longDesc: formData.longDesc?.trim() || '',
        dateBadge: formData.dateBadge || formData.newsDate,
        badgeTypeId: parseInt(formData.badgeTypeId),
        ctaText: formData.ctaText?.trim() || 'Read Story',
        // ctaLink: formData.ctaLink?.trim() || '',
        authorName: formData.authorName?.trim() || '',
        authorDescription: formData.authorDescription?.trim() || '',
        readTime: formData.readTime?.trim() || '',
        tags: formData.tags?.trim() || '',
        newsDate: formData.newsDate,
        imageMediaId: uploadedMediaId,
        active: formData.active
      };

      console.log('Submitting news payload:', payload);

      if (editingNews) {
        await updateNewsById(editingNews.id, payload);
        toast.success('News updated successfully');
      } else {
        await createNews(payload);
        toast.success('News created successfully');
      }
      
      onClose(true);
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to save news';
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
              {editingNews ? 'Edit News' : 'Create News Article'}
            </h3>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Fill in the news details and upload an image
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
            {/* Category & Badge Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  <Tag size={14} /> Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: colors.textPrimary 
                  }}
                >
                  <option value="PRESS">PRESS</option>
                  <option value="NEWS">NEWS</option>
                  <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                </select>
              </div>

              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  Badge Type *
                </label>
                <select
                  value={formData.badgeTypeId}
                  onChange={(e) => handleInputChange('badgeTypeId', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: formData.badgeTypeId ? colors.textPrimary : '#9CA3AF'
                  }}
                >
                  <option value="">Select Badge</option>
                  {badgeTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.typeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label 
                className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                style={{ color: colors.textSecondary }}
              >
                <FileText size={14} /> News Title *
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
                placeholder="e.g., Expansion Plans for 2026"
                maxLength={200}
              />
              
              {/* Slug Preview */}
              <div 
                className="mt-2 flex items-center gap-2 text-[10px] font-mono p-2 rounded bg-gray-50 border border-dashed" 
                style={{ color: colors.textSecondary, borderColor: colors.border }}
              >
                <Globe size={12} /> 
                <span className="truncate">
                  {window.location.origin}/news/{formData.slug || 'slug-preview'}
                </span>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label 
                className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                style={{ color: colors.textSecondary }}
              >
                Short Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                placeholder="Brief description for card preview..."
                className="w-full px-4 py-2.5 rounded-lg border outline-none resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                style={{ 
                  borderColor: colors.border, 
                  backgroundColor: colors.mainBg, 
                  color: colors.textPrimary 
                }}
                maxLength={200}
              />
              <div className="text-right text-[10px] text-gray-400 mt-1">
                {formData.description.length}/200 characters
              </div>
            </div>

            {/* Long Description */}
            <div>
              <label 
                className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                style={{ color: colors.textSecondary }}
              >
                Full Article Content
              </label>
              <textarea
                value={formData.longDesc}
                onChange={(e) => handleInputChange('longDesc', e.target.value)}
                rows={5}
                placeholder="Full article content goes here..."
                className="w-full px-4 py-2.5 rounded-lg border outline-none resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                style={{ 
                  borderColor: colors.border, 
                  backgroundColor: colors.mainBg, 
                  color: colors.textPrimary 
                }}
                maxLength={5000}
              />
              <div className="text-right text-[10px] text-gray-400 mt-1">
                {formData.longDesc.length}/5000 characters
              </div>
            </div>

            {/* Author Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  <User size={14} /> Author Name
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => handleInputChange('authorName', e.target.value)}
                  placeholder="e.g., Madhurima Sit"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: colors.textPrimary 
                  }}
                  maxLength={100}
                />
              </div>

              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  <Clock size={14} /> Read Time
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => handleInputChange('readTime', e.target.value)}
                  placeholder="e.g., 5 mins read"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: colors.textPrimary 
                  }}
                  maxLength={50}
                />
              </div>
            </div>

            {/* Author Description */}
            <div>
              <label 
                className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                style={{ color: colors.textSecondary }}
              >
                Author Bio
              </label>
              <input
                type="text"
                value={formData.authorDescription}
                onChange={(e) => handleInputChange('authorDescription', e.target.value)}
                placeholder="e.g., A good author"
                className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                style={{ 
                  borderColor: colors.border, 
                  backgroundColor: colors.mainBg, 
                  color: colors.textPrimary 
                }}
                maxLength={200}
              />
            </div>

            {/* Tags & Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  <Hash size={14} /> Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="e.g., Bibi,Ki,Vines"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: colors.textPrimary 
                  }}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Separate with commas
                </p>
              </div>

              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  <Calendar size={14} /> News Date *
                </label>
                <input
                  type="date"
                  value={formData.newsDate}
                  onChange={(e) => handleInputChange('newsDate', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: colors.textPrimary 
                  }}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* CTA Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => handleInputChange('ctaText', e.target.value)}
                  placeholder="e.g., Read Story"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: colors.textPrimary 
                  }}
                  maxLength={30}
                />
              </div>

              {/* <div>
                <label 
                  className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" 
                  style={{ color: colors.textSecondary }}
                >
                  <LinkIcon size={14} /> CTA Link
                </label>
                <input
                  type="url"
                  value={formData.ctaLink}
                  onChange={(e) => handleInputChange('ctaLink', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ 
                    borderColor: colors.border, 
                    backgroundColor: colors.mainBg, 
                    color: colors.textPrimary 
                  }}
                />
              </div> */}
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
                <ImageIcon size={14} /> News Image *
              </label>

              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all ${uploadingImage ? 'pointer-events-none opacity-60' : ''}`}
                onClick={() => !uploadingImage && document.getElementById('news-file-upload')?.click()}
                style={{ borderColor: colors.border }}
              >
                <input 
                  id="news-file-upload" 
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

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-6 relative">
                  <img 
                    src={imagePreview} 
                    className="w-full h-56 object-cover rounded-xl shadow-lg border" 
                    style={{ borderColor: colors.border }} 
                    alt="News preview" 
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
                      removeImage();
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

            {/* Status Toggle */}
            <div 
              className="border rounded-xl p-5" 
              style={{ borderColor: colors.border, backgroundColor: colors.mainBg }}
            >
              <label className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>
                  News Status
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
            disabled={loading || uploadingImage || !formData.title || !formData.badgeTypeId || !uploadedMediaId}
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
              editingNews ? 'Update News' : 'Publish News'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateNewsModal;