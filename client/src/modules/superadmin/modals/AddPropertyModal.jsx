import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { colors } from "@/lib/colors/colors";
import {
  addProperty,
  getPropertyTypes,
  getAllPropertyCategories,
  getAllLocations,
  getUsersPaginated,
} from "@/Api/Api";

function AddPropertyModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    area: "",
    pincode: "",
    locationId: "",
    propertyCategoryIds: [],
    assignedAdminId: "",
    isActive: true,
  });

  const [propertyType, setPropertyType] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [typesRes, categoriesRes, locationsRes, adminsRes] =
        await Promise.all([
          getPropertyTypes(),
          getAllPropertyCategories(),
          getAllLocations(),
          getUsersPaginated({ page: 1, size: 100 }),
        ]);

      setPropertyTypes(typesRes?.data || typesRes || []);
      setCategories(categoriesRes?.data || categoriesRes || []);
      setLocations(locationsRes?.data || locationsRes || []);
      
      const adminData = adminsRes?.data?.content || adminsRes?.content || [];
      const adminUsers = adminData.filter(
        (user) => user.roleName === "ROLE_ADMIN"
      );
      setAdmins(adminUsers);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      propertyCategoryIds: prev.propertyCategoryIds.includes(categoryId)
        ? prev.propertyCategoryIds.filter((id) => id !== categoryId)
        : [...prev.propertyCategoryIds, categoryId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!propertyType) {
      setError("Please select a property type");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        locationId: parseInt(formData.locationId),
        assignedAdminId: parseInt(formData.assignedAdminId),
      };

      await addProperty(propertyType, payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div
          className="sticky top-0 bg-white p-6 border-b flex items-center justify-between z-10"
          style={{ borderColor: colors.border }}
        >
          <h2
            className="text-xl font-semibold"
            style={{ color: colors.textPrimary }}
          >
            Add New Property
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Property Type */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                Property Type *
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: colors.border }}
              >
                <option value="">Select Type</option>
                {propertyTypes.map((type) => (
                  <option key={type.id} value={type.typeName}>
                    {type.typeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                Property Name *
              </label>
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: colors.border }}
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: colors.border }}
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                Area *
              </label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: colors.border }}
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: colors.border }}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                Location *
              </label>
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: colors.border }}
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.locationName}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned Admin */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                Assigned Admin *
              </label>
              <select
                name="assignedAdminId"
                value={formData.assignedAdminId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: colors.border }}
              >
                <option value="">Select Admin</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name} ({admin.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Property Categories */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                Property Categories *
              </label>
              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto" style={{ borderColor: colors.border }}>
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.propertyCategoryIds.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{category.categoryName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Is Active */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  Active
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
              style={{ borderColor: colors.border }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? "Adding..." : "Add Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPropertyModal;