import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, Share2, Clock, Facebook, Twitter, Linkedin, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import NotFound from "./not-found";

export default function NewsDetails() {
  const { id } = useParams();
  const { items } = siteContent.text.news;
  const newsItem = items.find((n) => n.slug === id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!newsItem) {
    return <NotFound />;
  }

  // Mock: Create array of images (you can add multiple images to your data structure)
  // For now, we'll create a carousel with the single image, but structured for multiple
  const newsImages = [
    newsItem.image,
    // Add more images here when available in your data structure
    // newsItem.image2, newsItem.image3, etc.
  ];

  // Mock category - you should add this to your data structure
  const category = "Hotel"; // This should come from newsItem.category

  // Auto-slide effect - every 4 seconds
  useEffect(() => {
    if (newsImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === newsImages.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [newsImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === newsImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? newsImages.length - 1 : prev - 1));
  };

  // Mock related news items (you can replace with actual logic)
  const relatedNews = items.filter((n) => n.slug !== id).slice(0, 3);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = newsItem.title;

    const shareUrls: { [key: string]: string } = {
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

  // Get category color
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "hotel": return "bg-blue-500 text-white";
      case "restaurant": return "bg-orange-500 text-white";
      case "cafe": return "bg-amber-500 text-white";
      case "bar": return "bg-purple-500 text-white";
      default: return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          {/* Article Header */}
          <header className="mb-6 md:mb-8 max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 md:mb-6 leading-tight text-foreground">
              {newsItem.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-muted-foreground pb-4 md:pb-6 border-b border-border">
              <span className="flex items-center gap-1.5 md:gap-2">
                <Calendar className="w-3.5 md:w-4 h-3.5 md:h-4 text-primary" />
                {newsItem.date}
              </span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1.5 md:gap-2">
                <User className="w-3.5 md:w-4 h-3.5 md:h-4 text-primary" />
                Kennedia Team
              </span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1.5 md:gap-2">
                <Clock className="w-3.5 md:w-4 h-3.5 md:h-4 text-primary" />
                5 min read
              </span>
            </div>

            {/* Breadcrumb - Moved here */}
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary mt-4 transition-colors group"
            >
              <ArrowLeft className="w-3.5 md:w-4 h-3.5 md:h-4 group-hover:-translate-x-1 transition-transform" />
              Back to News
            </Link>
          </header>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">

            {/* LEFT: Article Content */}
            <article className="max-w-3xl">

              {/* Featured Image Carousel - Mobile Only */}
              <div className="lg:hidden relative aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-lg mb-6 md:mb-8 group">
                {/* Category Label */}
                <div className="absolute top-3 md:top-4 left-3 md:left-4 z-10">
                  <span className={`px-3 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full shadow-lg ${getCategoryColor(category)}`}>
                    {category}
                  </span>
                </div>

                {/* Images */}
                {newsImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                  >
                    <OptimizedImage
                      {...image}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {/* Navigation Arrows - Show only if multiple images */}
                {newsImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </>
                )}

                {/* Dots Indicator - Show only if multiple images */}
                {newsImages.length > 1 && (
                  <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-2 z-10">
                    {newsImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentImageIndex
                            ? 'w-6 md:w-8 h-1.5 md:h-2 bg-white'
                            : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-white/50 hover:bg-white/75'
                          }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Article Body */}
              <div className="prose prose-sm md:prose-base lg:prose-lg prose-slate dark:prose-invert max-w-none">
                <p className="text-base md:text-lg lg:text-xl leading-relaxed text-foreground/90 mb-4 md:mb-6 first-letter:text-4xl md:first-letter:text-5xl lg:first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:text-primary">
                  {newsItem.description}
                </p>

                <h2 className="text-xl md:text-2xl font-serif font-bold mt-6 md:mt-8 mb-3 md:mb-4 text-foreground">
                  A New Era of Hospitality
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-foreground/80 mb-4">
                  At Kennedia Blu, we are constantly striving for excellence and pushing the boundaries of luxury hospitality.
                  This achievement marks a significant milestone in our journey, reflecting our unwavering commitment to providing
                  exceptional experiences to our guests across all our properties.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-foreground/80 mb-4">
                  Our dedication to quality and innovation has been recognized by industry leaders and guests alike.
                  Each property in our portfolio embodies the perfect blend of modern amenities and timeless elegance,
                  creating memorable stays that exceed expectations.
                </p>

                <blockquote className="border-l-4 border-primary pl-4 md:pl-6 py-2 md:py-3 my-6 md:my-8 italic text-base md:text-lg text-foreground/90 bg-secondary/30 rounded-r-lg">
                  "We are incredibly proud of this recognition. It reflects the hard work and dedication of our entire team,
                  from front desk staff to executive leadership. This is a testament to our shared vision of excellence."
                  <footer className="text-xs md:text-sm text-muted-foreground mt-2 not-italic font-medium">
                    — CEO, Kennedia Blu Hotels
                  </footer>
                </blockquote>

                <h2 className="text-xl md:text-2xl font-serif font-bold mt-6 md:mt-8 mb-3 md:mb-4 text-foreground">
                  Commitment to Excellence
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-foreground/80 mb-4">
                  Our success is built on three core pillars: exceptional service, innovative design, and sustainable practices.
                  Every member of our team undergoes rigorous training to ensure they deliver the highest standards of hospitality.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-foreground/80 mb-4 ml-2 md:ml-4">
                  <li>Award-winning customer service recognized globally</li>
                  <li>Sustainable practices integrated across all properties</li>
                  <li>Cutting-edge technology for seamless guest experiences</li>
                  <li>Curated dining experiences by renowned chefs</li>
                </ul>

                <h2 className="text-xl md:text-2xl font-serif font-bold mt-6 md:mt-8 mb-3 md:mb-4 text-foreground">
                  Looking Ahead
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-foreground/80 mb-4">
                  The future holds exciting possibilities as we continue to expand our presence and refine our offerings.
                  We are committed to maintaining our high standards while exploring new ways to enhance the guest experience
                  through technology and personalized service.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-foreground/80 mb-4">
                  Our upcoming projects include new properties in key metropolitan areas, expanded wellness facilities,
                  and innovative dining concepts that celebrate local cultures and cuisines. We invite you to be part of
                  this exciting journey as we continue to redefine luxury hospitality.
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border">
                <span className="text-xs md:text-sm font-semibold text-muted-foreground">Tags:</span>
                <span className="px-3 py-1 bg-secondary text-foreground text-xs rounded-full hover:bg-secondary/80 transition-colors cursor-pointer">
                  Hospitality
                </span>
                <span className="px-3 py-1 bg-secondary text-foreground text-xs rounded-full hover:bg-secondary/80 transition-colors cursor-pointer">
                  Luxury
                </span>
                <span className="px-3 py-1 bg-secondary text-foreground text-xs rounded-full hover:bg-secondary/80 transition-colors cursor-pointer">
                  Innovation
                </span>
              </div>

              {/* Share Section */}
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="font-serif font-bold text-base md:text-lg">Share this article</span>
                  <div className="flex gap-2 md:gap-3">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="p-2 md:p-2.5 rounded-full border border-border hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500 dark:hover:bg-blue-950 transition-all group"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-4 md:w-5 h-4 md:h-5" />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="p-2 md:p-2.5 rounded-full border border-border hover:bg-sky-50 hover:border-sky-500 hover:text-sky-500 dark:hover:bg-sky-950 transition-all group"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-4 md:w-5 h-4 md:h-5" />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="p-2 md:p-2.5 rounded-full border border-border hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 dark:hover:bg-blue-950 transition-all group"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 md:w-5 h-4 md:h-5" />
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="p-2 md:p-2.5 rounded-full border border-border hover:bg-secondary hover:border-primary hover:text-primary transition-all group"
                      aria-label="Share via Email"
                    >
                      <Mail className="w-4 md:w-5 h-4 md:h-5" />
                    </button>
                  </div>
                </div>
              </div>

            </article>

            {/* RIGHT: Sidebar */}
            <aside className="lg:sticky lg:top-24 h-fit space-y-6 md:space-y-8">

              {/* Featured Image Carousel - Desktop Only */}
              <div className="hidden lg:block relative">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl group">
                  {/* Category Label */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg ${getCategoryColor(category)}`}>
                      {category}
                    </span>
                  </div>

                  {/* Images */}
                  {newsImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-700 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                      <OptimizedImage
                        {...image}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}

                  {/* Navigation Arrows - Show only if multiple images */}
                  {newsImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Dots Indicator - Show only if multiple images */}
                  {newsImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                      {newsImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`transition-all duration-300 rounded-full ${index === currentImageIndex
                              ? 'w-8 h-2 bg-white'
                              : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                            }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Author Card */}
              <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-lg">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 md:w-7 h-6 md:h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base md:text-lg text-foreground">Kennedia Team</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Editorial Staff</p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Our editorial team brings you the latest news and insights from the world of luxury hospitality.
                </p>
              </div>

              {/* Related News */}
              {relatedNews.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-lg">
                  <h3 className="font-serif font-bold text-base md:text-lg mb-4 md:mb-5 text-foreground">
                    Related Articles
                  </h3>
                  <div className="space-y-4 md:space-y-5">
                    {relatedNews.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/news/${item.slug}`}
                        className="group block"
                      >
                        <div className="flex gap-3 md:gap-4">
                          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                            <OptimizedImage
                              {...item.image}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif font-semibold text-xs md:text-sm text-foreground mb-1 md:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {item.date}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/news"
                    className="mt-4 md:mt-5 inline-flex items-center gap-2 text-xs md:text-sm text-primary font-semibold hover:gap-3 transition-all group"
                  >
                    View All News
                    <ArrowLeft className="w-3.5 md:w-4 h-3.5 md:h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 md:p-6 shadow-lg">
                <h3 className="font-serif font-bold text-base md:text-lg mb-2 md:mb-3 text-foreground">
                  Stay Updated
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4">
                  Subscribe to our newsletter for the latest news and exclusive offers.
                </p>
                <form className="space-y-2 md:space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-background"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 md:py-2.5 bg-primary text-primary-foreground text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}