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
} from "lucide-react";
import AddLocationModal from "../../modals/AddLocationModal";
import { getAllLocations } from "@/Api/Api";

function Location() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

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

  // Fetch locations from API
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await getAllLocations();

      console.log("Locations API Response:", response);

      // Handle different response structures
      let data = response;

      // If response is wrapped in data property (axios)
      if (response?.data) {
        data = response.data;
      }

      if (Array.isArray(data)) {
        setLocations(data);
      } else {
        console.warn("Unexpected response structure:", data);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getFilteredAndSortedLocations = () => {
    let filteredLocations = [...locations];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filteredLocations = filteredLocations.filter(
        (location) =>
          location.locationName?.toLowerCase().includes(lowerSearch) ||
          location.state?.toLowerCase().includes(lowerSearch) ||
          location.country?.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply status filter
    if (statusFilter !== "All Status") {
      const isActiveTarget = statusFilter === "Active";
      filteredLocations = filteredLocations.filter(
        (location) => location.isActive === isActiveTarget
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredLocations.sort((a, b) => {
        const aVal = a[sortConfig.key] || "";
        const bVal = b[sortConfig.key] || "";
        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredLocations;
  };

  const filteredLocations = getFilteredAndSortedLocations();

  // Pagination logic
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLocations = filteredLocations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <Layout role="superadmin" showActions={false}>
      <div className="h-full overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header Section */}
          <div className="p-6 border-b" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-xl font-semibold mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  Locations
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Manage your locations
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: colors.primary }}
              >
                + Add Location
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="p-6 border-b" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between gap-4">
              <h3
                className="text-base font-semibold"
                style={{ color: colors.textPrimary }}
              >
                All Locations ({locations.length})
              </h3>

              <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: colors.textSecondary }}
                  />
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 w-64"
                    style={{
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: colors.background,
                    }}
                  />
                </div>

                {/* Status Filter */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 min-w-[140px] justify-between"
                    style={{
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: "white",
                    }}
                  >
                    {statusFilter}
                    <ChevronDown size={16} />
                  </button>

                  {showStatusDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg border z-10"
                      style={{ borderColor: colors.border }}
                    >
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setShowStatusDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                          style={{
                            color: "#111827",
                            backgroundColor:
                              statusFilter === status
                                ? colors.background
                                : "white",
                          }}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto min-h-[300px]">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2"
                  style={{ borderColor: colors.primary }}
                ></div>
              </div>
            ) : paginatedLocations.length === 0 ? (
              <div className="text-center py-20">
                <p style={{ color: colors.textSecondary }}>No locations found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.background }}>
                    <th
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                      style={{ color: colors.textSecondary }}
                      onClick={() => handleSort("locationName")}
                    >
                      <div className="flex items-center gap-1">
                        Location Name
                        <span className="text-xs">⇅</span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                      style={{ color: colors.textSecondary }}
                      onClick={() => handleSort("state")}
                    >
                      <div className="flex items-center gap-1">
                        State
                        <span className="text-xs">⇅</span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: colors.textSecondary }}
                    >
                      Country
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: colors.textSecondary }}
                    >
                      Status
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: colors.textSecondary }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedLocations.map((location) => (
                    <tr
                      key={location.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: colors.primary + "15" }}
                          >
                            <MapPin size={16} style={{ color: colors.primary }} />
                          </div>
                          <span
                            className="text-sm font-medium"
                            style={{ color: colors.textPrimary }}
                          >
                            {location.locationName || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-sm"
                          style={{ color: colors.textPrimary }}
                        >
                          {location.state || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-sm"
                          style={{ color: colors.textPrimary }}
                        >
                          {location.country || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: location.isActive
                              ? "#10b98120"
                              : "#ef444420",
                            color: location.isActive ? "#10b981" : "#ef4444",
                          }}
                        >
                          {location.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
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

          {/* Pagination */}
          {!loading && filteredLocations.length > 0 && (
            <div
              className="flex items-center justify-between px-6 py-4 border-t"
              style={{ borderColor: colors.border }}
            >
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Page {currentPage} of {totalPages} • Showing{" "}
                {paginatedLocations.length} of {filteredLocations.length}{" "}
                locations
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gray-50">
                  {currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Location Modal */}
      {showAddModal && (
        <AddLocationModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchLocations();
            setShowAddModal(false);
          }}
        />
      )}
    </Layout>
  );
}

export default Location;