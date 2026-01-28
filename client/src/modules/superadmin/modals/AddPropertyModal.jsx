import React, { useState, useEffect } from "react";
import { X, Upload, Building2, MapPin, Star, Users, DollarSign, Tag, Sparkles, Image as ImageIcon, Loader2 } from "lucide-react";
import { colors } from "@/lib/colors/colors";
import {
  addProperty,
  getPropertyTypes,
  getAllPropertyCategories,
  getAllLocations,
  getUsersPaginated,
} from "@/Api/Api";
import { toast } from "react-hot-toast";

function AddPropertyModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    // Core Identity
    type: "", // Hotel, Restaurant, Cafe
    city: "",
    location: "",
    
    // Headlines & Branding
    headline1: "", // Main name (e.g., "Kennedia Grand")
    headline2: "", // Subtitle (e.g., "Lakeside Resort")
    tagline: "",
    
    // Details
    rating: "",
    capacity: "", // e.g., "150 Rooms", "80 Seats"
    price: "", // e.g., "$450"
    
    // Amenities
    amenities: [],
    
    // Image
    image: {
      src: "",
      alt: "",
      width: 1200,
      height: 800
    },
    
    // Admin & Legacy Fields (kept for backend compatibility)
    assignedAdminId: "",
    isActive: true,
  });

  // Amenity input state
  const [amenityInput, setAmenityInput] = useState("");
  const [suggestedAmenities, setSuggestedAmenities] = useState([
    "Lakeside View", "Spa & Wellness", "Fine Dining", "Infinity Pool", "24/7 Concierge",
    "Free WiFi", "Parking", "Pet Friendly", "Rooftop Bar", "Business Center",
    "Gym", "Room Service", "Airport Shuttle", "Conference Rooms", "Garden View",
    "Beachfront", "Mountain View", "City Center", "Outdoor Seating", "Live Music"
  ]);

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('url');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [typesRes, locationsRes, adminsRes] = await Promise.all([
        getPropertyTypes(),
        getAllLocations(),
        getUsersPaginated({ page: 1, size: 100 }),
      ]);

      setPropertyTypes(typesRes?.data || typesRes || []);
      setLocations(locationsRes?.data || locationsRes || []);
      
      const adminData = adminsRes?.data?.content || adminsRes?.content || [];
      const adminUsers = adminData.filter(
        (user) => user.roleName === "ROLE_ADMIN"
      );
      setAdmins(adminUsers);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
      toast.error("Failed to load form data");
    }
  };

  const generateId = () => {
    const prefix = formData.headline1
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 20);
    const suffix = Math.random().toString(36).substring(2, 6);
    return `${prefix}-${suffix}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      image: { ...prev.image, [field]: value }
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
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
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData(prev => ({
          ...prev,
          image: {
            ...prev.image,
            src: base64String,
            alt: formData.headline1 || 'Property image'
          }
        }));
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url) => {
    setImageUrl(url);
    if (url.trim()) {
      setImagePreview(url);
      setFormData(prev => ({
        ...prev,
        image: {
          ...prev.image,
          src: url,
          alt: formData.headline1 || 'Property image'
        }
      }));
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput("");
    }
  };

  const removeAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addSuggestedAmenity = (amenity) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  const validateForm = () => {
    if (!formData.type) {
      toast.error('Property type is required');
      return false;
    }
    if (!formData.headline1?.trim()) {
      toast.error('Main headline is required');
      return false;
    }
    if (!formData.city?.trim()) {
      toast.error('City is required');
      return false;
    }
    if (!formData.location?.trim()) {
      toast.error('Location address is required');
      return false;
    }
    if (!formData.tagline?.trim()) {
      toast.error('Tagline is required');
      return false;
    }
    if (!formData.price?.trim()) {
      toast.error('Price is required');
      return false;
    }
    if (!formData.assignedAdminId) {
      toast.error('Assigned admin is required');
      return false;
    }
    if (!formData.image.src) {
      toast.error('Property image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Generate unique ID
      const propertyId = generateId();
      
      // Prepare payload matching the required format
      const payload = {
        id: propertyId,
        type: formData.type,
        city: formData.city,
        location: formData.location,
        tagline: formData.tagline,
        headline1: formData.headline1,
        headline2: formData.headline2 || "",
        rating: parseFloat(formData.rating) || 0,
        capacity: formData.capacity || "",
        price: formData.price,
        amenities: formData.amenities,
        image: formData.image,
        assignedAdminId: parseInt(formData.assignedAdminId),
        isActive: formData.isActive,
      };

      await addProperty(formData.type, payload);
      toast.success('Property added successfully');
      onSuccess();
    } catch (err) {
      console.error('Error adding property:', err);
      toast.error(err.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.contentBg }}
      >
        {/* Header */}
        <div
          className="sticky top-0 bg-white p-6 border-b flex items-center justify-between z-10 rounded-t-xl"
          style={{ borderColor: colors.border, backgroundColor: colors.contentBg }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              Add New Property
            </h2>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Create a stunning property listing with all details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Property Details */}
            <div className="space-y-6">
              {/* Property Type & City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                    <Building2 size={14} /> Property Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    style={{ borderColor: colors.border, color: formData.type ? colors.textPrimary : '#9CA3AF' }}
                  >
                    <option value="">Select Type</option>
                    <option value="HOTEL">Hotel</option>
                    <option value="RESTAURANT">Restaurant</option>
                    <option value="CAFE">Cafe</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                    <MapPin size={14} /> City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    style={{ borderColor: colors.border, color: formData.city ? colors.textPrimary : '#9CA3AF' }}
                  >
                    <option value="">Select City</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.locationName}>
                        {loc.locationName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Headlines */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-primary">
                  <Sparkles size={14} /> Property Branding
                </label>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                    Main Headline * (e.g., "Kennedia Grand")
                  </label>
                  <input
                    type="text"
                    name="headline1"
                    value={formData.headline1}
                    onChange={handleChange}
                    placeholder="Enter main property name"
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    style={{ borderColor: colors.border }}
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                    Subtitle (e.g., "Lakeside Resort")
                  </label>
                  <input
                    type="text"
                    name="headline2"
                    value={formData.headline2}
                    onChange={handleChange}
                    placeholder="Enter subtitle or property type"
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    style={{ borderColor: colors.border }}
                    maxLength={50}
                  />
                </div>
              </div>

              {/* Location Address */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                  <MapPin size={14} /> Full Address *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Quai du Mont-Blanc, Geneva"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ borderColor: colors.border }}
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                  <Tag size={14} /> Tagline *
                </label>
                <textarea
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., Experience the pinnacle of luxury overlooking Lake Geneva's crystal waters."
                  className="w-full px-4 py-2.5 rounded-lg border outline-none resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ borderColor: colors.border }}
                  maxLength={200}
                />
                <div className="text-right text-[10px] text-gray-400 mt-1">
                  {formData.tagline.length}/200 characters
                </div>
              </div>

              {/* Rating, Capacity, Price */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                    <Star size={14} /> Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="4.9"
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    style={{ borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                    <Users size={14} /> Capacity
                  </label>
                  <input
                    type="text"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="150 Rooms"
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    style={{ borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                    <DollarSign size={14} /> Price *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="$450"
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    style={{ borderColor: colors.border }}
                  />
                </div>
              </div>

              {/* Assigned Admin */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                  <Users size={14} /> Assigned Admin *
                </label>
                <select
                  name="assignedAdminId"
                  value={formData.assignedAdminId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  style={{ borderColor: colors.border, color: formData.assignedAdminId ? colors.textPrimary : '#9CA3AF' }}
                >
                  <option value="">Select Admin</option>
                  {admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} ({admin.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border" style={{ borderColor: colors.border }}>
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  Property Active Status
                </span>
                <label className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: formData.isActive ? '#10B981' : '#EF4444' }}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
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
                </label>
              </div>
            </div>

            {/* Right Column: Image & Amenities */}
            <div className="space-y-6">
              {/* Property Image */}
              <div className="border rounded-xl p-5" style={{ borderColor: colors.border, backgroundColor: colors.mainBg }}>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-4" style={{ color: colors.textSecondary }}>
                  <ImageIcon size={14} /> Property Image *
                </label>

                {/* Upload Method Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                  <button 
                    type="button"
                    onClick={() => setUploadMethod('url')} 
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                      uploadMethod === 'url' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'
                    }`}
                  >
                    URL
                  </button>
                  <button 
                    type="button"
                    onClick={() => setUploadMethod('upload')} 
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                      uploadMethod === 'upload' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'
                    }`}
                  >
                    Upload
                  </button>
                </div>

                {/* Upload Content */}
                {uploadMethod === 'url' ? (
                  <div>
                    <input
                      type="text"
                      placeholder="Paste image URL..."
                      value={imageUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      style={{ borderColor: colors.border, backgroundColor: 'white' }}
                    />
                    <p className="text-[10px] text-gray-400 mt-2">
                      Enter a direct image URL
                    </p>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all"
                    onClick={() => document.getElementById('property-image-upload')?.click()}
                    style={{ borderColor: colors.border }}
                  >
                    <input 
                      id="property-image-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileSelect} 
                    />
                    <Upload size={30} className="mx-auto mb-2 opacity-20" />
                    <p className="text-xs font-medium text-gray-600">
                      {selectedFile ? selectedFile.name : 'Click to upload image'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4 relative">
                    <img 
                      src={imagePreview} 
                      className="w-full h-48 object-cover rounded-xl shadow-lg border" 
                      style={{ borderColor: colors.border }} 
                      alt="Property preview" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedFile(null);
                        setImageUrl('');
                        setFormData(prev => ({ ...prev, image: { ...prev.image, src: '' } }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Optional Image Metadata */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={formData.image.alt}
                      onChange={(e) => handleImageChange('alt', e.target.value)}
                      placeholder="Property description"
                      className="w-full px-3 py-2 rounded-lg border text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      style={{ borderColor: colors.border }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Width</label>
                      <input
                        type="number"
                        value={formData.image.width}
                        onChange={(e) => handleImageChange('width', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-xs"
                        style={{ borderColor: colors.border }}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Height</label>
                      <input
                        type="number"
                        value={formData.image.height}
                        onChange={(e) => handleImageChange('height', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-xs"
                        style={{ borderColor: colors.border }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="border rounded-xl p-5" style={{ borderColor: colors.border, backgroundColor: colors.mainBg }}>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-4" style={{ color: colors.textSecondary }}>
                  <Sparkles size={14} /> Amenities & Features
                </label>

                {/* Add Custom Amenity */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    placeholder="Add custom amenity..."
                    className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: colors.border }}
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="px-4 py-2 rounded-lg text-white text-sm font-bold hover:opacity-90 transition-all"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Add
                  </button>
                </div>

                {/* Current Amenities */}
                {formData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 p-3 bg-white rounded-lg border" style={{ borderColor: colors.border }}>
                    {formData.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggested Amenities */}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Quick Add:</p>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {suggestedAmenities
                      .filter(amenity => !formData.amenities.includes(amenity))
                      .map((amenity, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => addSuggestedAmenity(amenity)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium transition-colors"
                          style={{ color: colors.textPrimary }}
                        >
                          + {amenity}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div 
            className="flex justify-end gap-3 mt-8 pt-6 border-t"
            style={{ borderColor: colors.border }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 rounded-lg border text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
              style={{ borderColor: colors.border }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.headline1 || !formData.type || !formData.image.src}
              className="px-6 py-3 rounded-lg text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Adding Property...
                </>
              ) : (
                'Add Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPropertyModal;