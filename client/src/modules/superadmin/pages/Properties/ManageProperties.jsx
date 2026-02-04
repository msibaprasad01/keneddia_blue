import React, { useState, useEffect } from "react";
import { colors } from "@/lib/colors/colors";
import Layout from "@/modules/layout/Layout";
import {
  Search,
  ChevronDown,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
} from "lucide-react";
import AddPropertyModal from "../../modals/AddPropertyModal";
import AddPropertyTypeModal from "../../modals/AddPropertyTypeModal";
import AddPropertyCategoryModal from "../../modals/AddPropertyCategoryModal";
import {
  getPropertyTypes,
  getAllProperties,
  getAllPropertyCategories,
} from "@/Api/Api";

import PropertyDetail from "./PropertyDetail";

function ManageProperties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Modal states
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // State for PropertyDetail view
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Data states
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyCategories, setPropertyCategories] = useState([]);

  // Loading states
  const [loadingProperties, setLoadingProperties] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statusOptions = ["All Status", "Active", "Inactive"];

  // Fetch all data
  const fetchData = async () => {
    setLoadingProperties(true);
    try {
      const [propRes, typeRes, catRes] = await Promise.all([
        getAllProperties(),
        getPropertyTypes(),
        getAllPropertyCategories()
      ]);

      setProperties(propRes?.data || propRes || []);
      setPropertyTypes(typeRes?.data || typeRes || []);
      setPropertyCategories(catRes?.data || catRes || []);
    } catch (error) {
      console.error("Error fetching management data:", error);
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowTypeDropdown(false);
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "P";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getFilteredProperties = () => {
    let filtered = [...properties];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((p) =>
          p.propertyName?.toLowerCase().includes(lowerSearch) ||
          p.address?.toLowerCase().includes(lowerSearch) ||
          p.locationName?.toLowerCase().includes(lowerSearch)
      );
    }

    if (typeFilter !== "All Types") {
      filtered = filtered.filter((p) => 
        p.propertyTypes?.some(type => type.toLowerCase() === typeFilter.toLowerCase())
      );
    }

    if (statusFilter !== "All Status") {
      filtered = filtered.filter((p) => p.isActive === (statusFilter === "Active"));
    }

    return filtered;
  };

  const displayProperties = getFilteredProperties();
  const totalPages = Math.ceil(displayProperties.length / itemsPerPage);
  const paginatedProperties = displayProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleDeleteProperty = async (propertyId) => {
    setProperties(properties.filter(p => p.id !== propertyId));
    setShowDeleteConfirm(null);
  };

  if (selectedProperty) {
    return (
      <Layout role="superadmin" showActions={false}>
        <PropertyDetail 
          // Passing the complete data object to PropertyDetail
          property={selectedProperty} 
          onBack={() => {
            setSelectedProperty(null);
            fetchData(); 
          }} 
        />
      </Layout>
    );
  }

  return (
    <Layout role="superadmin" showActions={false}>
      <div className="h-full overflow-y-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  Property Management
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Organize and manage your real estate portfolio
                </p>
              </div>
              <button
                onClick={() => setShowAddPropertyModal(true)}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
                style={{ backgroundColor: colors.primary }}
              >
                <Plus size={18} /> Add Property
              </button>
            </div>
          </div>

          <div className="p-6 border-b bg-gray-50/50" style={{ borderColor: colors.border }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Properties List ({displayProperties.length})
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search name, city..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="pl-10 pr-4 py-2 rounded-lg border text-sm focus:ring-2 w-64 outline-none transition-all"
                    style={{ borderColor: colors.border }}
                  />
                </div>

                <div className="relative dropdown-container">
                  <button
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="px-4 py-2 rounded-lg border bg-white text-sm font-medium flex items-center gap-2 min-w-[140px] justify-between"
                    style={{ borderColor: colors.border }}
                  >
                    {typeFilter}
                    <ChevronDown size={16} className={showTypeDropdown ? "rotate-180 transition-transform" : "transition-transform"} />
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-20 py-1">
                      <button onClick={() => { setTypeFilter("All Types"); setShowTypeDropdown(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">All Types</button>
                      {propertyTypes.map((type) => (
                        <button key={type.id} onClick={() => { setTypeFilter(type.typeName); setShowTypeDropdown(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">{type.typeName}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loadingProperties ? (
              <div className="flex flex-col justify-center items-center py-24 gap-3 text-gray-400">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm">Fetching properties...</p>
              </div>
            ) : paginatedProperties.length === 0 ? (
              <div className="text-center py-24 text-gray-400 text-sm">No properties found.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Property</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Admin</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm" style={{ backgroundColor: colors.primary + "15", color: colors.primary }}>
                            {getInitials(property.propertyName)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{property.propertyName || "Unnamed"}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{property.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {property.propertyTypes?.slice(0, 2).map((type, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">{type}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="font-medium text-gray-900">{property.locationName}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{property.assignedAdminName || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${property.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {property.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {/* Action buttons shown without hover dependency */}
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedProperty(property)}
                            className="p-2 rounded-lg bg-white border border-gray-100 text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all"
                            title="Edit/View Details"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(property.id)}
                            className="p-2 rounded-lg bg-white border border-gray-100 text-red-600 shadow-sm hover:bg-red-600 hover:text-white transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-400">
              Showing {paginatedProperties.length} of {displayProperties.length} records
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-gray-200 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold w-8 text-center">{currentPage}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded border border-gray-200 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50/30">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Property Types</h3>
              <button onClick={() => setShowAddTypeModal(true)} className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto p-2 space-y-1">
              {propertyTypes.map(t => (
                <div key={t.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg text-sm transition-colors border border-transparent hover:border-gray-100">
                  <span className="font-semibold text-gray-700">{t.typeName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.isActive ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}>
                    {t.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50/30">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Categories</h3>
              <button onClick={() => setShowAddCategoryModal(true)} className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto p-2 space-y-1">
              {propertyCategories.map(c => (
                <div key={c.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg text-sm transition-colors border border-transparent hover:border-gray-100">
                  <span className="font-semibold text-gray-700">{c.categoryName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.isActive ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl scale-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Property?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">This will permanently remove the property from the system. Linked records may be affected.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDeleteProperty(showDeleteConfirm)} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showAddPropertyModal && <AddPropertyModal onClose={() => setShowAddPropertyModal(false)} onSuccess={() => { fetchData(); setShowAddPropertyModal(false); }} />}
      {showAddTypeModal && <AddPropertyTypeModal onClose={() => setShowAddTypeModal(false)} onSuccess={() => { fetchData(); setShowAddTypeModal(false); }} />}
      {showAddCategoryModal && <AddPropertyCategoryModal onClose={() => setShowAddCategoryModal(false)} onSuccess={() => { fetchData(); setShowAddCategoryModal(false); }} />}
    </Layout>
  );
}

export default ManageProperties;