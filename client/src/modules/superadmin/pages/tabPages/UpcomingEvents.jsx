import React, { useState } from 'react';
import { colors } from "@/lib/colors/colors";
import { Plus, Edit, MapPin, Calendar as CalendarIcon, Info, ChevronLeft, ChevronRight } from 'lucide-react';

function UpcomingEvents() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Jazz Night Under the Stars',
      location: 'Manali',
      date: 'Dec 31,2024',
      description: 'An evening of smooth jazz and signature cocktails at our rooftop lounge',
      image: '/api/placeholder/400/200',
      badge: 'Active',
      ctaText: 'Details →',
      ctaLink: '#'
    },
    {
      id: 2,
      title: 'New Year\'s Eve Gala',
      location: 'Goa',
      date: 'Dec 31,2024',
      description: 'Ring in the new year with a grand celebration featuring live music and gourmet dining',
      image: '/api/placeholder/400/200',
      badge: 'Active',
      ctaText: 'Details →',
      ctaLink: '#'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      {/* Header */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm mb-3"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex items-center justify-between">
          <h2 
            className="text-base sm:text-lg font-semibold m-0"
            style={{ color: colors.textPrimary }}
          >
            Upcoming Events
          </h2>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors"
            style={{ 
              backgroundColor: colors.primary,
              color: '#ffffff'
            }}
          >
            <Plus size={16} />
            Add Upcoming Event
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {currentEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-lg overflow-hidden shadow-sm border"
              style={{ 
                backgroundColor: colors.mainBg,
                borderColor: colors.border
              }}
            >
              {/* Image Section */}
              <div className="relative h-48">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {/* Date Badge */}
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-medium"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#ffffff'
                  }}
                >
                  {event.date}
                </div>
                {/* Status Badge */}
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-medium"
                  style={{ 
                    backgroundColor: colors.success,
                    color: '#ffffff'
                  }}
                >
                  {event.badge}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} style={{ color: colors.textSecondary }} />
                    <span 
                      className="text-xs font-medium"
                      style={{ color: colors.textSecondary }}
                    >
                      {event.location}
                    </span>
                  </div>
                </div>

                <h3 
                  className="text-sm font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  {event.title}
                </h3>

                <p 
                  className="text-xs mb-3 line-clamp-2"
                  style={{ color: colors.textSecondary }}
                >
                  {event.description}
                </p>

                <button
                  className="w-full mb-2 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#ffffff'
                  }}
                >
                  {event.ctaText}
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(event)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded border text-xs font-medium transition-colors"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    backgroundColor: 'transparent'
                  }}
                >
                  <Edit size={14} />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                  style={{ 
                    backgroundColor: currentPage === index + 1 ? colors.primary : colors.mainBg,
                    color: currentPage === index + 1 ? '#ffffff' : colors.textPrimary,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {totalPages > 1 && (
          <div 
            className="text-center mt-3 text-xs"
            style={{ color: colors.textSecondary }}
          >
            Showing {startIndex + 1}-{Math.min(endIndex, events.length)} of {events.length} items
          </div>
        )}
      </div>

      {/* Modal - Add/Edit Event */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-lg p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: colors.contentBg }}
          >
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: colors.textPrimary }}
            >
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>

            <div className="space-y-4">
              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Event Title
                </label>
                <input
                  type="text"
                  defaultValue={editingEvent?.title}
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  placeholder="Jazz Night Under the Stars"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    defaultValue={editingEvent?.location}
                    className="w-full px-3 py-2 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.mainBg,
                      color: colors.textPrimary
                    }}
                    placeholder="Manali"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Event Date
                  </label>
                  <input
                    type="text"
                    defaultValue={editingEvent?.date}
                    className="w-full px-3 py-2 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.mainBg,
                      color: colors.textPrimary
                    }}
                    placeholder="Dec 31, 2024"
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Description
                </label>
                <textarea
                  defaultValue={editingEvent?.description}
                  rows={3}
                  className="w-full px-3 py-2 rounded border text-sm resize-none"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  placeholder="An evening of smooth jazz and signature cocktails..."
                />
              </div>

              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Status Badge
                </label>
                <select
                  defaultValue={editingEvent?.badge}
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Coming Soon">Coming Soon</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>

              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  CTA Button Text
                </label>
                <input
                  type="text"
                  defaultValue={editingEvent?.ctaText}
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  placeholder="Details →"
                />
              </div>

              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  CTA Link
                </label>
                <input
                  type="text"
                  defaultValue={editingEvent?.ctaLink}
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  placeholder="www.example.com"
                />
              </div>

              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded border text-sm font-medium transition-colors"
                style={{ 
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: 'transparent'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded text-sm font-medium transition-colors"
                style={{ 
                  backgroundColor: colors.primary,
                  color: '#ffffff'
                }}
              >
                {editingEvent ? 'Save Changes' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpcomingEvents;