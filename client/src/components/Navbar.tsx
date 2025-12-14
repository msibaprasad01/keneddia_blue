import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogIn, ArrowLeft } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { BookingSheet } from "./BookingSheet";

// Business mega menu data
const businessCategories = [
  {
    title: "Hotels & Resorts",
    items: ["Luxury Hotels", "Beach Resorts", "Urban Properties", "Heritage Hotels"],
  },
  {
    title: "Cafes & Dining",
    items: ["Fine Dining", "Casual Cafes", "Rooftop Restaurants", "Specialty Coffee"],
  },
  {
    title: "Bars & Lounges",
    items: ["Cocktail Bars", "Wine Lounges", "Sky Bars", "Pool Bars"],
  },
];

type NavItem =
  | { type: 'link'; label: string; href: string; key: string }
  | { type: 'dropdown'; label: string; key: string; items: { label: string; href: string }[] }
  | { type: 'mega'; label: string; key: string; items: typeof businessCategories };

const navItems: NavItem[] = [
  { type: 'mega', label: 'BUSINESSES', key: 'business', items: businessCategories },
  { type: 'link', label: 'EVENTS', key: 'events', href: '/events' },
  { type: 'link', label: 'REVIEWS', key: 'reviews', href: '/reviews' },
  {
    type: 'dropdown',
    label: 'JOIN US',
    key: 'joinus',
    items: [
      { label: 'Become a Partner', href: '/join/partner' },
      { label: 'Franchise Opportunities', href: '/join/franchise' },
      { label: 'Investor Relations', href: '/join/investor' },
      { label: 'Supplier Registration', href: '/join/supplier' },
    ]
  },
  { type: 'link', label: 'ABOUT US', key: 'about', href: '/about' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingCategory, setBookingCategory] = useState<"hotel" | "dining" | "delivery" | null>(null);
  const [location, setLocation] = useLocation();

  const openBooking = (category: "hotel" | "dining" | "delivery") => {
    setBookingCategory(category);
    setBookingOpen(true);
    // Close dropdowns if any
    setActiveDropdown(null);
  };

  // 1. Scroll & Active State Logic
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Active Section Spy
      const sections = ['business', 'events', 'reviews', 'joinus', 'about', 'daily-offers'];
      let currentInfo = null;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Check if section is roughly in view (top 3rd of screen)
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentInfo = sectionId;
          }
        }
      }
      setActiveSection(currentInfo);
    };

    // Handle initial hash scroll if arriving from another page
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          const navbarHeight = 64;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 100);
      }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]); // Re-run on location change

  // 2. Navigation Click Logic
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // A. Normalization: Extract potential ID from "/path" -> "path"
    const targetId = href.replace(/^\//, '').toLowerCase();

    // B. Check for Section ID Match
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      e.preventDefault(); // Stop Wouter navigation

      // Calculate Scroll Position with Offset
      const navbarHeight = 64; // h-16
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // Optional: Update URL without reload (if desired, but user constraints said "use existing routes")
      // window.history.pushState(null, "", href);

      setMobileMenuOpen(false); // Close mobile menu if open
      return;
    }

    // C. Fallback: Default Navigation (Wouter)
    // If no element found, standard behavior applies (User might be on another page, so logic relies on Wouter to switch route)
    setMobileMenuOpen(false);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Wrapper to prevent default empty behavior if needed, 
    // but main logic is now passed via specific handler or called inside Link's onClick
    // Checking if the 'href' is available on the target
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      handleNavigation(e, href);
    }
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${scrolled
        ? "bg-[#0a0a0c]/95 backdrop-blur-sm shadow-md py-2"
        : "bg-[#0a0a0c]/95 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none shadow-md lg:shadow-none py-2 lg:py-4"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-4">
            {/* Logo Section */}
            <div className="flex items-center justify-start flex-shrink-0">
              <Link href="/">
                <a onClick={handleLinkClick} className="block opacity-90 transition-opacity hover:opacity-100">
                  <img
                    src={siteContent.brand.logo.image.src}
                    alt={siteContent.brand.logo.image.alt}
                    className="h-10 lg:h-12 w-auto object-contain"
                  />
                </a>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 space-x-2">
            {navItems.map((item) => (
              <NavItem
                key={item.key}
                item={item}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                handleLinkClick={handleLinkClick}
                isActive={activeSection === item.key || (item.type === 'link' && activeSection === item.href.replace('/', ''))}
              />
            ))}
          </div>

          {/* Right Actions: Quick Select + Login */}
          <div className="hidden lg:flex items-center justify-end gap-3 w-auto">
            {/* Quick Action Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-sm font-medium rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                <span>Quick Book</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {/* Quick Action Dropdown */}
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border shadow-xl rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                <div className="py-1">
                  <button onClick={() => openBooking('hotel')} className="block w-full text-left px-4 py-3 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                    Book Hotel
                  </button>
                  <button onClick={() => openBooking('dining')} className="block w-full text-left px-4 py-3 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                    Reserve Table (Dine-in)
                  </button>
                  <button onClick={() => openBooking('delivery')} className="block w-full text-left px-4 py-3 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                    Takeaway / Delivery
                  </button>
                </div>
              </div>
            </div>

            <Link href="/login">
              <a onClick={handleLinkClick} className="flex items-center gap-2 px-5 py-2 text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
                <LogIn className="w-4 h-4" />
                LOGIN
              </a>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          mobileExpandedMenu={mobileExpandedMenu}
          setMobileExpandedMenu={setMobileExpandedMenu}
          navItems={navItems}
          handleLinkClick={handleLinkClick}
        />
      </div>
      <BookingSheet
        isOpen={bookingOpen}
        onOpenChange={setBookingOpen}
        category={bookingCategory}
      />
    </nav>
  );
}

// Desktop Nav Item Component
function NavItem({ item, activeDropdown, setActiveDropdown, handleLinkClick, isActive }: any) {
  const isHovered = activeDropdown === item.key;
  // Active if passed prop is true OR it's the current dropdown
  const showIndicator = isHovered || isActive;

  return (
    <div
      className="relative"
      onMouseEnter={() => item.type !== 'link' && setActiveDropdown(item.key)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      {item.type === 'link' ? (
        <Link href={item.href}>
          <a
            onClick={handleLinkClick}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
          >
            {item.label}
            {showIndicator && <ActiveIndicator />}
          </a>
        </Link>
      ) : (
        <>
          <button
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
          >
            {item.label}
            <ChevronDown className="w-4 h-4" />
            {showIndicator && <ActiveIndicator />}
          </button>

          <AnimatePresence>
            {isHovered && (
              <DropdownMenu item={item} handleLinkClick={handleLinkClick} />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

// Active Indicator Component
function ActiveIndicator() {
  return (
    <motion.div
      layoutId="activeNav"
      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
      initial={false}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  );
}

// Dropdown Menu Component
function DropdownMenu({ item, handleLinkClick }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`absolute top-full mt-2 bg-card border border-border/50 shadow-xl rounded-lg overflow-hidden ${item.type === 'mega' ? "left-1/2 -translate-x-1/2 shadow-2xl" : "right-0 w-64"
        }`}
      style={item.type === 'mega' ? { width: 'max-content', maxWidth: '90vw' } : undefined}
    >
      {item.type === 'mega' ? (
        <MegaMenu items={item.items} handleLinkClick={handleLinkClick} />
      ) : (
        <SimpleDropdown items={item.items} handleLinkClick={handleLinkClick} />
      )}
    </motion.div>
  );
}

// Mega Menu Component
function MegaMenu({ items, handleLinkClick }: any) {
  return (
    <div className="p-8">
      <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(180px, 1fr))` }}>
        {items.map((category: any, index: number) => (
          <div key={index}>
            <h3 className="font-bold text-sm text-foreground mb-4 pb-2 border-b border-border">
              {category.title}
            </h3>
            <ul className="space-y-2.5">
              {category.items.map((subItem: string, itemIndex: number) => (
                <li key={itemIndex}>
                  <Link href={`/business/${subItem.toLowerCase().replace(/\s+/g, "-")}`}>
                    <a onClick={handleLinkClick} className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                      {subItem}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple Dropdown Component
function SimpleDropdown({ items, handleLinkClick }: any) {
  return (
    <div className="py-2">
      {items.map((subItem: any, idx: number) => (
        <Link key={idx} href={subItem.href}>
          <a onClick={handleLinkClick} className="block px-6 py-3 text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors">
            {subItem.label}
          </a>
        </Link>
      ))}
    </div>
  );
}

// Mobile Menu Component
function MobileMenu({ mobileMenuOpen, mobileExpandedMenu, setMobileExpandedMenu, navItems, handleLinkClick }: any) {
  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden border-t border-white/10 overflow-hidden"
        >
          <div className="py-4 max-h-[70vh] overflow-y-auto">
            {navItems.map((item: NavItem) =>
              item.type === 'link' ? (
                <Link key={item.key} href={item.href}>
                  <a onClick={handleLinkClick} className="block px-4 py-3 text-sm font-medium text-white hover:bg-white/5 hover:text-primary transition-colors border-b border-white/5">
                    {item.label}
                  </a>
                </Link>
              ) : (
                <MobileDropdown
                  key={item.key}
                  item={item}
                  mobileExpandedMenu={mobileExpandedMenu}
                  setMobileExpandedMenu={setMobileExpandedMenu}
                  handleLinkClick={handleLinkClick}
                />
              )
            )}

            {/* Login Button */}
            <div className="px-4 pt-4">
              <Link href="/login">
                <a onClick={handleLinkClick} className="flex items-center justify-center gap-2 w-full py-2.5 bg-transparent border border-white/20 text-white text-sm font-medium rounded-full hover:border-primary hover:text-primary hover:bg-primary/10 transition-all">
                  <LogIn className="w-4 h-4" />
                  LOGIN
                </a>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mobile Dropdown Component
function MobileDropdown({ item, mobileExpandedMenu, setMobileExpandedMenu, handleLinkClick }: any) {
  const isExpanded = mobileExpandedMenu === item.key;

  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setMobileExpandedMenu(isExpanded ? null : item.key)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white hover:bg-white/5 hover:text-primary transition-colors"
      >
        <span>{item.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white/5 overflow-hidden"
          >
            {item.type === 'mega' ? (
              item.items.map((category: any, index: number) => (
                <div key={index} className="px-6 py-3 border-b border-white/5 last:border-0">
                  <h4 className="font-semibold text-xs text-white/70 mb-2 uppercase tracking-wider">
                    {category.title}
                  </h4>
                  <ul className="space-y-1.5">
                    {category.items.map((subItem: string, itemIndex: number) => (
                      <li key={itemIndex}>
                        <Link href={`/business/${subItem.toLowerCase().replace(/\s+/g, "-")}`}>
                          <a onClick={handleLinkClick} className="block text-sm text-white/60 hover:text-primary py-1 transition-colors">
                            {subItem}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              item.items.map((subItem: any, idx: number) => (
                <Link key={idx} href={subItem.href}>
                  <a onClick={handleLinkClick} className="block px-6 py-2.5 text-sm text-white/60 hover:text-primary hover:bg-white/5 transition-colors">
                    {subItem.label}
                  </a>
                </Link>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}