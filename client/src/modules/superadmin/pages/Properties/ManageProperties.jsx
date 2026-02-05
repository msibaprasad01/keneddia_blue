import React, { useState, useEffect, useCallback } from "react";
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
  Building2,
  Tags,
  Layers,
  Power,
} from "lucide-react";
import AddPropertyModal from "../../modals/AddPropertyModal";
import AddPropertyTypeModal from "../../modals/AddPropertyTypeModal";
import AddPropertyCategoryModal from "../../modals/AddPropertyCategoryModal";
import {
  getPropertyTypes,
  getAllProperties,
  getAllPropertyCategories,
  enableProperty,
  disableProperty,
  deletePropertyListing
} from "@/Api/Api";
import { toast } from "react-hot-toast";

import PropertyDetail from "./PropertyDetail";

function ManageProperties() {
  const [activeMainTab, setActiveMainTab] = useState("properties");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyCategories, setPropertyCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // Track specific row actions

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [propRes, typeRes, catRes] = await Promise.all([
        getAllProperties(),
        getPropertyTypes(),
        getAllPropertyCategories(),
      ]);
      setProperties(propRes?.data || propRes || []);
      setPropertyTypes(typeRes?.data || typeRes || []);
      setPropertyCategories(catRes?.data || catRes || []);
    } catch (error) {
      console.error("Error fetching management data:", error);
      toast.error("Failed to load property data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- NEW FEATURE HANDLERS ---
  
  const handleToggleStatus = async (property) => {
    setActionLoading(property.id);
    try {
      if (property.isActive) {
        await disableProperty(property.id);
        toast.success(`${property.propertyName} disabled`);
      } else {
        await enableProperty(property.id);
        toast.success(`${property.propertyName} enabled`);
      }
      fetchData(); // Refresh list
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProperty = async (property) => {
    if (!window.confirm(`Are you sure you want to delete "${property.propertyName}"? This action cannot be undone.`)) return;
    
    setActionLoading(property.id);
    try {
      // Assuming property.id corresponds to the listing ID needed for deletePropertyListing
      await deletePropertyListing(property.id);
      toast.success("Property deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete property");
    } finally {
      setActionLoading(null);
    }
  };

  const getFilteredProperties = () => {
    let filtered = [...properties];
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.propertyName?.toLowerCase().includes(lowerSearch) ||
          p.address?.toLowerCase().includes(lowerSearch) ||
          p.locationName?.toLowerCase().includes(lowerSearch)
      );
    }
    if (typeFilter !== "All Types") {
      filtered = filtered.filter((p) =>
        p.propertyTypes?.some(
          (type) => type.toLowerCase() === typeFilter.toLowerCase()
        )
      );
    }
    return filtered;
  };

  const displayProperties = getFilteredProperties();
  const paginatedProperties = displayProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (selectedProperty) {
    return (
      <Layout role="superadmin" showActions={false}>
        <PropertyDetail
          property={selectedProperty}
          onBack={() => {
            setSelectedProperty(null);
            fetchData();
          }}
        />
      </Layout>
    );
  }

  const mainTabs = [
    { id: "properties", label: "All Properties", icon: <Building2 size={18} /> },
    { id: "types", label: "Property Types", icon: <Tags size={18} /> },
    { id: "categories", label: "Categories", icon: <Layers size={18} /> },
  ];

  return (
    <Layout role="superadmin" showActions={false}>
      <div className="h-full overflow-hidden flex flex-col space-y-4 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Portfolio Manager</h2>
            <p className="text-sm text-gray-500">Manage properties, types, and categories</p>
          </div>
          <button
            onClick={() => {
              if (activeMainTab === "properties") setShowAddPropertyModal(true);
              if (activeMainTab === "types") setShowAddTypeModal(true);
              if (activeMainTab === "categories") setShowAddCategoryModal(true);
            }}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-transform active:scale-95"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus size={18} /> Add {activeMainTab === "properties" ? "Property" : activeMainTab === "types" ? "Type" : "Category"}
          </button>
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all border-b-2 ${
                activeMainTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          {activeMainTab === "properties" && (
            <>
              <div className="p-4 border-b bg-gray-50/30 flex flex-wrap items-center justify-between gap-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg border text-sm w-64 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-xs font-bold text-gray-400 uppercase">Filters:</span>
                   <select 
                    value={typeFilter} 
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="text-sm border rounded-lg px-3 py-2 outline-none"
                   >
                     <option value="All Types">All Types</option>
                     {propertyTypes.map(t => <option key={t.id} value={t.typeName}>{t.typeName}</option>)}
                   </select>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-gray-50 text-xs font-black text-gray-400 uppercase tracking-widest border-b">
                    <tr>
                      <th className="px-6 py-4">Property</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                       <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr>
                    ) : paginatedProperties.map((p) => (
                      <tr key={p.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{p.propertyName}</div>
                          <div className="text-xs text-gray-500">{p.address}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{p.locationName}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {p.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                                {/* View/Edit */}
                                <button 
                                    onClick={() => setSelectedProperty(p)} 
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit/Details"
                                >
                                    <Edit2 size={16} />
                                </button>

                                {/* Toggle Enable/Disable */}
                                <button 
                                    onClick={() => handleToggleStatus(p)}
                                    disabled={actionLoading === p.id}
                                    className={`p-2 rounded-lg transition-colors ${p.isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                                    title={p.isActive ? "Disable Property" : "Enable Property"}
                                >
                                    {actionLoading === p.id ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
                                </button>
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Types and Categories tabs remain the same... */}
          {activeMainTab === "types" && (
            <div className="flex-1 overflow-auto p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {propertyTypes.map(type => (
                    <div key={type.id} className="p-4 border rounded-xl bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Tags size={20}/></div>
                        <div>
                           <div className="font-bold text-gray-900">{type.typeName}</div>
                           <div className="text-xs text-gray-500">Status: {type.isActive ? "Active" : "Inactive"}</div>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeMainTab === "categories" && (
            <div className="flex-1 overflow-auto p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {propertyCategories.map(cat => (
                    <div key={cat.id} className="p-4 border rounded-xl bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Layers size={20}/></div>
                        <div>
                           <div className="font-bold text-gray-900">{cat.categoryName}</div>
                           <div className="text-xs text-gray-500">Status: {cat.isActive ? "Active" : "Inactive"}</div>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>

      {showAddPropertyModal && <AddPropertyModal onClose={() => setShowAddPropertyModal(false)} onSuccess={() => { fetchData(); setShowAddPropertyModal(false); }} />}
      {showAddTypeModal && <AddPropertyTypeModal onClose={() => setShowAddTypeModal(false)} onSuccess={() => { fetchData(); setShowAddTypeModal(false); }} />}
      {showAddCategoryModal && <AddPropertyCategoryModal onClose={() => setShowAddCategoryModal(false)} onSuccess={() => { fetchData(); setShowAddCategoryModal(false); }} />}
    </Layout>
  );
}

export default ManageProperties;