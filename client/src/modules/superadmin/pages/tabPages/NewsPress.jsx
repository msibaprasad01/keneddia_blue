import React, { useState } from 'react';
import { colors } from "@/lib/colors/colors";
import { Plus, Edit, ChevronLeft, ChevronRight } from 'lucide-react';

function NewsPress() {
  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      category: 'PRESS',
      title: 'Expansion Plans for 2026',
      description: 'Announcing new locations in key cities across the country as we grow our footprint',
      badge: 'Oct 20,2025',
      badgeType: 'Restaurant',
      ctaText: 'Read Story →',
      ctaLink: '#',
      image: '/api/placeholder/400/200'
    },
    {
      id: 2,
      category: 'PRESS',
      title: 'Sustainability',
      description: 'Commitment to eco-friendly practices and reducing our carbon footprint.',
      badge: 'Oct 15,2025',
      badgeType: 'Restaurant',
      ctaText: 'Read Story →',
      ctaLink: '#',
      image: '/api/placeholder/400/200'
    },
    {
      id: 3,
      category: 'NEWS',
      title: 'Award Recognition',
      description: 'Kennedia Blu wins excellence in hospitality award for 2025',
      badge: 'Sep 30,2025',
      badgeType: 'Hotel',
      ctaText: 'Read Story →',
      ctaLink: '#',
      image: '/api/placeholder/400/200'
    },
    {
      id: 4,
      category: 'PRESS',
      title: 'New Partnership',
      description: 'Strategic partnership with leading travel agencies',
      badge: 'Sep 15,2025',
      badgeType: 'Restaurant',
      ctaText: 'Read Story →',
      ctaLink: '#',
      image: '/api/placeholder/400/200'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = newsItems.slice(startIndex, endIndex);

  const handleEdit = (news) => {
    setEditingNews(news);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingNews(null);
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
            News & Press
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
            Add New News
          </button>
        </div>
      </div>

      {/* News Grid */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {currentItems.map((news) => (
            <div
              key={news.id}
              className="rounded-lg overflow-hidden shadow-sm border"
              style={{ 
                backgroundColor: colors.mainBg,
                borderColor: colors.border
              }}
            >
              {/* Image Section */}
              <div className="relative h-48">
                <img
                  src={news.image}
                  alt={news.title}
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
                  {news.badge}
                </div>
                {/* Badge Type */}
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-medium"
                  style={{ 
                    backgroundColor: colors.success,
                    color: '#ffffff'
                  }}
                >
                  {news.badgeType}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                <div 
                  className="text-[10px] uppercase font-bold mb-2 tracking-wide"
                  style={{ color: colors.primary }}
                >
                  {news.category}
                </div>

                <h3 
                  className="text-sm font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  {news.title}
                </h3>

                <p 
                  className="text-xs mb-3 line-clamp-2"
                  style={{ color: colors.textSecondary }}
                >
                  {news.description}
                </p>

                <button
                  className="w-full mb-2 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                  style={{ 
                    backgroundColor: colors.warning,
                    color: '#ffffff'
                  }}
                >
                  {news.ctaText}
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(news)}
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
            Showing {startIndex + 1}-{Math.min(endIndex, newsItems.length)} of {newsItems.length} items
          </div>
        )}
      </div>

      {/* Modal - Add/Edit News */}
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
              {editingNews ? 'Edit News' : 'Add New News'}
            </h3>

            <div className="space-y-4">
              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Category
                </label>
                <select
                  defaultValue={editingNews?.category}
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                >
                  <option value="PRESS">PRESS</option>
                  <option value="NEWS">NEWS</option>
                  <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                </select>
              </div>

              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Title
                </label>
                <input
                  type="text"
                  defaultValue={editingNews?.title}
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  placeholder="Expansion Plans for 2026"
                />
              </div>

              <div>
                <label 
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Description
                </label>
                <textarea
                  defaultValue={editingNews?.description}
                  rows={3}
                  className="w-full px-3 py-2 rounded border text-sm resize-none"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  placeholder="Announcing new locations in key cities..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Date Badge
                  </label>
                  <input
                    type="text"
                    defaultValue={editingNews?.badge}
                    className="w-full px-3 py-2 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.mainBg,
                      color: colors.textPrimary
                    }}
                    placeholder="Oct 20, 2025"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Badge Type
                  </label>
                  <select
                    defaultValue={editingNews?.badgeType}
                    className="w-full px-3 py-2 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.mainBg,
                      color: colors.textPrimary
                    }}
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
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
                  defaultValue={editingNews?.ctaText}
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.mainBg,
                    color: colors.textPrimary
                  }}
                  placeholder="Read Story →"
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
                  defaultValue={editingNews?.ctaLink}
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
                {editingNews ? 'Save Changes' : 'Add News'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsPress;