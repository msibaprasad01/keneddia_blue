import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Share2 } from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import NotFound from "./not-found";

export default function EventDetails() {
  const { id } = useParams();
  const { items } = siteContent.text.events;
  const event = items.find((e) => e.slug === id);

  if (!event) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 lg:px-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col lg:flex-row gap-12">

            {/* Left Content */}
            <div className="flex-1">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide uppercase mb-6">
                Upcoming Event
              </span>
              <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6 leading-tight">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-8 text-lg mb-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{event.location}</span>
                </div>
              </div>

              <p className="text-xl leading-relaxed text-foreground/80 mb-12">
                {event.description}
                <br /><br />
                Join us for an unforgettable experience. {event.description} This event promises to be a highlight of the season.
              </p>

              <div className="flex gap-4">
                <button className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg">
                  RSVP Now
                </button>
                <button className="px-8 py-3 border border-border text-foreground font-bold rounded-lg hover:bg-secondary transition-all flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2">
              <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <OptimizedImage
                  {...event.image}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-secondary/10 mix-blend-multiply" />
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
