import React, { useState, useEffect } from 'react';
import { colors } from "@/lib/colors/colors";
import { Plus, Edit, MapPin, Sparkles, ChevronLeft, ChevronRight, Loader2, Calendar, Clock, Building2, Ticket } from 'lucide-react';
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

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await getDailyOffers({
        targetType,
        page: currentPage,
        size: itemsPerPage
      });

      if (response.data && response.data.data) {
        const { title, offers: offersList } = response.data.data;
        setPageTitle(title || 'Exclusive Daily Offers');
        setOffers(offersList || []);
        setTotalElements(offersList?.length || 0);
        setTotalPages(Math.ceil((offersList?.length || 0) / itemsPerPage));
      } else {
        // Fallback for different API structures
        const data = response.data.content || response.data;
        setOffers(Array.isArray(data) ? data : []);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || data.length);
      }
    } catch (error) {
      toast.error('Failed to load daily offers');
      setOffers([]);
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
      await updateDailyOfferStatus(offerId, !currentStatus);
      toast.success(`Offer ${!currentStatus ? 'activated' : 'deactivated'}`);
      setOffers(prev => prev.map(o => o.id === offerId ? { ...o, active: !currentStatus } : o));
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const formatExpiryDate = (dateString) => {
    if (!dateString) return "No Expiry";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-1">
      {/* Header Section */}
      <div className="rounded-xl p-5 shadow-sm mb-4 border border-border/50" style={{ backgroundColor: colors.contentBg }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold m-0" style={{ color: colors.textPrimary }}>{pageTitle}</h2>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Manage time-limited property discounts and deals</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={targetType}
              onChange={(e) => { setTargetType(e.target.value); setCurrentPage(0); }}
              className="px-4 py-2 rounded-lg border text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
              style={{ borderColor: colors.border, backgroundColor: colors.mainBg, color: colors.textPrimary }}
            >
              <option value="GLOBAL">All Categories</option>
              <option value="HOTEL">Hotels Only</option>
              <option value="RESTAURANT">Restaurants</option>
              <option value="CAFE">Cafes</option>
            </select>

            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: colors.primary }}
            >
              <Plus size={18} /> Add New Offer
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <Loader2 size={40} className="animate-spin" style={{ color: colors.primary }} />
          <span className="text-sm font-medium text-gray-500">Syncing offers...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div 
              key={offer.id} 
              className="group rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              style={{ borderColor: colors.border }}
            >
              {/* Image Header */}
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={offer.image?.src || offer.imageUrl || '/api/placeholder/400/300'} 
                  alt={offer.image?.alt || offer.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-md border border-white/10">
                    {offer.propertyType || 'PROMO'}
                  </span>
                </div>
                <button 
                  onClick={() => handleStatusToggle(offer.id, offer.active)}
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold shadow-lg border transition-colors ${offer.active ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'} text-white`}
                >
                  {statusUpdating === offer.id ? <Loader2 size={12} className="animate-spin" /> : (offer.active ? '● Active' : '○ Inactive')}
                </button>
              </div>

              {/* Offer Info */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <Building2 size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{offer.propertyName || 'General Kennedy Offer'}</span>
                </div>

                <h3 className="text-base font-bold mb-2 line-clamp-1" style={{ color: colors.textPrimary }}>{offer.title}</h3>
                <p className="text-xs line-clamp-2 mb-4 leading-relaxed" style={{ color: colors.textSecondary }}>{offer.description}</p>

                {/* Offer Specs Table */}
                <div className="grid grid-cols-2 gap-y-3 mb-5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Coupon Code</span>
                    <div className="flex items-center gap-1.5 text-primary font-mono text-xs font-bold">
                      <Ticket size={12} /> {offer.couponCode || 'N/A'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Location</span>
                    <div className="flex items-center gap-1.5 text-gray-700 text-xs font-medium">
                      <MapPin size={12} /> {offer.location || 'All Properties'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Hours</span>
                    <div className="flex items-center gap-1.5 text-gray-700 text-xs font-medium">
                      <Clock size={12} /> {offer.availableHours || 'Check Terms'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Expires On</span>
                    <div className="flex items-center gap-1.5 text-orange-600 text-xs font-medium">
                      <Calendar size={12} /> {formatExpiryDate(offer.expiresAt)}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-2 border-t pt-4" style={{ borderColor: colors.border }}>
                  <button 
                    onClick={() => handleEdit(offer)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-bold transition-all hover:bg-gray-50"
                    style={{ borderColor: colors.border, color: colors.textPrimary }}
                  >
                    <Edit size={14} /> Edit Offer
                  </button>
                  <div className="px-3 py-2 bg-primary/10 rounded-lg text-primary text-[10px] font-black uppercase whitespace-nowrap">
                    {offer.ctaText || 'Claim'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Container */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 0}
              className="p-2 rounded-lg border disabled:opacity-30 hover:bg-white transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-bold px-4">
              Page <span className="text-primary">{currentPage + 1}</span> of {totalPages}
            </span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-lg border disabled:opacity-30 hover:bg-white transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Total records: {totalElements}
          </p>
        </div>
      )}

      {showModal && (
        <CreateOfferModal
          isOpen={showModal}
          onClose={(refresh) => { setShowModal(false); if(refresh) fetchOffers(); }}
          editingOffer={editingOffer}
        />
      )}
    </div>
  );
}

export default DailyOffers;