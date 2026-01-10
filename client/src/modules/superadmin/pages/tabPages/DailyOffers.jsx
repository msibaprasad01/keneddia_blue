import React, { useState } from 'react';
import { colors } from "@/lib/colors/colors";
import { Plus, Edit, MapPin, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

function DailyOffers() {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: 'Winter Alpine Retreat',
      location: 'Manali',
      code: 'WINTER2025',
      image: '/api/placeholder/400/200',
      badge: 'Hotel',
      ctaText: 'Explore Winter Stay',
      ctaLink: '#'
    },
    {
      id: 2,
      title: 'Luxury Spa Weekend',
      location: 'Udaipur',
      code: 'SPA2025',
      image: '/api/placeholder/400/200',
      badge: 'Restaurant',
      ctaText: 'Book Spa Package',
      ctaLink: '#'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination
  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOffers = offers.slice(startIndex, endIndex);

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingOffer(null);
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
            Exclusive Daily Offers
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
            Add New Offer
          </button>
        </div>
      </div>

      {/* Offers Grid */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {currentOffers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-lg overflow-hidden shadow-sm border"
              style={{ 
                backgroundColor: colors.mainBg,
                borderColor: colors.border
              }}
            >
              {/* Image Section */}
              <div className="relative h-48">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                {/* Badge */}
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-medium"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#ffffff'
                  }}
                >
                  {offer.badge}
                </div>
                {/* Active Badge */}
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-medium"
                  style={{ 
                    backgroundColor: colors.success,
                    color: '#ffffff'
                  }}
                >
                  Active
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 
                    className="text-sm font-semibold m-0"
                    style={{ color: colors.textPrimary }}
                  >
                    {offer.title}
                  </h3>
                </div>

                <div 
                  className="flex items-center gap-1.5 mb-3 text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  <MapPin size={14} />
                  <span>{offer.location}</span>
                </div>

                <div className="mb-3">
                  <div 
                    className="text-[10px] uppercase font-medium mb-1"
                    style={{ color: colors.textSecondary }}
                  >
                    Code
                  </div>
                  <div 
                    className="text-xs font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {offer.code}
                  </div>
                </div>

                <div 
                  className="flex items-center gap-1.5 mb-3 text-xs"
                  style={{ color: colors.primary }}
                >
                  <Sparkles size={14} />
                  <span>{offer.ctaText} →</span>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(offer)}
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
            Showing {startIndex + 1}-{Math.min(endIndex, offers.length)} of {offers.length} items
          </div>
        )}
      </div>

      {/* Modal - Add/Edit Offer */}
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
              {editingOffer ? 'Edit Offer' : 'Add New Offer'}
            </h3>

            <div className="space-y-4">
              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Offer Title
                </label>
                <input
                  type="text"
                  defaultValue={editingOffer?.title}
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  placeholder="Winter Alpine Retreat"
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
                    defaultValue={editingOffer?.location}
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
                    Offer Code
                  </label>
                  <input
                    type="text"
                    defaultValue={editingOffer?.code}
                    className="w-full px-3 py-2 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.mainBg,
                      color: colors.textPrimary
                    }}
                    placeholder="WINTER2025"
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Badge Type
                </label>
                <select
                  defaultValue={editingOffer?.badge}
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Spa">Spa</option>
                  <option value="Event">Event</option>
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
                  defaultValue={editingOffer?.ctaText}
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  placeholder="Explore Winter Stay"
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
                  defaultValue={editingOffer?.ctaLink}
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
                {editingOffer ? 'Save Changes' : 'Add Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyOffers;