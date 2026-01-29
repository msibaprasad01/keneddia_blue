import React, { useState, useEffect, useMemo } from 'react';
import { colors } from "@/lib/colors/colors";
import { Plus, Edit, MapPin, Sparkles, ChevronLeft, ChevronRight, Loader2, Calendar, Clock, Building2, Ticket, Search, Filter, Eye, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { getDailyOffers, updateDailyOfferStatus } from '@/Api/Api';
import { toast } from 'react-hot-toast';
import CreateOfferModal from '../../modals/CreateOfferModal';

// Note: Delete API commented out for now
// import { deleteDailyOfferById } from '@/Api/Api';

function DailyOffers() {
  const [allOffers, setAllOffers] = useState([]);
  const [pageTitle, setPageTitle] = useState('Exclusive Daily Offers');
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Frontend Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Filter state
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchOffers = async () => {
    try {
      setLoading(true);
      
      // Pass empty params or required params based on API signature
      const response = await getDailyOffers({
        targetType: 'GLOBAL',
        page: 0,
        size: 1000 // Fetch all for frontend pagination
      });

      console.log('API Response:', response);

      // Handle different response structures
      let offersData = [];
      
      if (response.data?.data?.offers) {
        setPageTitle(response.data.data.title || 'Exclusive Daily Offers');
        offersData = response.data.data.offers;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        offersData = response.data.data;
      } else if (response.data?.content) {
        offersData = response.data.content;
      } else if (Array.isArray(response.data)) {
        offersData = response.data;
      } else {
        offersData = [];
      }

      console.log('Offers data:', offersData);

      // Reverse the array so latest (highest ID) comes first
      const reversedOffers = [...offersData].reverse();
      setAllOffers(reversedOffers);
      
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Failed to load daily offers');
      setAllOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Filter and search logic (frontend)
  const filteredOffers = useMemo(() => {
    let result = [...allOffers];

    // Filter by property type
    if (filterType !== 'ALL') {
      result = result.filter(offer => {
        const types = offer.propertyTypes?.map(t => t.typeName?.toUpperCase()) || [];
        return types.includes(filterType.toUpperCase());
      });
    }

    // Filter by status
    if (filterStatus !== 'ALL') {
      const isActive = filterStatus === 'ACTIVE';
      result = result.filter(offer => offer.isActive === isActive);
    }

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(offer =>
        offer.title?.toLowerCase().includes(search) ||
        offer.propertyName?.toLowerCase().includes(search) ||
        offer.couponCode?.toLowerCase().includes(search) ||
        offer.locationName?.toLowerCase().includes(search)
      );
    }

    return result;
  }, [allOffers, filterType, filterStatus, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const paginatedOffers = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    return filteredOffers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOffers, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filterType, filterStatus, searchTerm]);

  const handleEdit = (offer) => {
    // Transform offer data for the modal
    const transformedOffer = {
      ...offer,
      imageMediaId: offer.image?.[0]?.mediaId || null,
      image: offer.image?.[0] ? {
        src: offer.image[0].url,
        alt: offer.image[0].alt,
        width: offer.image[0].width,
        height: offer.image[0].height
      } : null
    };
    setEditingOffer(transformedOffer);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingOffer(null);
    setShowModal(true);
  };

  const handleStatusToggle = async (offerId, currentStatus) => {
    try {
      setStatusUpdating(offerId);
      await updateDailyOfferStatus(offerId, !currentStatus);
      toast.success(`Offer ${!currentStatus ? 'activated' : 'deactivated'}`);
      setAllOffers(prev => prev.map(o => o.id === offerId ? { ...o, isActive: !currentStatus } : o));
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleDelete = async (offerId) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      // TODO: Uncomment when delete API is ready
      // await deleteDailyOfferById(offerId);
      
      // For now, just remove from local state
      toast.success('Offer deleted successfully');
      setAllOffers(prev => prev.filter(o => o.id !== offerId));
    } catch (error) {
      toast.error('Failed to delete offer');
    }
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return "No Expiry";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getImageUrl = (offer) => {
    // Handle array of images from API response
    if (offer.image && Array.isArray(offer.image) && offer.image.length > 0) {
      return offer.image[0].url;
    }
    // Handle single image object
    if (offer.image?.src) {
      return offer.image.src;
    }
    if (offer.image?.url) {
      return offer.image.url;
    }
    // Fallback
    return offer.imageUrl || '/api/placeholder/80/80';
  };

  const getPropertyType = (offer) => {
    if (offer.propertyTypes && Array.isArray(offer.propertyTypes) && offer.propertyTypes.length > 0) {
      return offer.propertyTypes.map(t => t.typeName).join(', ');
    }
    return offer.propertyType || 'N/A';
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (currentPage < 3) {
        for (let i = 0; i < 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage > totalPages - 4) {
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    return pages;
  };

  return (
    <div className="p-1">
      {/* Header Section */}
      <div className="rounded-xl p-5 shadow-sm mb-4 border border-border/50" style={{ backgroundColor: colors.contentBg }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold m-0" style={{ color: colors.textPrimary }}>{pageTitle}</h2>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
              Manage time-limited property discounts and deals • {filteredOffers.length} offers found
            </p>
          </div>
          
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus size={18} /> Add New Offer
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="rounded-xl p-4 shadow-sm mb-4 border border-border/50" style={{ backgroundColor: colors.contentBg }}>
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, property, coupon code, location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              style={{ borderColor: colors.border, backgroundColor: colors.mainBg }}
            />
          </div>

          {/* Property Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 rounded-lg border text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 min-w-[150px]"
            style={{ borderColor: colors.border, backgroundColor: colors.mainBg, color: colors.textPrimary }}
          >
            <option value="ALL">All Types</option>
            <option value="HOTEL">Hotels</option>
            <option value="RESTAURANT">Restaurants</option>
            <option value="CAFE">Cafes</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg border text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 min-w-[130px]"
            style={{ borderColor: colors.border, backgroundColor: colors.mainBg, color: colors.textPrimary }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="rounded-xl shadow-sm border overflow-hidden" style={{ backgroundColor: colors.contentBg, borderColor: colors.border }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 size={40} className="animate-spin" style={{ color: colors.primary }} />
            <span className="text-sm font-medium text-gray-500">Loading offers...</span>
          </div>
        ) : paginatedOffers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Sparkles size={48} className="text-gray-300" />
            <p className="text-gray-500 font-medium">No offers found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or add a new offer</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ backgroundColor: colors.mainBg, borderColor: colors.border }}>
                  <th className="text-left py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Image</th>
                  <th className="text-left py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Offer Details</th>
                  <th className="text-left py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Property</th>
                  <th className="text-left py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Coupon</th>
                  <th className="text-left py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Hours</th>
                  <th className="text-left py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Expires</th>
                  <th className="text-center py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="text-center py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOffers.map((offer, index) => (
                  <tr 
                    key={offer.id} 
                    className="border-b hover:bg-gray-50/50 transition-colors"
                    style={{ borderColor: colors.border }}
                  >
                    {/* Image */}
                    <td className="py-3 px-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img 
                          src={getImageUrl(offer)}
                          alt={offer.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/80/80';
                          }}
                        />
                      </div>
                    </td>

                    {/* Offer Details */}
                    <td className="py-3 px-4">
                      <div className="max-w-[250px]">
                        <h4 className="font-semibold text-sm mb-1 truncate" style={{ color: colors.textPrimary }}>
                          {offer.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {offer.description || 'No description'}
                        </p>
                      </div>
                    </td>

                    {/* Property */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Building2 size={12} className="text-primary" />
                          <span className="font-medium text-sm" style={{ color: colors.textPrimary }}>
                            {offer.propertyName || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={11} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{offer.locationName || 'N/A'}</span>
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded">
                          {getPropertyType(offer)}
                        </span>
                      </div>
                    </td>

                    {/* Coupon */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Ticket size={14} className="text-primary" />
                        <span className="font-mono font-bold text-sm text-primary">
                          {offer.couponCode || 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Hours */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock size={12} />
                        <span className="text-xs font-medium">{offer.availableHours || 'N/A'}</span>
                      </div>
                    </td>

                    {/* Expires */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-orange-500" />
                        <span className="text-xs font-medium text-orange-600">
                          {formatExpiryDate(offer.expiresAt)}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleStatusToggle(offer.id, offer.isActive)}
                        disabled={statusUpdating === offer.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                          offer.isActive 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        {statusUpdating === offer.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : offer.isActive ? (
                          <ToggleRight size={14} />
                        ) : (
                          <ToggleLeft size={14} />
                        )}
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="p-2 rounded-lg border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all"
                          title="Edit Offer"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id)}
                          className="p-2 rounded-lg border border-gray-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                          title="Delete Offer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredOffers.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-t" style={{ borderColor: colors.border, backgroundColor: colors.mainBg }}>
            {/* Info */}
            <div className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700">{currentPage * itemsPerPage + 1}</span> to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min((currentPage + 1) * itemsPerPage, filteredOffers.length)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{filteredOffers.length}</span> offers
            </div>

            {/* Page Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg border hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  style={{ borderColor: colors.border }}
                >
                  <ChevronLeft size={18} />
                </button>

                {getPageNumbers().map((page, idx) => (
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                          ? 'text-white shadow-md'
                          : 'border hover:bg-white'
                      }`}
                      style={{
                        backgroundColor: currentPage === page ? colors.primary : 'transparent',
                        borderColor: currentPage === page ? colors.primary : colors.border
                      }}
                    >
                      {page + 1}
                    </button>
                  )
                ))}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg border hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  style={{ borderColor: colors.border }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Items per page info */}
            <div className="text-xs text-gray-400">
              {itemsPerPage} items per page
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <CreateOfferModal
          isOpen={showModal}
          onClose={(refresh) => { 
            setShowModal(false); 
            setEditingOffer(null);
            if (refresh) fetchOffers(); 
          }}
          editingOffer={editingOffer}
        />
      )}
    </div>
  );
}

export default DailyOffers;