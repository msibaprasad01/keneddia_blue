import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, Share2 } from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import { HOTEL_NEWS_ITEMS } from "@/data/hotelContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import NotFound from "@/modules/website/pages/not-found";

export default function HotelNewsDetails() {
  const { slug } = useParams();
  const newsItem = HOTEL_NEWS_ITEMS.find((n) => n.slug === slug);

  if (!newsItem) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16">
        <article className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <Link to="/hotels" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Hotels
          </Link>

          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {newsItem.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> Kennedia Team</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              {newsItem.title}
            </h1>
          </header>

          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl mb-12">
            <OptimizedImage
              {...newsItem.image}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg dark:prose-invert mx-auto">
            <p className="text-xl leading-relaxed font-serif text-foreground/80 mb-6 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-primary">
              {newsItem.description}
            </p>
            <p>
              This achievement underscores our commitment to providing world-class luxury experiences.
              Every detail at Kennedia Blu is curated to ensure our guests enjoy the pinnacle of comfort and service.
            </p>
            <p>
              "This is a testament to our team's hard work," says our General Manager. "We will continue to innovate and exceed expectations."
            </p>
            <h3>A Legacy of Excellence</h3>
            <p>
              As we move forward, we remain dedicated to sustainable luxury and creating unforgettable memories for every guest who walks through our doors.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
            <span className="font-serif font-bold text-lg">Share this update</span>
            <div className="flex gap-4">
              <button className="p-2 rounded-full border border-border hover:bg-secondary transition-colors"><Share2 className="w-5 h-5" /></button>
            </div>
          </div>

        </article>
      </main>
      <Footer />
    </div>
  );
}
