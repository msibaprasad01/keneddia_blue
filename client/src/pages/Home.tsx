import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutUsSection from "@/components/AboutUsSection";
import BusinessVerticals from "@/components/BusinessVerticals";
import GlobalPresence from "@/components/GlobalPresence";
import RatingsAndAwards from "@/components/RatingsAndAwards";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <AboutUsSection />
        <BusinessVerticals />
        <GlobalPresence />
        <RatingsAndAwards />
      </main>

      <Footer />
    </div>
  );
}
