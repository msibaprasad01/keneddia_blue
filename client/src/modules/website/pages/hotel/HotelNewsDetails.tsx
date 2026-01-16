import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, User, Calendar, Share2, Clock,
  Facebook, Twitter, Linkedin, Mail,
  ChevronLeft, ChevronRight
} from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import { HOTEL_NEWS_ITEMS } from "@/data/hotelContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import NotFound from "@/modules/website/pages/not-found";

export default function HotelNewsDetails() {
  const { slug } = useParams();
  const newsItem = HOTEL_NEWS_ITEMS.find((n) => n.slug === slug);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!newsItem) {
    return <NotFound />;
  }

  // Handle potential multiple images (using current image as first in array)
  const newsImages = [newsItem.image];
  const category = "Hotel"; // Can be dynamic if added to hotelContent.ts
  const relatedNews = HOTEL_NEWS_ITEMS.filter((n) => n.slug !== slug).slice(0, 3);

  // Auto-slide effect
  useEffect(() => {
    if (newsImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === newsImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [newsImages.length]);

  const nextImage = () => setCurrentImageIndex((p) => (p === newsImages.length - 1 ? 0 : p + 1));
  const prevImage = () => setCurrentImageIndex((p) => (p === 0 ? newsImages.length - 1 : p - 1));

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = newsItem.title;
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">

          {/* Article Header */}
          <header className="mb-8 max-w-5xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight">
              {newsItem.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground pb-6 border-b border-border">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> {newsItem.date}
              </span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Kennedia Team
              </span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> 4 min read
              </span>
            </div>

            <Link to="/hotels" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mt-6 group transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Hotels
            </Link>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">

            {/* LEFT: Content */}
            <article className="max-w-3xl">
              {/* Carousel for Mobile (Hidden on Desktop Sidebar) */}
              <div className="lg:hidden relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-8 group">
                <span className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded-full shadow-lg">
                  {category}
                </span>
                {newsImages.map((img, i) => (
                  <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <OptimizedImage {...img} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg md:text-xl leading-relaxed font-serif text-foreground/90 mb-8 first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary first-letter:leading-none">
                  {newsItem.description}
                </p>

                <h2 className="text-2xl font-serif font-bold mt-8 mb-4">Excellence in Every Detail</h2>
                <p>
                  This achievement underscores our commitment to providing world-class luxury experiences.
                  Every detail at Kennedia Blu is curated to ensure our guests enjoy the pinnacle of comfort and service.
                </p>

                <blockquote className="border-l-4 border-primary pl-6 py-4 my-8 italic text-lg bg-secondary/30 rounded-r-xl">
                  "This is a testament to our team's hard work. We will continue to innovate and exceed expectations in the luxury hospitality sector."
                  <footer className="text-sm text-muted-foreground mt-2 not-italic">— General Manager, Kennedia Blu</footer>
                </blockquote>

                <h3 className="text-xl font-serif font-bold mt-8 mb-4">A Legacy of Excellence</h3>
                <p>
                  As we move forward, we remain dedicated to sustainable luxury and creating unforgettable memories
                  for every guest who walks through our doors. Our focus remains on combining local heritage with
                  modern sophistication.
                </p>
              </div>

              {/* Share & Tags */}
              <div className="mt-12 pt-8 border-t border-border space-y-8">
                <div className="flex flex-wrap gap-2">
                  {["Hospitality", "Luxury", "Events"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-secondary text-foreground text-xs rounded-full hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="font-serif font-bold text-lg">Share this update</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleShare('facebook')} className="p-2.5 rounded-full border border-border hover:bg-blue-500 hover:text-white transition-all"><Facebook className="w-5 h-5" /></button>
                    <button onClick={() => handleShare('twitter')} className="p-2.5 rounded-full border border-border hover:bg-sky-500 hover:text-white transition-all"><Twitter className="w-5 h-5" /></button>
                    <button onClick={() => handleShare('linkedin')} className="p-2.5 rounded-full border border-border hover:bg-blue-700 hover:text-white transition-all"><Linkedin className="w-5 h-5" /></button>
                    <button onClick={() => handleShare('email')} className="p-2.5 rounded-full border border-border hover:bg-primary hover:text-white transition-all"><Mail className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            </article>

            {/* RIGHT: Sidebar */}
            <aside className="lg:sticky lg:top-28 h-fit space-y-8">
              {/* Desktop Carousel */}
              <div className="hidden lg:block relative aspect-square rounded-2xl overflow-hidden shadow-2xl group">
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-full shadow-lg">
                    {category}
                  </span>
                </div>
                {newsImages.map((img, i) => (
                  <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <OptimizedImage {...img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                ))}
              </div>

              {/* Author Card */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Kennedia Team</h4>
                    <p className="text-xs text-muted-foreground">Luxury Travel Experts</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Dedicated to sharing the latest milestones and luxury insights from the Kennedia Blu collection.
                </p>
              </div>

              {/* Related News */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-lg px-1">Related News</h4>
                <div className="space-y-4">
                  {relatedNews.map((item) => (
                    <Link key={item.slug} to={`/hotels/news/${item.slug}`} className="flex gap-4 group">
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
                <h4 className="font-serif font-bold mb-2">Join the Club</h4>
                <p className="text-xs text-muted-foreground mb-4">Get exclusive updates on new property launches and awards.</p>
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