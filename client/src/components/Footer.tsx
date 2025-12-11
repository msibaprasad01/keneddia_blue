import { Facebook, Instagram, Youtube, Linkedin, Twitter, ArrowUp } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { siteContent } from "@/data/siteContent";

const footerSections = [
  {
    title: "About Us",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Leadership Team", href: "/leadership" },
      { label: "Vision & Mission", href: "/vision" },
      { label: "Our Journey", href: "/journey" },
    ],
  },
  {
    title: "Businesses",
    links: [
      { label: "Hotels & Resorts", href: "/hotels" },
      { label: "Cafes & Dining", href: "/cafes" },
      { label: "Bars & Lounges", href: "/bars" },
      { label: "Events & Conferences", href: "/events" },
      { label: "Wellness & Spa", href: "/wellness" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Kennedia Blu Foundation", href: "/foundation" },
      { label: "Investors", href: "/investors" },
      { label: "Newsroom", href: "/newsroom" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
];

const legalLinks = [
  { label: "Legal Disclaimer", href: "/legal" },
  { label: "Privacy Notice", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button only after scrolling past hero section (one viewport height)
      setShowScrollTop(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent navigation for now
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-linear-to-b from-gray-50 to-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            {/* Logo */}
            <Link href="/">
              <a 
                onClick={handleLinkClick}
                className="text-foreground font-light text-3xl tracking-[0.2em] uppercase hover:text-primary transition-colors inline-block" 
                style={{ fontFamily: 'serif' }}
              >
                {siteContent.brand.logo.text}
              </a>
            </Link>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  onClick={handleLinkClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
                >
                  <social.icon className="w-5 h-5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-foreground font-semibold text-sm mb-6 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href}>
                      <a
                        onClick={handleLinkClick}
                        className="text-sm text-gray-600 hover:text-primary transition-colors block"
                      >
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100/50 border-t border-gray-200">
        <div className="container mx-auto px-6 lg:px-12 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} {siteContent.brand.name}. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              {legalLinks.map((link, index) => (
                <Link key={index} href={link.href}>
                  <a
                    onClick={handleLinkClick}
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button - Only shows after hero section */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-card border-2 border-border rounded-full flex items-center justify-center text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 shadow-lg z-40 animate-in fade-in slide-in-from-bottom-4"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" strokeWidth={2} />
        </button>
      )}
    </footer>
  );
}