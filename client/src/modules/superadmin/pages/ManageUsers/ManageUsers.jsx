import React, { useState } from 'react';
import { colors } from "@/lib/colors/colors";
import Layout from '@/modules/layout/Layout';
import { Search, ChevronDown, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import AddUserModal from '../../modals/AddUserModal';

function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Pagination state - Changed to 5 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sample data - replace with actual API data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@hotel.com',
      role: 'Admin',
      location: 'Mumbai Central',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@hotel.com',
      role: 'Manager',
      location: 'Delhi Branch',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@hotel.com',
      role: 'Staff',
      location: 'Bangalore Office',
      status: 'inactive'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@hotel.com',
      role: 'Admin',
      location: 'Pune Branch',
      status: 'active'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david@hotel.com',
      role: 'Staff',
      location: 'Mumbai Central',
      status: 'active'
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily@hotel.com',
      role: 'Reception',
      location: 'Delhi Branch',
      status: 'active'
    },
    {
      id: 7,
      name: 'Robert Wilson',
      email: 'robert@hotel.com',
      role: 'Manager',
      location: 'Bangalore Office',
      status: 'inactive'
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      email: 'lisa@hotel.com',
      role: 'Staff',
      location: 'Pune Branch',
      status: 'active'
    }
  ]);

  const roleOptions = ['All Roles', 'Admin', 'Manager', 'Staff', 'Reception'];
  const statusOptions = ['All Status', 'Active', 'Inactive'];

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getFilteredUsers = () => {
    let filteredUsers = [...users];

    // Apply search filter
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'All Roles') {
      filteredUsers = filteredUsers.filter(
        user => user.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    // Apply status filter
    if (statusFilter !== 'All Status') {
      filteredUsers = filteredUsers.filter(
        user => user.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filteredUsers;
  };

  const filteredUsers = getFilteredUsers();

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setShowDeleteConfirm(null);
  };

  return (
    <Layout 
      role="superadmin"
      showActions={false}
    >
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
                  User Management
                </h2>
                <p 
                  className="text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  Manage your Users
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                style={{ backgroundColor: colors.primary }}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.primaryHover}
                onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
              >
                + Add User
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
                All User
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
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 w-64"
                    style={{ 
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: colors.background
                    }}
                  />
                </div>

                {/* Role Filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(!showRoleDropdown);
                      setShowStatusDropdown(false);
                    }}
                    className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 min-w-[140px] justify-between"
                    style={{ 
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: 'white'
                    }}
                  >
                    {roleFilter}
                    <ChevronDown size={16} />
                  </button>
                  
                  {showRoleDropdown && (
                    <div 
                      className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg border z-10"
                      style={{ borderColor: colors.border }}
                    >
                      {roleOptions.map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            setRoleFilter(role);
                            setShowRoleDropdown(false);
                            setCurrentPage(1);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                          style={{ color: colors.textPrimary }}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowStatusDropdown(!showStatusDropdown);
                      setShowRoleDropdown(false);
                    }}
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
                            setCurrentPage(1);
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
                    className="px-6 py-3 text-left text-xs font-semibold"
                    style={{ color: colors.textSecondary }}
                  >
                    User
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold"
                    style={{ color: colors.textSecondary }}
                  >
                    Role
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold"
                    style={{ color: colors.textSecondary }}
                  >
                    Email ID
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-semibold"
                    style={{ color: colors.textSecondary }}
                  >
                    Location
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
                {currentUsers.map((user) => (
                  <tr 
                    key={user.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{ borderColor: colors.border }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold"
                          style={{ 
                            backgroundColor: colors.primary + '20',
                            color: colors.primary
                          }}
                        >
                          {getInitials(user.name)}
                        </div>
                        <span 
                          className="text-sm font-medium"
                          style={{ color: colors.textPrimary }}
                        >
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="px-3 py-1 rounded-md text-xs font-medium"
                        style={{ 
                          backgroundColor: '#3b82f620',
                          color: '#3b82f6'
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        {user.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        {user.location}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: user.status === 'active' ? '#10b98120' : '#ef444420',
                          color: user.status === 'active' ? '#10b981' : '#ef4444'
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit user"
                        >
                          <Edit2 size={16} style={{ color: colors.primary }} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={16} style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {currentUsers.length === 0 && (
              <div className="text-center py-12">
                <p style={{ color: colors.textSecondary }}>
                  No users found
                </p>
              </div>
            )}
          </div>

          {/* Pagination Section */}
          {filteredUsers.length > 0 && (
            <div 
              className="flex items-center justify-between px-6 py-4 border-t"
              style={{ borderColor: colors.border }}
            >
              <p 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.textPrimary
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{ 
                      backgroundColor: currentPage === index + 1 ? colors.primary : 'transparent',
                      color: currentPage === index + 1 ? 'white' : colors.textPrimary
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.textPrimary
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={(newUser) => {
            setUsers([...users, newUser]);
            setShowAddModal(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: colors.textPrimary }}
            >
              Delete User
            </h3>
            <p 
              className="text-sm mb-6"
              style={{ color: colors.textSecondary }}
            >
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                style={{ 
                  borderColor: colors.border,
                  color: colors.textPrimary
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                style={{ backgroundColor: '#ef4444' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ManageUsers;