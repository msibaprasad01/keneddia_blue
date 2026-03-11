import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  MessageSquare,
  Send,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  CornerDownRight,
  AlertTriangle,
  Search,
  X,
  Building2,
  SlidersHorizontal,
} from "lucide-react";
import {
  addCommentReply,
  getCommentThread,
  getCommentsByProperty,
  deleteComment,
  toggleCommentStatus,
  toggleCommentReplyStatus,
} from "@/Api/Api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const AVATAR_COLORS = [
  "bg-violet-500", "bg-sky-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-indigo-500",
];

function avatarColor(name = "") {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">Are you sure?</h4>
            <p className="text-xs text-gray-500">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reply Row ────────────────────────────────────────────────────────────────

function ReplyRow({ reply, onToggle, togglingId }) {
  const isToggling = togglingId === `reply-${reply.id}`;
  return (
    <div
      className={`flex items-start gap-2.5 py-3 px-3 rounded-xl transition-all ${
        reply.enabled ? "bg-slate-50" : "bg-gray-50 opacity-60"
      }`}
    >
      <CornerDownRight className="w-3.5 h-3.5 text-slate-300 mt-1 shrink-0" />
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${
          reply.adminReply ? "bg-violet-600" : avatarColor(reply.name)
        }`}
      >
        {getInitials(reply.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-xs font-semibold text-gray-800">{reply.name}</span>
          {reply.adminReply && (
            <span className="text-[9px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide">
              Staff
            </span>
          )}
          {!reply.enabled && (
            <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide">
              Hidden
            </span>
          )}
          <span className="text-[11px] text-gray-400 ml-auto">{formatDate(reply.createdAt)}</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">{reply.message}</p>
      </div>
      <button
        onClick={() => onToggle(reply.id)}
        disabled={isToggling}
        title={reply.enabled ? "Hide reply" : "Show reply"}
        className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all shrink-0"
      >
        {isToggling ? (
          <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />
        ) : reply.enabled ? (
          <Eye className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <EyeOff className="w-3.5 h-3.5 text-gray-400" />
        )}
      </button>
    </div>
  );
}

// ─── Comment Card ─────────────────────────────────────────────────────────────

function CommentCard({ comment, onToggle, onDelete, onReply, togglingId, deletingId }) {
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyName, setReplyName] = useState("Customer Support");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  const isToggling = togglingId === `comment-${comment.id}`;
  const isDeleting = deletingId === comment.id;

  const loadReplies = async () => {
    if (expanded) { setExpanded(false); return; }
    setLoadingReplies(true);
    try {
      const res = await getCommentThread(comment.id);
      setReplies(res.data?.replies || []);
    } catch {
      // silent
    } finally {
      setLoadingReplies(false);
      setExpanded(true);
    }
  };

  const handleReplyToggle = async (replyId) => {
    await onToggle(`reply-${replyId}`, replyId, "reply");
    try {
      const res = await getCommentThread(comment.id);
      setReplies(res.data?.replies || []);
    } catch {}
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !replyName.trim()) return;
    setSubmittingReply(true);
    try {
      await onReply(comment.id, replyName, replyText);
      setReplyText("");
      setReplyName("Customer Support");
      setShowReplyBox(false);
      const res = await getCommentThread(comment.id);
      setReplies(res.data?.replies || []);
      setExpanded(true);
    } catch {
      // silent
    } finally {
      setSubmittingReply(false);
    }
  };

  const replyCount = replies.length || comment.replies?.length || 0;

  return (
    <div
      className={`rounded-2xl border transition-all ${
        comment.enabled
          ? "bg-white border-gray-100 shadow-sm"
          : "bg-gray-50 border-gray-100 opacity-60"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarColor(comment.name)}`}
          >
            {getInitials(comment.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-semibold text-gray-800">{comment.name}</span>
              {!comment.enabled && (
                <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide">
                  Hidden
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{comment.message}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
          <button
            onClick={loadReplies}
            disabled={loadingReplies}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
          >
            {loadingReplies ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </button>

          <button
            onClick={() => setShowReplyBox((s) => !s)}
            className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 px-2.5 py-1.5 rounded-lg hover:bg-violet-50 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Reply
          </button>

          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => onToggle(`comment-${comment.id}`, comment.id, "comment")}
              disabled={isToggling}
              title={comment.enabled ? "Hide comment" : "Show comment"}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-all"
            >
              {isToggling ? (
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              ) : comment.enabled ? (
                <Eye className="w-4 h-4 text-emerald-500" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              disabled={isDeleting}
              title="Delete comment"
              className="p-1.5 rounded-lg hover:bg-red-50 transition-all"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
              )}
            </button>
          </div>
        </div>

        {/* Reply Box */}
        {showReplyBox && (
          <div className="mt-3 flex gap-2 items-start animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
              {getInitials(replyName) || "A"}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Reply name (e.g. Customer Support)"
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 bg-white"
              />
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Write a staff reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 bg-white"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || !replyName.trim() || submittingReply}
                  className="px-3 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 transition-all"
                >
                  {submittingReply ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Replies Thread */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {replies.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-3">No replies yet</p>
          ) : (
            replies.map((reply) => (
              <ReplyRow
                key={reply.id}
                reply={reply}
                onToggle={handleReplyToggle}
                togglingId={togglingId}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  return (
    <div className="flex items-center justify-between px-1 py-4 border-t border-gray-100">
      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-600">{startIndex}–{endIndex}</span> of{" "}
        <span className="font-semibold text-gray-600">{totalItems}</span> comments
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
              page === currentPage
                ? "bg-violet-600 text-white shadow-sm"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

function CommentReviewsTab({ propertyId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | enabled | hidden
  const [sortOrder, setSortOrder] = useState("newest"); // newest | oldest

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const searchInputRef = useRef(null);

  const fetchComments = useCallback(async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const res = await getCommentsByProperty(propertyId);
      setComments(res.data || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortOrder]);

  // ── Handlers ──

  const handleToggle = async (key, id, type) => {
    setTogglingId(key);
    try {
      if (type === "comment") {
        const comment = comments.find((c) => c.id === id);
        await toggleCommentStatus({ commentId: id, enabled: !comment?.enabled });
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
        );
      } else if (type === "reply") {
        await toggleCommentReplyStatus(id);
      }
    } catch {
      // silent
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete);
    setConfirmDelete(null);
    try {
      await deleteComment(confirmDelete);
      setComments((prev) => prev.filter((c) => c.id !== confirmDelete));
    } catch {
      // silent
    } finally {
      setDeletingId(null);
    }
  };

  const handleReply = async (commentId, name, message) => {
    await addCommentReply({ parentcommentId: commentId, name, message });
  };

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  // ── Derived data ──

  const filteredComments = comments
    .filter((c) => {
      if (statusFilter === "enabled") return c.enabled;
      if (statusFilter === "hidden") return !c.enabled;
      return true;
    })
    .filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.message?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt);
      const db = new Date(b.createdAt);
      return sortOrder === "newest" ? db - da : da - db;
    });

  const totalPages = Math.ceil(filteredComments.length / ITEMS_PER_PAGE);
  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const enabledCount = comments.filter((c) => c.enabled).length;
  const hiddenCount = comments.filter((c) => !c.enabled).length;
  const hasActiveFilters = searchQuery || statusFilter !== "all" || sortOrder !== "newest";

  return (
    <>
      <div className="space-y-4">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-violet-600" />
              <h3 className="text-sm font-bold text-gray-900">Comments</h3>
              <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">
                {comments.length}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage and moderate all comments for this property
            </p>
          </div>
          <button
            onClick={fetchComments}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* ── Search + Filters Bar ── */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-gray-200 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 bg-white"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 bg-white text-gray-600 cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {/* ── Status Filter Tabs ── */}
        <div className="flex items-center gap-1 flex-wrap">
          {[
            { key: "all", label: "All", count: comments.length },
            { key: "enabled", label: "Visible", count: enabledCount },
            { key: "hidden", label: "Hidden", count: hiddenCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === tab.key
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.key === "enabled" && <CheckCircle2 className="w-3 h-3" />}
              {tab.key === "hidden" && <XCircle className="w-3 h-3" />}
              {tab.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  statusFilter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}

          {/* Active filter indicator */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setSortOrder("newest");
              }}
              className="ml-auto flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 px-2 py-1.5 rounded-lg hover:bg-violet-50 transition-all"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>

        {/* ── Results summary when filtering ── */}
        {(searchQuery || statusFilter !== "all") && !loading && (
          <p className="text-xs text-gray-400">
            {filteredComments.length === 0
              ? "No comments match your filters"
              : `${filteredComments.length} comment${filteredComments.length !== 1 ? "s" : ""} found`}
          </p>
        )}

        {/* ── Comment List ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
            <p className="text-xs text-gray-400">Loading comments...</p>
          </div>
        ) : paginatedComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <MessageSquare className="w-10 h-10 text-gray-200" />
            <p className="text-sm font-medium text-gray-400">
              {hasActiveFilters ? "No comments match your filters" : "No comments yet"}
            </p>
            <p className="text-xs text-gray-300">
              {hasActiveFilters
                ? "Try adjusting your search or filter"
                : "Comments on this property will appear here"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); setSortOrder("newest"); }}
                className="mt-1 text-xs text-violet-600 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onToggle={handleToggle}
                onDelete={(id) => setConfirmDelete(id)}
                onReply={handleReply}
                togglingId={togglingId}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && filteredComments.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredComments.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <ConfirmDialog
          message="This will permanently delete the comment and all its replies. This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  );
}

export default CommentReviewsTab;