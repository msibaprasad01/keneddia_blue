import React, { useState } from 'react';
import { colors } from "@/lib/colors/colors";
import Layout from '@/modules/layout/Layout';
import { MapPin, Search, Edit2, ChevronDown } from 'lucide-react';
import AddLocationModal from '../../modals/AddLocationModal';
import { getAllLocations } from '@/Api/Api';
function Location() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample data - replace with actual API data
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      status: 'active'
    },
    {
      id: 2,
      name: 'Delhi',
      state: 'Delhi',
      country: 'India',
      status: 'active'
    },
    {
      id: 3,
      name: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      status: 'active'
    },
    {
      id: 4,
      name: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      status: 'active'
    }
  ]);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const statusOptions = ['All Status', 'Active', 'Inactive'];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedLocations = () => {
    let filteredLocations = [...locations];

    // Apply search filter
    if (searchTerm) {
      filteredLocations = filteredLocations.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'All Status') {
      filteredLocations = filteredLocations.filter(
        location => location.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredLocations.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredLocations;
  };

  const sortedLocations = getSortedLocations();

  return (
    <Layout 
      // title="Location"
      // subtitle="Manage your hotel locations"
      role="superadmin"
      showActions={false}
    >
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
              <p 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Manage your locations
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
              style={{ backgroundColor: colors.primary }}
              onMouseEnter={(e) => e.target.style.backgroundColor = colors.primaryHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
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
              All Locations
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
                    backgroundColor: colors.background
                  }}
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 min-w-[140px] justify-between"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    backgroundColor: 'white'
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
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        style={{ color: colors.textPrimary }}
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: colors.background }}>
                <th 
                  className="px-6 py-3 text-left text-xs font-semibold cursor-pointer"
                  style={{ color: colors.textSecondary }}
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Location Name
                    <span className="text-xs">⇅</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-semibold cursor-pointer"
                  style={{ color: colors.textSecondary }}
                  onClick={() => handleSort('state')}
                >
                  <div className="flex items-center gap-1">
                    State
                    <span className="text-xs">⇅</span>
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-semibold"
                  style={{ color: colors.textSecondary }}
                >
                  Country
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-semibold"
                  style={{ color: colors.textSecondary }}
                >
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-semibold"
                  style={{ color: colors.textSecondary }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedLocations.map((location) => (
                <tr 
                  key={location.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                  style={{ borderColor: colors.border }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: colors.primary + '15' }}
                      >
                        <MapPin size={16} style={{ color: colors.primary }} />
                      </div>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: colors.textPrimary }}
                      >
                        {location.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="text-sm"
                      style={{ color: colors.textPrimary }}
                    >
                      {location.state}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="text-sm"
                      style={{ color: colors.textPrimary }}
                    >
                      {location.country}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: location.status === 'active' ? '#10b98120' : '#ef444420',
                        color: location.status === 'active' ? '#10b981' : '#ef4444'
                      }}
                    >
                      {location.status}
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

          {sortedLocations.length === 0 && (
            <div className="text-center py-12">
              <p style={{ color: colors.textSecondary }}>
                No locations found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Location Modal */}
      {showAddModal && (
        <AddLocationModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={(newLocation) => {
            setLocations([...locations, newLocation]);
            setShowAddModal(false);
          }}
        />
      )}
    </Layout>
  );
}

export default Location;