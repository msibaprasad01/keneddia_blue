import React, { useState, useEffect } from "react";
import { X, Upload, Building2, MapPin, Star, Users, DollarSign, Tag,Plus, Sparkles, Image as ImageIcon, Loader2 } from "lucide-react";
import { colors } from "@/lib/colors/colors";
import {
  getAllProperties,
  getPropertyTypes,
  getAllLocations,
  getUsersPaginated,
  createPropertyListing,
  createAmenityFeature,
  getAllAmenityFeatures
} from "@/Api/Api";
import { toast } from "react-hot-toast";

function AddPropertyModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    propertyId: "",
    assignedAdminId: "",
    propertyName: "",
    propertyType: "",
    city: "",
    mainHeading: "",
    subTitle: "",
    fullAddress: "",
    tagline: "",
    rating: null,
    capacity: null,
    price: "",
    amenitiesAndFeaturesIds: [],
    isActive: true
  });

  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [availableAmenities, setAvailableAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAmenityName, setNewAmenityName] = useState("");
  const [creatingAmenity, setCreatingAmenity] = useState(false);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [propertiesRes, typesRes, locationsRes, adminsRes, amenitiesRes] = await Promise.all([
        getAllProperties(),
        getPropertyTypes(),
        getAllLocations(),
        getUsersPaginated({ page: 1, size: 100 }),
        getAllAmenityFeatures()
      ]);

      setProperties(propertiesRes?.data || propertiesRes || []);
      setPropertyTypes(typesRes?.data || typesRes || []);
      setLocations(locationsRes?.data || locationsRes || []);
      
      const adminData = adminsRes?.data?.content || adminsRes?.content || [];
      const adminUsers = adminData.filter(user => user.roleName === "ROLE_ADMIN");
      setAdmins(adminUsers);

      const amenitiesData = amenitiesRes?.data || amenitiesRes || [];
      const activeAmenities = amenitiesData.filter(a => a.isActive);
      setAvailableAmenities(activeAmenities);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
      toast.error("Failed to load form data");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const toggleAmenity = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenitiesAndFeaturesIds: prev.amenitiesAndFeaturesIds.includes(amenityId)
        ? prev.amenitiesAndFeaturesIds.filter(id => id !== amenityId)
        : [...prev.amenitiesAndFeaturesIds, amenityId]
    }));
  };

  const handleCreateAmenity = async () => {
    if (!newAmenityName.trim()) {
      toast.error("Amenity name is required");
      return;
    }

    try {
      setCreatingAmenity(true);
      const response = await createAmenityFeature({
        name: newAmenityName.trim(),
        isActive: true
      });

      const newAmenity = response?.data || response;
      setAvailableAmenities(prev => [...prev, newAmenity]);
      setFormData(prev => ({
        ...prev,
        amenitiesAndFeaturesIds: [...prev.amenitiesAndFeaturesIds, newAmenity.id]
      }));
      setNewAmenityName("");
      toast.success(`Amenity "${newAmenity.name}" created and added`);
    } catch (err) {
      console.error("Error creating amenity:", err);
      toast.error(err.response?.data?.message || "Failed to create amenity");
    } finally {
      setCreatingAmenity(false);
    }
  };

  const validateForm = () => {
    if (!formData.propertyId) {
      toast.error("Property is required");
      return false;
    }
    if (!formData.assignedAdminId) {
      toast.error("Assigned admin is required");
      return false;
    }
    if (!formData.propertyName?.trim()) {
      toast.error("Property name is required");
      return false;
    }
    if (!formData.propertyType) {
      toast.error("Property type is required");
      return false;
    }
    if (!formData.city?.trim()) {
      toast.error("City is required");
      return false;
    }
    if (!formData.mainHeading?.trim()) {
      toast.error("Main heading is required");
      return false;
    }
    if (!formData.fullAddress?.trim()) {
      toast.error("Full address is required");
      return false;
    }
    if (!formData.tagline?.trim()) {
      toast.error("Tagline is required");
      return false;
    }
    if (!formData.price) {
      toast.error("Price is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        propertyId: parseInt(formData.propertyId),
        assignedAdminId: parseInt(formData.assignedAdminId),
        propertyName: formData.propertyName.trim(),
        propertyType: formData.propertyType,
        city: formData.city.trim(),
        mainHeading: formData.mainHeading.trim(),
        subTitle: formData.subTitle?.trim() || "",
        fullAddress: formData.fullAddress.trim(),
        tagline: formData.tagline.trim(),
        rating: formData.rating ? parseFloat(formData.rating) : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        price: parseFloat(formData.price),
        amenitiesAndFeaturesIds: formData.amenitiesAndFeaturesIds,
        isActive: formData.isActive
      };

      console.log("Submitting property listing:", payload);
      await createPropertyListing(payload);
      toast.success("Property listing created successfully");
      onSuccess();
    } catch (err) {
      console.error("Error creating property listing:", err);
      toast.error(err.response?.data?.message || "Failed to create property listing");
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
              Create Property Listing
            </h2>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Add a new listing for an existing property
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Property Selection & Admin */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                    <Building2 size={14} /> Property *
                  </label>
                  <select
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: colors.border, color: formData.propertyId ? colors.textPrimary : '#9CA3AF' }}
                  >
                    <option value="">Select Property</option>
                    {properties.map(prop => (
                      <option key={prop.id} value={prop.id}>
                        {prop.propertyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                    <Users size={14} /> Assigned Admin *
                  </label>
                  <select
                    name="assignedAdminId"
                    value={formData.assignedAdminId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: colors.border, color: formData.assignedAdminId ? colors.textPrimary : '#9CA3AF' }}
                  >
                    <option value="">Select Admin</option>
                    {admins.map(admin => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Name */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                  Property Name *
                </label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  placeholder="e.g., Grand Palace Hotel"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20"
                  style={{ borderColor: colors.border }}
                />
              </div>

              {/* Type & City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                    <Building2 size={14} /> Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: colors.border, color: formData.propertyType ? colors.textPrimary : '#9CA3AF' }}
                  >
                    <option value="">Select Type</option>
                    {propertyTypes.map(type => (
                      <option key={type.id} value={type.typeName}>
                        {type.typeName}
                      </option>
                    ))}
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
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: colors.border, color: formData.city ? colors.textPrimary : '#9CA3AF' }}
                  >
                    <option value="">Select City</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.locationName}>
                        {loc.locationName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Headlines */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-primary">
                  <Sparkles size={14} /> Headings
                </label>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                    Main Heading *
                  </label>
                  <input
                    type="text"
                    name="mainHeading"
                    value={formData.mainHeading}
                    onChange={handleChange}
                    placeholder="e.g., Grand Palace Hotel"
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleChange}
                    placeholder="e.g., Premium stay in Central City"
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: colors.border }}
                  />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                  <MapPin size={14} /> Full Address *
                </label>
                <input
                  type="text"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  placeholder="e.g., MG Road, Central City, Bengaluru - 560001"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20"
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
                  placeholder="e.g., Comfort and elegance in the heart of the city"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none resize-none focus:ring-2 focus:ring-primary/20"
                  style={{ borderColor: colors.border }}
                  maxLength={200}
                />
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
                    value={formData.rating || ""}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="4.5"
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                    <Users size={14} /> Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity || ""}
                    onChange={handleChange}
                    placeholder="150"
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: colors.border }}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-2" style={{ color: colors.textSecondary }}>
                    <DollarSign size={14} /> Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    placeholder="8500.00"
                    className="w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/20"
                    style={{ borderColor: colors.border }}
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border" style={{ borderColor: colors.border }}>
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  Listing Active Status
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

            {/* Right Column - Amenities */}
            <div className="space-y-6">
              <div className="border rounded-xl p-5" style={{ borderColor: colors.border, backgroundColor: colors.mainBg }}>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-4" style={{ color: colors.textSecondary }}>
                  <Sparkles size={14} /> Amenities & Features
                </label>

                {/* Create New Amenity */}
                <div className="mb-4 p-3 bg-white rounded-lg border" style={{ borderColor: colors.border }}>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Create New Amenity:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAmenityName}
                      onChange={(e) => setNewAmenityName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateAmenity())}
                      placeholder="e.g., Lakeside View"
                      className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      style={{ borderColor: colors.border }}
                    />
                    <button
                      type="button"
                      onClick={handleCreateAmenity}
                      disabled={creatingAmenity || !newAmenityName.trim()}
                      className="px-4 py-2 rounded-lg text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {creatingAmenity ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                      Add
                    </button>
                  </div>
                </div>

                {/* Selected Count */}
                <div className="mb-3 text-xs font-medium" style={{ color: colors.textSecondary }}>
                  Selected: {formData.amenitiesAndFeaturesIds.length} amenities
                </div>

                {/* Available Amenities */}
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {availableAmenities.length === 0 ? (
                    <p className="text-xs text-center py-4" style={{ color: colors.textSecondary }}>
                      No amenities available. Create one above.
                    </p>
                  ) : (
                    availableAmenities.map(amenity => (
                      <label
                        key={amenity.id}
                        className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{ borderColor: formData.amenitiesAndFeaturesIds.includes(amenity.id) ? colors.primary : colors.border }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenitiesAndFeaturesIds.includes(amenity.id)}
                          onChange={() => toggleAmenity(amenity.id)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: colors.primary }}
                        />
                        <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                          {amenity.name}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t" style={{ borderColor: colors.border }}>
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
              disabled={loading}
              className="px-6 py-3 rounded-lg text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Creating...
                </>
              ) : (
                'Create Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPropertyModal;