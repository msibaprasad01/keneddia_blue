import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BusinessVerticals from "@/components/BusinessVerticals";
import GlobalPresence from "@/components/GlobalPresence";
import RatingsAndAwards from "@/components/RatingsAndAwards";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <BusinessVerticals />
        <GlobalPresence />
        <RatingsAndAwards />
      </main>
      
      {/* Minimal Footer */}
      <footer className="py-12 border-t border-foreground/5 mt-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-50 hover:opacity-100 transition-opacity">
          <p className="text-xs uppercase tracking-widest">© 2025 Kennedian Hotels</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-xs uppercase tracking-widest hover:text-primary">Privacy</a>
            <a href="#" className="text-xs uppercase tracking-widest hover:text-primary">Terms</a>
            <a href="#" className="text-xs uppercase tracking-widest hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
