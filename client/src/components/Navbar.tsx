import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md py-4 border-b border-primary/5"
          : "bg-white/20 backdrop-blur-md py-6 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="text-foreground font-serif text-2xl tracking-widest font-bold uppercase hover:text-primary transition-colors">
            Kennedian
          </a>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-12">
          {["Hotels", "Cafes", "Bars"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors"
            >
              {item}
            </Link>
          ))}
          <button className="border border-primary/50 text-primary px-6 py-2 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            Book Now
          </button>
        </div>

        {/* Mobile Menu Button (Placeholder) */}
        <button className="md:hidden text-foreground">
          <span className="sr-only">Menu</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              strokeWidth={1.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
