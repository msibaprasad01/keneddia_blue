import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, User, Calendar, Share2, Clock,
  Facebook, Twitter, Linkedin, Mail, Instagram, Youtube, Globe,
  ChevronLeft, ChevronRight, MessageCircle, Reply, ThumbsUp,
  Send, MapPin, Star, ExternalLink
} from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import NotFound from "./not-found";

// ============================================
// AUTHOR PROFILES DATA
// ============================================
interface AuthorProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    email?: string;
  };
}

const AUTHOR_PROFILES: AuthorProfile[] = [
  {
    id: "kennedia-team",
    name: "Kennedia Editorial Team",
    role: "Luxury Hospitality Experts",
    bio: "Dedicated to sharing the latest milestones and luxury insights from the Kennedia collection. Our team brings together hospitality experts, travel writers, and industry veterans.",
    socialLinks: {
      website: "https://kennedia.com",
      twitter: "https://twitter.com/kennediahotels",
      linkedin: "https://linkedin.com/company/kennedia",
      facebook: "https://facebook.com/kennediahotels",
      instagram: "https://instagram.com/kennediahotels",
    }
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    role: "Senior Travel Editor",
    bio: "With over 15 years in luxury hospitality journalism, Sarah brings insider knowledge and a passion for sustainable travel to every story.",
    socialLinks: {
      twitter: "https://twitter.com/sarahjohnson",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      instagram: "https://instagram.com/sarahtravels",
      email: "sarah@kennedia.com",
    }
  },
  {
    id: "michael-chen",
    name: "Michael Chen",
    role: "Hospitality Correspondent",
    bio: "Michael specializes in covering luxury hotel openings, industry trends, and the intersection of technology and hospitality.",
    socialLinks: {
      twitter: "https://twitter.com/michaelchen",
      linkedin: "https://linkedin.com/in/michaelchen",
      youtube: "https://youtube.com/@michaelchentravels",
    }
  },
  {
    id: "emma-williams",
    name: "Emma Williams",
    role: "Sustainability Editor",
    bio: "Emma is passionate about eco-friendly luxury and covers sustainable initiatives across the hospitality industry.",
    socialLinks: {
      website: "https://emmawilliams.com",
      twitter: "https://twitter.com/emmawilliams",
      instagram: "https://instagram.com/sustainableluxury",
      linkedin: "https://linkedin.com/in/emmawilliams",
    }
  }
];

// ============================================
// PROPERTIES DATA (For sidebar slider)
// ============================================
interface Property {
  id: string;
  name: string;
  location: string;
  image: { src: string; alt: string };
  rating: number;
  link: string;
  highlights: string[];
}

const PROPERTIES: Property[] = [
  {
    id: "kennedia-blu-maldives",
    name: "Kennedia Blu Maldives",
    location: "North Malé Atoll, Maldives",
    image: { src: "/images/hotels/maldives.jpg", alt: "Kennedia Blu Maldives" },
    rating: 5,
    link: "/hotels/kennedia-blu-maldives",
    highlights: ["Overwater Villas", "Private Beach", "Spa & Wellness"]
  },
  {
    id: "kennedia-grand-paris",
    name: "Kennedia Grand Paris",
    location: "8th Arrondissement, Paris",
    image: { src: "/images/hotels/paris.jpg", alt: "Kennedia Grand Paris" },
    rating: 5,
    link: "/hotels/kennedia-grand-paris",
    highlights: ["Eiffel Tower Views", "Michelin Restaurant", "Art Collection"]
  },
  {
    id: "kennedia-resort-bali",
    name: "Kennedia Resort Bali",
    location: "Ubud, Bali, Indonesia",
    image: { src: "/images/hotels/bali.jpg", alt: "Kennedia Resort Bali" },
    rating: 5,
    link: "/hotels/kennedia-resort-bali",
    highlights: ["Rice Terrace Views", "Yoga Retreat", "Infinity Pool"]
  },
  {
    id: "kennedia-palace-dubai",
    name: "Kennedia Palace Dubai",
    location: "Palm Jumeirah, Dubai",
    image: { src: "/images/hotels/dubai.jpg", alt: "Kennedia Palace Dubai" },
    rating: 5,
    link: "/hotels/kennedia-palace-dubai",
    highlights: ["Private Beach", "Rooftop Bar", "Butler Service"]
  }
];

// ============================================
// COMMENT INTERFACE
// ============================================
interface Comment {
  id: string;
  author: string;
  avatar?: string;
  date: string;
  content: string;
  likes: number;
  replies: Comment[];
}

// ============================================
// SOCIAL SHARE BUTTONS COMPONENT
// ============================================
interface SocialShareProps {
  title: string;
  compact?: boolean;
}

const SocialShareButtons = ({ title, compact = false }: SocialShareProps) => {
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = title;
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-1">Share:</span>
        <button onClick={() => handleShare('facebook')} className="p-1.5 rounded-full hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500 transition-all" title="Share on Facebook">
          <Facebook className="w-4 h-4" />
        </button>
        <button onClick={() => handleShare('twitter')} className="p-1.5 rounded-full hover:bg-sky-500/10 text-muted-foreground hover:text-sky-500 transition-all" title="Share on Twitter">
          <Twitter className="w-4 h-4" />
        </button>
        <button onClick={() => handleShare('linkedin')} className="p-1.5 rounded-full hover:bg-blue-700/10 text-muted-foreground hover:text-blue-700 transition-all" title="Share on LinkedIn">
          <Linkedin className="w-4 h-4" />
        </button>
        <button onClick={() => handleShare('email')} className="p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all" title="Share via Email">
          <Mail className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <span className="font-serif font-bold text-lg">Share this article</span>
      <div className="flex gap-2">
        <button onClick={() => handleShare('facebook')} className="p-2.5 rounded-full border border-border hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all" title="Share on Facebook">
          <Facebook className="w-5 h-5" />
        </button>
        <button onClick={() => handleShare('twitter')} className="p-2.5 rounded-full border border-border hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all" title="Share on Twitter">
          <Twitter className="w-5 h-5" />
        </button>
        <button onClick={() => handleShare('linkedin')} className="p-2.5 rounded-full border border-border hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all" title="Share on LinkedIn">
          <Linkedin className="w-5 h-5" />
        </button>
        <button onClick={() => handleShare('email')} className="p-2.5 rounded-full border border-border hover:bg-primary hover:text-white hover:border-primary transition-all" title="Share via Email">
          <Mail className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// BREADCRUMB COMPONENT WITH SCHEMA
// ============================================
interface BreadcrumbItem {
  name: string;
  url: string;
}

const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${window.location.origin}${item.url}`
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center gap-2">
              {index > 0 && <span className="text-muted-foreground">/</span>}
              {index === items.length - 1 ? (
                <span className="text-muted-foreground truncate max-w-[200px]">{item.name}</span>
              ) : (
                <Link 
                  to={item.url} 
                  className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  {index === 0 && <ArrowLeft className="w-4 h-4" />}
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

// ============================================
// ARTICLE IMAGE GRID COMPONENT
// ============================================
interface ArticleImage {
  src: string;
  alt: string;
}

const ArticleImageGrid = ({ images, category }: { images: ArticleImage[]; category: string }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "hotel": return "bg-blue-600 text-white";
      case "restaurant": return "bg-orange-500 text-white";
      case "cafe": return "bg-amber-500 text-white";
      case "bar": return "bg-purple-500 text-white";
      default: return "bg-primary text-primary-foreground";
    }
  };

  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg mb-10 group">
        <span className={`absolute top-4 left-4 z-10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg ${getCategoryColor(category)}`}>
          {category}
        </span>
        <OptimizedImage {...images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
    );
  }

  const gridClass = images.length === 2 
    ? "grid-cols-2" 
    : images.length === 3 
    ? "grid-cols-2 md:grid-cols-3" 
    : "grid-cols-2 md:grid-cols-4";

  return (
    <div className="mb-10">
      <div className={`grid ${gridClass} gap-4`}>
        {images.map((img, index) => (
          <div 
            key={index} 
            className={`relative rounded-xl overflow-hidden shadow-lg cursor-pointer group ${
              index === 0 && images.length === 3 ? "col-span-2 md:col-span-1 aspect-video md:aspect-square" : "aspect-square"
            }`}
            onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}
          >
            {index === 0 && (
              <span className={`absolute top-3 left-3 z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg ${getCategoryColor(category)}`}>
                {category}
              </span>
            )}
            <OptimizedImage {...img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl">&times;</button>
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i === 0 ? images.length - 1 : i - 1); }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <img src={images[lightboxIndex].src} alt={images[lightboxIndex].alt} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i === images.length - 1 ? 0 : i + 1); }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button 
                key={i} 
                className={`w-2 h-2 rounded-full transition-colors ${i === lightboxIndex ? 'bg-white' : 'bg-white/40'}`}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// PROPERTIES SLIDER COMPONENT
// ============================================
const PropertiesSlider = ({ properties }: { properties: Property[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === properties.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [properties.length]);

  const currentProperty = properties[currentIndex];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden">
        {properties.map((property, i) => (
          <div 
            key={property.id} 
            className={`absolute inset-0 transition-opacity duration-700 ${i === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <OptimizedImage {...property.image} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
        ))}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(currentProperty.rating)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <h4 className="font-serif font-bold text-lg">{currentProperty.name}</h4>
          <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" /> {currentProperty.location}
          </p>
        </div>

        <button 
          onClick={() => setCurrentIndex(i => i === 0 ? properties.length - 1 : i - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <button 
          onClick={() => setCurrentIndex(i => i === properties.length - 1 ? 0 : i + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {currentProperty.highlights.map((highlight, i) => (
            <span key={i} className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full">
              {highlight}
            </span>
          ))}
        </div>
        <Link 
          to={currentProperty.link}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Explore Property <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex justify-center gap-1.5 pb-4">
        {properties.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-primary' : 'bg-border'}`}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================
// AUTHOR PROFILE CARD COMPONENT
// ============================================
const AuthorProfileCard = ({ author }: { author: AuthorProfile }) => {
  const socialIcons: Record<string, React.ReactNode> = {
    website: <Globe className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-medium">About the Author</h4>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {author.avatar ? (
            <img src={author.avatar} alt={author.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-8 h-8" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-foreground text-lg">{author.name}</h4>
          <p className="text-sm text-primary font-medium">{author.role}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mt-4">
        {author.bio}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
        {Object.entries(author.socialLinks).map(([platform, url]) => {
          if (!url) return null;
          const href = platform === 'email' ? `mailto:${url}` : url;
          return (
            <a
              key={platform}
              href={href}
              target={platform === 'email' ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
              title={platform.charAt(0).toUpperCase() + platform.slice(1)}
            >
              {socialIcons[platform]}
            </a>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// COMMENT COMPONENT
// ============================================
const CommentItem = ({ comment, onReply }: { comment: Comment; onReply: (id: string) => void }) => {
  const [liked, setLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {comment.avatar ? (
            <img src={comment.avatar} alt={comment.author} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{comment.date}</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
              {comment.likes + (liked ? 1 : 0)}
            </button>
            <button 
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Reply className="w-3.5 h-3.5" /> Reply
            </button>
          </div>
        </div>
      </div>

      {comment.replies.length > 0 && (
        <div className="ml-14 space-y-4">
          <button 
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs text-primary hover:underline"
          >
            {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </button>
          {showReplies && comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// COMMENTS SECTION COMPONENT
// ============================================
const CommentsSection = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Alexandra Smith",
      date: "2 days ago",
      content: "This is fantastic news! I've stayed at Kennedia Blu twice and their commitment to excellence is truly impressive. The attention to detail makes a real difference.",
      likes: 24,
      replies: [
        {
          id: "1-1",
          author: "Michael Roberts",
          date: "1 day ago",
          content: "Completely agree! The service quality didn't compromise on anything.",
          likes: 8,
          replies: []
        }
      ]
    },
    {
      id: "2",
      author: "David Chen",
      date: "3 days ago",
      content: "Great to see hospitality brands maintaining such high standards. Would love to see more details about their specific initiatives in future articles.",
      likes: 15,
      replies: []
    }
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      date: "Just now",
      content: newComment,
      likes: 0,
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: "You",
      date: "Just now",
      content: replyText,
      likes: 0,
      replies: []
    };

    setComments(comments.map(c => {
      if (c.id === parentId) {
        return { ...c, replies: [...c.replies, reply] };
      }
      return c;
    }));

    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="font-serif font-bold text-2xl mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-primary" />
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 border border-border rounded-xl bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px]"
            />
            <div className="flex justify-end mt-2">
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" /> Post Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id}>
            <CommentItem comment={comment} onReply={setReplyingTo} />
            
            {replyingTo === comment.id && (
              <div className="ml-14 mt-4 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-3 border border-border rounded-lg bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm min-h-[80px]"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button 
                      onClick={() => setReplyingTo(null)}
                      className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyText.trim()}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                    >
                      <Reply className="w-3.5 h-3.5" /> Reply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// ARTICLE NAVIGATION COMPONENT
// ============================================
interface ArticleNavProps {
  prevArticle?: { slug: string; title: string } | null;
  nextArticle?: { slug: string; title: string } | null;
  basePath?: string;
}

const ArticleNavigation = ({ prevArticle, nextArticle, basePath = "/news" }: ArticleNavProps) => {
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prevArticle ? (
          <Link 
            to={`#`}
            className="group flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
              <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Previous Article</span>
              <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors mt-1">
                {prevArticle.title}
              </h4>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextArticle ? (
          <Link 
            to={`#`}
            className="group flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all md:flex-row-reverse md:text-right"
          >
            <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Next Article</span>
              <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors mt-1">
                {nextArticle.title}
              </h4>
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function NewsDetails() {
  const { id } = useParams();
  const { items } = siteContent.text.news;
  const newsItem = items.find((n) => n.slug === id);

  if (!newsItem) {
    return <NotFound />;
  }

  // Find current article index and get prev/next
  const currentIndex = items.findIndex(n => n.slug === id);
  const prevArticle = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextArticle = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  // Handle multiple images (extend data structure to support this)
  const newsImages = [newsItem.image];
  // If your newsItem has multiple images: const newsImages = newsItem.images || [newsItem.image];

  const category = "Hotel"; // Can be dynamic: newsItem.category
  const relatedNews = items.filter((n) => n.slug !== id).slice(0, 3);

  // Get author profile (can be dynamic based on newsItem.authorId)
  const author = AUTHOR_PROFILES.find(a => a.id === "kennedia-team") || AUTHOR_PROFILES[0];

  // Breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "News", url: "/news" },
    { name: newsItem.title, url: `/news/${id}` }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">

          {/* Breadcrumb Navigation */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Article Header */}
          <header className="mb-6 max-w-5xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight">
              {newsItem.title}
            </h1>

            {/* Date Row with Social Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> {newsItem.date}
                </span>
                <span className="hidden md:inline text-border">•</span>
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> {author.name}
                </span>
                <span className="hidden md:inline text-border">•</span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> 5 min read
                </span>
              </div>
              
              {/* Social Share in Date Row */}
              <SocialShareButtons title={newsItem.title} compact />
            </div>
          </header>

          {/* Full-Width Article Image(s) - Below Heading */}
          <ArticleImageGrid images={newsImages} category={category} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">

            {/* LEFT: Content */}
            <article className="max-w-3xl">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg md:text-xl leading-relaxed font-serif text-foreground/90 mb-8 first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary first-letter:leading-none">
                  {newsItem.description}
                </p>

                <h2 className="text-2xl font-serif font-bold mt-8 mb-4">A New Era of Hospitality</h2>
                <p>
                  At Kennedia Blu, we are constantly striving for excellence and pushing the boundaries of luxury hospitality.
                  This achievement marks a significant milestone in our journey, reflecting our unwavering commitment to providing
                  exceptional experiences to our guests across all our properties.
                </p>

                <blockquote className="border-l-4 border-primary pl-6 py-4 my-8 italic text-lg bg-secondary/30 rounded-r-xl">
                  "We are incredibly proud of this recognition. It reflects the hard work and dedication of our entire team,
                  from front desk staff to executive leadership. This is a testament to our shared vision of excellence."
                  <footer className="text-sm text-muted-foreground mt-2 not-italic">— CEO, Kennedia Blu Hotels</footer>
                </blockquote>

                <h3 className="text-xl font-serif font-bold mt-8 mb-4">Commitment to Excellence</h3>
                <p>
                  Our success is built on three core pillars: exceptional service, innovative design, and sustainable practices.
                  Every member of our team undergoes rigorous training to ensure they deliver the highest standards of hospitality.
                </p>

                <h3 className="text-xl font-serif font-bold mt-8 mb-4">Looking Ahead</h3>
                <p>
                  The future holds exciting possibilities as we continue to expand our presence and refine our offerings.
                  We are committed to maintaining our high standards while exploring new ways to enhance the guest experience
                  through technology and personalized service.
                </p>
              </div>

              {/* Share & Tags */}
              <div className="mt-12 pt-8 border-t border-border space-y-8">
                <div className="flex flex-wrap gap-2">
                  {["Hospitality", "Luxury", "Innovation", "Excellence"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-secondary text-foreground text-xs rounded-full hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Social Share at Bottom */}
                <SocialShareButtons title={newsItem.title} />
              </div>

              {/* Author Profile Card - Full Width on Mobile */}
              <div className="mt-8 lg:hidden">
                <AuthorProfileCard author={author} />
              </div>

              {/* Article Navigation (Prev/Next) */}
              <ArticleNavigation prevArticle={prevArticle} nextArticle={nextArticle} basePath="/news" />

              {/* Comments Section */}
              <CommentsSection />
            </article>

            {/* RIGHT: Sidebar */}
            <aside className="lg:sticky lg:top-28 h-fit space-y-8">
              {/* Properties Slider */}
              <div>
                <h4 className="font-serif font-bold text-lg mb-4 px-1">Explore Our Properties</h4>
                <PropertiesSlider properties={PROPERTIES} />
              </div>

              {/* Author Card - Desktop Only */}
              <div className="hidden lg:block">
                <AuthorProfileCard author={author} />
              </div>

              {/* Related News */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-lg px-1">Related News</h4>
                <div className="space-y-4">
                  {relatedNews.map((item) => (
                    <Link key={item.slug} to={`/news/${item.slug}`} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <OptimizedImage {...item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h5 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h5>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{item.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                <h4 className="font-serif font-bold mb-2">Stay Updated</h4>
                <p className="text-xs text-muted-foreground mb-4">Subscribe to our newsletter for the latest news and exclusive offers.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" />
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"><Mail className="w-4 h-4" /></button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}