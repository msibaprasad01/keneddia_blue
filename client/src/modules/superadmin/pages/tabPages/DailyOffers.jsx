import React, { useState, useEffect } from 'react';
import { colors } from "@/lib/colors/colors";
import { Plus, Edit, MapPin, Sparkles, ChevronLeft, ChevronRight, Loader2, Calendar, Clock } from 'lucide-react';
import { getDailyOffers, updateDailyOfferStatus } from '@/Api/Api';
import { toast } from 'react-hot-toast';
import CreateOfferModal from '../../modals/CreateOfferModal';

function DailyOffers() {
  const [offers, setOffers] = useState([]);
  const [pageTitle, setPageTitle] = useState('Exclusive Daily Offers');
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 6;

  // Filter state
  const [targetType, setTargetType] = useState('GLOBAL'); 

  // Fetch offers
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await getDailyOffers({
        targetType,
        page: currentPage,
        size: itemsPerPage
      });

      console.log('API Response:', response.data);

      if (response.data) {
        // Handle recommended format: { success: true, data: { title, offers } }
        if (response.data.data) {
          const { title, offers: offersList } = response.data.data;
          setPageTitle(title || 'Exclusive Daily Offers');
          setOffers(offersList || []);
          // Calculate pagination from offers length if not provided
          setTotalElements(offersList?.length || 0);
          setTotalPages(Math.ceil((offersList?.length || 0) / itemsPerPage));
        } 
        // Handle paginated format: { content, totalPages, totalElements }
        else if (response.data.content) {
          const { content, totalPages: pages, totalElements: total } = response.data;
          setOffers(content || []);
          setTotalPages(pages || 0);
          setTotalElements(total || 0);
        }
        // Handle direct array
        else if (Array.isArray(response.data)) {
          setOffers(response.data);
          setTotalElements(response.data.length);
          setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        }
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Failed to load daily offers');
      setOffers([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [currentPage, targetType]);

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingOffer(null);
    setShowModal(true);
  };

  const handleStatusToggle = async (offerId, currentStatus) => {
    try {
      setStatusUpdating(offerId);
      const response = await updateDailyOfferStatus(offerId, !currentStatus);
      
      if (response.data) {
        toast.success(`Offer ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        // Update local state
        setOffers(prevOffers =>
          prevOffers.map(offer =>
            offer.id === offerId ? { ...offer, active: !currentStatus } : offer
          )
        );
      }
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast.error('Failed to update offer status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setShowModal(false);
    setEditingOffer(null);
    if (shouldRefresh) {
      fetchOffers();
    }
  };

  const formatExpiryDate = (expiresAt) => {
    if (!expiresAt) return null;
    try {
      const date = new Date(expiresAt);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric' 
      });
    } catch {
      return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm mb-3"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 
            className="text-base sm:text-lg font-semibold m-0"
            style={{ color: colors.textPrimary }}
          >
            {pageTitle}
          </h2>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Target Type Filter */}
            <select
              value={targetType}
              onChange={(e) => {
                setTargetType(e.target.value);
                setCurrentPage(0);
              }}
              className="px-3 py-1.5 rounded-md border text-xs sm:text-sm outline-none"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
            >
              <option value="GLOBAL">Global Offers</option>
              <option value="LOCATION">Location Offers</option>
              <option value="PROPERTY">Property Offers</option>
            </select>

            <button
              onClick={handleAddNew}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              style={{ 
                backgroundColor: colors.primary,
                color: '#ffffff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
            >
              <Plus size={16} />
              Add Offer
            </button>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="animate-spin" style={{ color: colors.primary }} />
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Loading offers...
              </p>
            </div>
          </div>
        ) : offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Sparkles size={48} style={{ color: colors.border }} className="mb-3" />
            <p className="text-base font-medium mb-1" style={{ color: colors.textPrimary }}>
              No offers found
            </p>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              Create your first daily offer to get started
            </p>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              style={{ 
                backgroundColor: colors.primary,
                color: '#ffffff'
              }}
            >
              <Plus size={16} />
              Add First Offer
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-lg overflow-hidden shadow-sm border transition-all"
                  style={{ 
                    backgroundColor: colors.mainBg,
                    borderColor: colors.border,
                    opacity: offer.active ? 1 : 0.6
                  }}
                >
                  {/* Image Section */}
                  <div className="relative h-48">
                    <img
                      src={offer.image?.src || offer.imageUrl || '/api/placeholder/400/200'}
                      alt={offer.image?.alt || offer.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Active/Inactive Badge */}
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-medium cursor-pointer"
                      style={{ 
                        backgroundColor: offer.active ? colors.success : colors.error,
                        color: '#ffffff'
                      }}
                      onClick={() => handleStatusToggle(offer.id, offer.active)}
                    >
                      {statusUpdating === offer.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        offer.active ? 'Active' : 'Inactive'
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 
                        className="text-sm font-semibold m-0 line-clamp-2"
                        style={{ color: colors.textPrimary }}
                      >
                        {offer.title}
                      </h3>
                    </div>

                    {/* Description */}
                    {offer.description && (
                      <p 
                        className="text-xs mb-3 line-clamp-2"
                        style={{ color: colors.textSecondary }}
                      >
                        {offer.description}
                      </p>
                    )}

                    {/* Location */}
                    {offer.location && (
                      <div 
                        className="flex items-center gap-1.5 mb-3 text-xs"
                        style={{ color: colors.textSecondary }}
                      >
                        <MapPin size={14} />
                        <span>{offer.location}</span>
                      </div>
                    )}

                    {/* Coupon Code */}
                    {offer.couponCode && (
                      <div className="mb-3">
                        <div 
                          className="text-[10px] uppercase font-medium mb-1"
                          style={{ color: colors.textSecondary }}
                        >
                          Coupon Code
                        </div>
                        <div 
                          className="inline-block px-2.5 py-1 rounded text-xs font-semibold"
                          style={{ 
                            backgroundColor: colors.primary + '15',
                            color: colors.primary,
                            border: `1px dashed ${colors.primary}`
                          }}
                        >
                          {offer.couponCode}
                        </div>
                      </div>
                    )}

                    {/* Expiry and Available Hours */}
                    <div className="flex flex-wrap gap-3 mb-3">
                      {offer.expiresAt && (
                        <div 
                          className="flex items-center gap-1.5 text-[11px]"
                          style={{ color: colors.textSecondary }}
                        >
                          <Calendar size={12} />
                          <span>Expires: {formatExpiryDate(offer.expiresAt)}</span>
                        </div>
                      )}
                      {offer.availableHours && (
                        <div 
                          className="flex items-center gap-1.5 text-[11px]"
                          style={{ color: colors.textSecondary }}
                        >
                          <Clock size={12} />
                          <span>{offer.availableHours}</span>
                        </div>
                      )}
                    </div>

                    {/* CTA Text */}
                    {offer.ctaText && (
                      <div 
                        className="flex items-center gap-1.5 mb-3 text-xs"
                        style={{ color: colors.primary }}
                      >
                        <Sparkles size={14} />
                        <span className="line-clamp-1">{offer.ctaText} →</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded border text-xs font-medium transition-colors"
                        style={{ 
                          borderColor: colors.border,
                          color: colors.textPrimary,
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.border;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleStatusToggle(offer.id, offer.active)}
                        disabled={statusUpdating === offer.id}
                        className="px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50"
                        style={{ 
                          backgroundColor: offer.active ? colors.error : colors.success,
                          color: '#ffffff'
                        }}
                      >
                        {statusUpdating === offer.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          offer.active ? 'Deactivate' : 'Activate'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
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
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = index;
                    } else if (currentPage < 3) {
                      pageNum = index;
                    } else if (currentPage > totalPages - 3) {
                      pageNum = totalPages - 5 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                        style={{ 
                          backgroundColor: currentPage === pageNum ? colors.primary : colors.mainBg,
                          color: currentPage === pageNum ? '#ffffff' : colors.textPrimary,
                          border: `1px solid ${colors.border}`
                        }}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
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
            {totalElements > 0 && (
              <div 
                className="text-center mt-3 text-xs"
                style={{ color: colors.textSecondary }}
              >
                Showing {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, totalElements)} of {totalElements} offers
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CreateOfferModal
          isOpen={showModal}
          onClose={handleModalClose}
          editingOffer={editingOffer}
        />
      )}
    </div>
  );
}

export default DailyOffers;