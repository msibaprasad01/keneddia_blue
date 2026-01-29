import React, { useState, useEffect } from "react";
import { colors } from "@/lib/colors/colors";
import {
  Plus,
  Edit,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
  Calendar,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import CreateEventModal from "../../modals/CreateEventModal";
import { getEventsUpdated } from "@/Api/Api";

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getEventsUpdated();
      console.log("Events Updated API full response:", res);
      console.log("Events Updated API data:", res.data);
      
      if (res?.data && Array.isArray(res.data)) {
        // Filter only active events
        const activeEvents = res.data.filter((event) => event.active);
        setEvents(activeEvents);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

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
      toast.success(
        editingEvent
          ? "Event updated successfully"
          : "Event created successfully",
      );
      fetchEvents(); // Refresh the events list
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      ACTIVE: colors.success,
      COMING_SOON: colors.warning,
      SOLD_OUT: colors.error,
      CANCELLED: colors.textSecondary,
    };

    return (
      <span
        className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-block"
        style={{
          backgroundColor: statusColors[status] || colors.textSecondary,
          color: "#ffffff",
        }}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div
        className="rounded-lg p-4 sm:p-5 shadow-sm mb-3"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-base sm:text-lg font-semibold m-0"
              style={{ color: colors.textPrimary }}
            >
              Upcoming Events
            </h2>
            <p
              className="text-xs mt-1 mb-0"
              style={{ color: colors.textSecondary }}
            >
              Manage and track all upcoming events across properties
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors"
            style={{ backgroundColor: colors.primary, color: "#ffffff" }}
          >
            <Plus size={16} /> Add Event
          </button>
        </div>
      </div>

      {/* Table View */}
      <div
        className="rounded-lg shadow-sm overflow-hidden"
        style={{ backgroundColor: colors.contentBg }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2
              size={32}
              className="animate-spin"
              style={{ color: colors.primary }}
            />
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Calendar
              size={48}
              style={{ color: colors.textSecondary }}
              className="mb-3 opacity-50"
            />
            <p
              className="text-sm font-medium mb-1"
              style={{ color: colors.textPrimary }}
            >
              No events found
            </p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              Create your first event to get started
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      backgroundColor: colors.mainBg,
                      borderColor: colors.border,
                    }}
                  >
                    <th
                      className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
                      style={{ color: colors.textSecondary }}
                    >
                      Image
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
                      style={{ color: colors.textSecondary }}
                    >
                      Event Details
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
                      style={{ color: colors.textSecondary }}
                    >
                      Location
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
                      style={{ color: colors.textSecondary }}
                    >
                      Property Type
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
                      style={{ color: colors.textSecondary }}
                    >
                      Date
                    </th>
                    <th
                      className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
                      style={{ color: colors.textSecondary }}
                    >
                      Status
                    </th>
                    <th
                      className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider"
                      style={{ color: colors.textSecondary }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEvents.map((event, index) => (
                    <tr
                      key={event.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                      style={{ borderColor: colors.border }}
                    >
                      {/* Image */}
                      <td className="px-4 py-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border" style={{ borderColor: colors.border }}>
                          {event.image?.url ? (
                            <img
                              src={event.image.url}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{ backgroundColor: colors.mainBg }}
                            >
                              <ImageIcon size={20} style={{ color: colors.textSecondary }} />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Event Details */}
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <h3
                            className="text-sm font-bold mb-1 line-clamp-1"
                            style={{ color: colors.textPrimary }}
                          >
                            {event.title}
                          </h3>
                          <p
                            className="text-xs line-clamp-2 mb-1"
                            style={{ color: colors.textSecondary }}
                          >
                            {event.description}
                          </p>
                          {event.ctaLink && (
                            <a
                              href={event.ctaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                              style={{ color: colors.primary }}
                            >
                              {event.ctaText || "View Details"}
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} style={{ color: colors.textSecondary }} />
                          <span
                            className="text-xs font-medium"
                            style={{ color: colors.textPrimary }}
                          >
                            {event.locationName}
                          </span>
                        </div>
                      </td>

                      {/* Property Type */}
                      <td className="px-4 py-3">
                        <div
                          className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-[10px] font-bold"
                          style={{ color: colors.textSecondary }}
                        >
                          <Building2 size={10} />
                          {event.typeName}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-medium"
                          style={{ color: colors.textPrimary }}
                        >
                          {formatDate(event.eventDate)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">{getStatusBadge(event.status)}</td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="p-2 rounded border transition-colors hover:bg-gray-100"
                            style={{
                              borderColor: colors.border,
                              color: colors.textPrimary,
                            }}
                            title="Edit Event"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-3">
              {currentEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border p-4"
                  style={{
                    backgroundColor: colors.mainBg,
                    borderColor: colors.border,
                  }}
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0" style={{ borderColor: colors.border }}>
                      {event.image?.url ? (
                        <img
                          src={event.image.url}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: colors.contentBg }}
                        >
                          <ImageIcon size={24} style={{ color: colors.textSecondary }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3
                        className="text-sm font-bold mb-1"
                        style={{ color: colors.textPrimary }}
                      >
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={12} style={{ color: colors.textSecondary }} />
                        <span
                          className="text-xs"
                          style={{ color: colors.textSecondary }}
                        >
                          {event.locationName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{ color: colors.textSecondary }}
                        >
                          <Building2 size={10} />
                          {event.typeName}
                        </div>
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                  </div>

                  <p
                    className="text-xs mb-2 line-clamp-2"
                    style={{ color: colors.textSecondary }}
                  >
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: colors.border }}>
                    <span
                      className="text-xs font-medium"
                      style={{ color: colors.textPrimary }}
                    >
                      {formatDate(event.eventDate)}
                    </span>
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-colors hover:bg-gray-50"
                      style={{
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                    >
                      <Edit size={12} /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                className="flex items-center justify-between px-4 sm:px-6 py-4 border-t"
                style={{ borderColor: colors.border }}
              >
                <div
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  Showing {startIndex + 1} to {Math.min(endIndex, events.length)} of{" "}
                  {events.length} events
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border transition-all disabled:opacity-30 hover:bg-gray-50"
                    style={{
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div
                    className="text-xs font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    Page{" "}
                    <span style={{ color: colors.primary }}>{currentPage}</span>{" "}
                    of {totalPages}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border transition-all disabled:opacity-30 hover:bg-gray-50"
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