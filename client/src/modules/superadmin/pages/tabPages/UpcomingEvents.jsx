import React, { useState, useEffect } from 'react';
import { colors } from "@/lib/colors/colors";
import { Plus, Edit, MapPin, ChevronLeft, ChevronRight, Loader2, Building2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CreateEventModal from '../../modals/CreateEventModal';

// Updated Static Data to match your new payload requirements
const STATIC_EVENTS = [
  {
    id: 1,
    title: "Jazz Night Under the Stars",
    slug: "jazz-night-under-the-stars",
    description: "An evening of smooth jazz and signature cocktails at our rooftop lounge.",
    eventDate: "2026-02-14",
    status: "ACTIVE",
    propertyType: "RESTAURANT",
    imageMediaUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80",
    ctaText: "Book Table",
    ctaLink: "https://example.com",
    location: { id: 101, name: "Rooftop Lounge" },
    active: true
  },
  {
    id: 2,
    title: "Summer Pool Party",
    slug: "summer-pool-party",
    description: "Cool off with the best DJs in town and refreshing summer drinks.",
    eventDate: "2026-06-20",
    status: "COMING_SOON",
    propertyType: "HOTEL",
    imageMediaUrl: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80",
    ctaText: "Get Tickets",
    ctaLink: "https://example.com",
    location: { id: 102, name: "Main Poolside" },
    active: true
  },
  {
    id: 3,
    title: "Gourmet Wine Tasting",
    slug: "gourmet-wine-tasting",
    description: "Experience a curated selection of fine wines paired with artisan cheeses.",
    eventDate: "2026-03-05",
    status: "SOLD_OUT",
    propertyType: "CAFE",
    imageMediaUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    ctaText: "Sold Out",
    ctaLink: "https://example.com",
    location: { id: 103, name: "Wine Cellar" },
    active: true
  }
];

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Simulate data fetch
  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setEvents(STATIC_EVENTS);
        setLoading(false);
      }, 500);
    };
    loadData();
  }, []);

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

  const handleCloseModal = (shouldRefresh) => {
    setShowModal(false);
    setEditingEvent(null);
    if (shouldRefresh) {
      toast.success(editingEvent ? "Event updated successfully" : "Event created successfully");
      // In a real app, you would call fetchEvents() here
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return colors.success;
      case 'COMING_SOON': return colors.warning;
      case 'SOLD_OUT': return colors.error;
      default: return colors.textSecondary;
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
          <h2 className="text-base sm:text-lg font-semibold m-0" style={{ color: colors.textPrimary }}>
            Upcoming Events
          </h2>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors"
            style={{ backgroundColor: colors.primary, color: '#ffffff' }}
          >
            <Plus size={16} /> Add Event
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="rounded-lg p-4 sm:p-5 shadow-sm" style={{ backgroundColor: colors.contentBg }}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin" style={{ color: colors.primary }} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {currentEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg overflow-hidden shadow-sm border flex flex-col"
                  style={{ backgroundColor: colors.mainBg, borderColor: colors.border }}
                >
                  {/* Image Section */}
                  <div className="relative h-48">
                    <img
                      src={event.imageMediaUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: colors.primary, color: '#ffffff' }}
                    >
                      {formatDate(event.eventDate)}
                    </div>
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: getStatusColor(event.status), color: '#ffffff' }}
                    >
                      {event.status.replace('_', ' ')}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} style={{ color: colors.textSecondary }} />
                        <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                          {event.location?.name || 'N/A'}
                        </span>
                      </div>
                      {event.propertyType && (
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold" style={{ color: colors.textSecondary }}>
                          <Building2 size={10} />
                          {event.propertyType}
                        </div>
                      )}
                    </div>

                    <h3 className="text-sm font-bold mb-2 line-clamp-1" style={{ color: colors.textPrimary }}>
                      {event.title}
                    </h3>

                    <p className="text-xs mb-4 line-clamp-2 flex-grow" style={{ color: colors.textSecondary }}>
                      {event.description}
                    </p>

                    <div className="space-y-2">
                      {event.ctaLink && (
                        <a 
                          href={event.ctaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-2 rounded text-xs font-bold text-center transition-colors"
                          style={{ backgroundColor: colors.primary, color: '#ffffff' }}
                        >
                          {event.ctaText || 'Learn More'}
                        </a>
                      )}

                      <button
                        onClick={() => handleEdit(event)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded border text-xs font-bold transition-colors hover:bg-gray-50"
                        style={{ borderColor: colors.border, color: colors.textPrimary }}
                      >
                        <Edit size={14} /> Edit Event
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t" style={{ borderColor: colors.border }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full border transition-all disabled:opacity-30 hover:bg-gray-50"
                  style={{ borderColor: colors.border, color: colors.textPrimary }}
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>
                  Page <span style={{ color: colors.primary }}>{currentPage}</span> of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full border transition-all disabled:opacity-30 hover:bg-gray-50"
                  style={{ borderColor: colors.border, color: colors.textPrimary }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <CreateEventModal
          isOpen={showModal}
          onClose={handleCloseModal}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
}

export default UpcomingEvents;