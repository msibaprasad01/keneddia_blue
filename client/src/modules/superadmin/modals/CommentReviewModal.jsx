import React, { useState, useEffect, useRef } from "react";
import {
  X,
  MessageSquare,
  Send,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  CornerDownRight,
  AlertTriangle,
} from "lucide-react";
import {
  addCommentReply,
  getCommentThread,
  getCommentsByNews,
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
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

// ─── Reply Row ─────────────────────────────────────────────────────────────────

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

function CommentCard({
  comment,
  onToggle,
  onDelete,
  onReply,
  togglingId,
  deletingId,
}) {
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
    // Refresh replies after toggle
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
      // Refresh replies
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
      {/* Main Comment */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarColor(comment.name)}`}
          >
            {getInitials(comment.name)}
          </div>

          {/* Content */}
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
          {/* Replies toggle */}
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

          {/* Reply button */}
          <button
            onClick={() => setShowReplyBox((s) => !s)}
            className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 px-2.5 py-1.5 rounded-lg hover:bg-violet-50 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Reply
          </button>

          <div className="flex items-center gap-1 ml-auto">
            {/* Toggle visibility */}
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

            {/* Delete */}
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

// ─── Main Modal ───────────────────────────────────────────────────────────────

function CommentReviewModal({ isOpen, onClose, news }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // commentId
  const [filter, setFilter] = useState("all"); // all | enabled | hidden

  const fetchComments = async () => {
    if (!news?.id) return;
    setLoading(true);
    try {
      const res = await getCommentsByNews(news.id);
      setComments(res.data || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchComments();
  }, [isOpen, news?.id]);

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

  const filteredComments = comments.filter((c) => {
    if (filter === "enabled") return c.enabled;
    if (filter === "hidden") return !c.enabled;
    return true;
  });

  const enabledCount = comments.filter((c) => c.enabled).length;
  const hiddenCount = comments.filter((c) => !c.enabled).length;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-violet-600 shrink-0" />
                <h2 className="text-base font-bold text-gray-900">Comments</h2>
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">
                  {comments.length}
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate">{news?.title}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={fetchComments}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-6 py-3 border-b border-gray-50">
            {[
              { key: "all", label: "All", count: comments.length },
              { key: "enabled", label: "Visible", count: enabledCount },
              { key: "hidden", label: "Hidden", count: hiddenCount },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === tab.key
                    ? "bg-violet-600 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    filter === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}

            {/* Stats */}
            <div className="ml-auto flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {enabledCount} visible
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-gray-400" />
                {hiddenCount} hidden
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
                <p className="text-xs text-gray-400">Loading comments...</p>
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <MessageSquare className="w-10 h-10 text-gray-200" />
                <p className="text-sm font-medium text-gray-400">No comments found</p>
                <p className="text-xs text-gray-300">
                  {filter !== "all" ? "Try switching the filter above" : "No comments on this article yet"}
                </p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onToggle={handleToggle}
                  onDelete={(id) => setConfirmDelete(id)}
                  onReply={handleReply}
                  togglingId={togglingId}
                  deletingId={deletingId}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing {filteredComments.length} of {comments.length} comments
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
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

export default CommentReviewModal;