import React, { useState, useEffect } from "react";
import { colors } from "@/lib/colors/colors";
import Layout from "@/modules/layout/Layout";
import {
  MapPin,
  Search,
  Edit2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import AddLocationModal from "../../modals/AddLocationModal";
import { getAllLocations, updateLocationStatus } from "@/Api/Api";
import { toast } from "react-hot-toast";

function Location() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const statusOptions = ["All Status", "Active", "Inactive"];

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await getAllLocations();
      let data = response?.data || response;
      if (Array.isArray(data)) {
        setLocations(data);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleToggleStatus = async (location) => {
    try {
      // Assuming updateLocationStatus takes (id, status)
      await updateLocationStatus(location.id, !location.isActive);
      toast.success(`Location marked as ${!location.isActive ? 'Active' : 'Inactive'}`);
      fetchLocations();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleEditClick = (location) => {
    setEditingLocation(location);
    setShowAddModal(true);
  };

  // ... (keep search, sort, and pagination logic as is)
  const getFilteredAndSortedLocations = () => {
    let filteredLocations = [...locations];
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filteredLocations = filteredLocations.filter(
        (location) =>
          location.locationName?.toLowerCase().includes(lowerSearch) ||
          location.state?.toLowerCase().includes(lowerSearch) ||
          location.country?.toLowerCase().includes(lowerSearch)
      );
    }
    if (statusFilter !== "All Status") {
      const isActiveTarget = statusFilter === "Active";
      filteredLocations = filteredLocations.filter(
        (location) => location.isActive === isActiveTarget
      );
    }
    if (sortConfig.key) {
      filteredLocations.sort((a, b) => {
        const aVal = a[sortConfig.key] || "";
        const bVal = b[sortConfig.key] || "";
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filteredLocations;
  };

  const filteredLocations = getFilteredAndSortedLocations();
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLocations = filteredLocations.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <Layout role="superadmin" showActions={false}>
      <div className="h-full overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 border-b" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1" style={{ color: colors.textPrimary }}>Locations</h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Manage your locations</p>
              </div>
              <button
                onClick={() => { setEditingLocation(null); setShowAddModal(true); }}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: colors.primary }}
              >
                + Add Location
              </button>
            </div>
          </div>

          {/* Filters (Logic remains same as your snippet) */}
          {/* ... */}

          {/* Table Section */}
          <div className="overflow-x-auto min-h-[300px]">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.primary }}></div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.background }}>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">State</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedLocations.map((location) => (
                    <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <MapPin size={16} style={{ color: colors.primary }} />
                          <span className="text-sm font-medium">{location.locationName || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{location.state}</td>
                      <td className="px-6 py-4">
                         <button 
                          onClick={() => handleToggleStatus(location)}
                          className="flex items-center gap-2 focus:outline-none"
                         >
                            {location.isActive ? (
                              <ToggleRight size={24} className="text-green-500" />
                            ) : (
                              <ToggleLeft size={24} className="text-gray-400" />
                            )}
                            <span className="text-xs font-medium" style={{ color: location.isActive ? "#10b981" : "#ef4444" }}>
                              {location.isActive ? "Active" : "Inactive"}
                            </span>
                         </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEditClick(location)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit location"
                        >
                          <Edit2 size={16} style={{ color: colors.primary }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Pagination Footer */}
          {/* ... */}
        </div>
      </div>

      {showAddModal && (
        <AddLocationModal
          initialData={editingLocation}
          onClose={() => { setShowAddModal(false); setEditingLocation(null); }}
          onSuccess={() => {
            fetchLocations();
            setShowAddModal(false);
            setEditingLocation(null);
          }}
        />
      )}
    </Layout>
  );
}
export default Location;