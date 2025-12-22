import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutUsSection from "@/components/AboutUsSection";
import BusinessVerticals from "@/components/BusinessVerticals";
import GlobalPresence from "@/components/GlobalPresence";
import RatingsAndAwards from "@/components/RatingsAndAwards";
import Footer from "@/components/Footer";
// New Components
import DailyOffers from "@/components/DailyOffers";
import PropertiesSection from "@/components/PropertiesSection";
import EventsSection from "@/components/EventsSection";
import NewsPress from "@/components/NewsPress";
import OurStoryPreview from "@/components/OurStoryPreview";

export default function Home() {
  const handleScrollToBusiness = () => {
    const businessSection = document.getElementById("business");
    if (businessSection) {
      businessSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <section id="daily-offers"><DailyOffers /></section>
        <section id="properties"><PropertiesSection /></section>
        <section id="about"><AboutUsSection /></section>
        <section id="business"><BusinessVerticals /></section>
        <section id="events"><EventsSection /></section>
        <section id="news"><NewsPress /></section>
        <section id="story"><OurStoryPreview /></section>
        <section id="global"><GlobalPresence /></section>
        {/* <section id="reviews"><RatingsAndAwards /></section> */}
      </main>

      {/* Hero Interaction Indicator - Global Fixed (Right Bottom) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
        className="fixed bottom-8 right-8 z-50 bg-primary/90 text-primary-foreground backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-4 shadow-xl cursor-pointer hover:bg-primary transition-all duration-300 group ring-1 ring-white/10 hover:ring-white/20 hover:scale-105"
        onClick={handleScrollToBusiness}
      >
        <div className="flex flex-col items-start bg-transparent">
          <span className="text-[10px] font-light uppercase tracking-widest text-primary-foreground/80 leading-none mb-1">
            Discover More
          </span>
          <span className="text-sm font-light text-white whitespace-nowrap">
            Explore Our Diversities
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
          <ChevronDown className="w-4 h-4 animate-pulse text-white" />
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
