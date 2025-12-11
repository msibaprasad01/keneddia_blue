import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutUsSection from "@/components/AboutUsSection";
import BusinessVerticals from "@/components/BusinessVerticals";
import GlobalPresence from "@/components/GlobalPresence";
import RatingsAndAwards from "@/components/RatingsAndAwards";
import Footer from "@/components/Footer";
// New Components
import DailyOffers from "@/components/DailyOffers";
import EventsSection from "@/components/EventsSection";
import NewsPress from "@/components/NewsPress";
import OurStoryPreview from "@/components/OurStoryPreview";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <DailyOffers />
        <AboutUsSection />
        <BusinessVerticals />
        <EventsSection />
        <NewsPress />
        <OurStoryPreview />
        <GlobalPresence />
        <RatingsAndAwards />
      </main>

      <Footer />
    </div>
  );
}
