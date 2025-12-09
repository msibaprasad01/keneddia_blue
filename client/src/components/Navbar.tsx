import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogIn } from "lucide-react";

// Business mega menu data
const businessCategories = [
  {
    title: "Hotels & Resorts",
    items: [
      "Luxury Hotels",
      "Beach Resorts",
      "Urban Properties",
      "Heritage Hotels",
    ],
  },
  {
    title: "Cafes & Dining",
    items: [
      "Fine Dining",
      "Casual Cafes",
      "Rooftop Restaurants",
      "Specialty Coffee",
    ],
  },
  {
    title: "Bars & Lounges",
    items: [
      "Cocktail Bars",
      "Wine Lounges",
      "Sky Bars",
      "Pool Bars",
    ],
  },
  {
    title: "Events & Conferences",
    items: [
      "Banquet Halls",
      "Conference Centers",
      "Wedding Venues",
      "Exhibition Spaces",
    ],
  },
  {
    title: "Wellness & Spa",
    items: [
      "Day Spas",
      "Wellness Centers",
      "Fitness Studios",
      "Yoga Retreats",
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (menu: string) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent navigation for now
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileSubmenu = (menu: string) => {
    setMobileExpandedMenu(mobileExpandedMenu === menu ? null : menu);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <a onClick={handleLinkClick} className="text-foreground font-light text-3xl tracking-[0.2em] uppercase hover:text-primary transition-colors" style={{ fontFamily: 'serif' }}>
              Kennedia
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Business Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("business")}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors relative group">
                BUSINESSES
                <ChevronDown className="w-4 h-4" />
                {/* Active Indicator */}
                {activeDropdown === "business" && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {activeDropdown === "business" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-0 w-screen max-w-5xl bg-white shadow-2xl border-t-4 border-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                  >
                    <div className="p-8">
                      <div className="grid grid-cols-5 gap-8">
                        {businessCategories.map((category, index) => (
                          <div key={index}>
                            <h3 className="font-bold text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">
                              {category.title}
                            </h3>
                            <ul className="space-y-2.5">
                              {category.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <Link href={`/business/${item.toLowerCase().replace(/\s+/g, "-")}`}>
                                    <a onClick={handleLinkClick} className="text-sm text-gray-600 hover:text-primary transition-colors block">
                                      {item}
                                    </a>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* About */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("about")}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/about">
                <a onClick={handleLinkClick} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors relative">
                  ABOUT US
                  {activeDropdown === "about" && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              </Link>
            </div>

            {/* Events */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("events")}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/events">
                <a onClick={handleLinkClick} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors relative">
                  EVENTS
                  {activeDropdown === "events" && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              </Link>
            </div>

            {/* Reviews */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("reviews")}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/reviews">
                <a onClick={handleLinkClick} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors relative">
                  REVIEWS
                  {activeDropdown === "reviews" && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              </Link>
            </div>

            {/* Join Us Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("joinus")}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors relative group">
                JOIN US
                <ChevronDown className="w-4 h-4" />
                {/* Active Indicator */}
                {activeDropdown === "joinus" && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              {/* Join Us Dropdown Menu */}
              <AnimatePresence>
                {activeDropdown === "joinus" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-0 w-64 bg-white shadow-xl border-t-4 border-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                  >
                    <div className="py-3">
                      <Link href="/join/partner">
                        <a onClick={handleLinkClick} className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                          Become a Partner
                        </a>
                      </Link>
                      <Link href="/join/franchise">
                        <a onClick={handleLinkClick} className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                          Franchise Opportunities
                        </a>
                      </Link>
                      <Link href="/join/investor">
                        <a onClick={handleLinkClick} className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                          Investor Relations
                        </a>
                      </Link>
                      <Link href="/join/supplier">
                        <a onClick={handleLinkClick} className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                          Supplier Registration
                        </a>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Login Button - Minimalistic transparent design */}
            <Link href="/login">
              <a onClick={handleLinkClick} className="flex items-center gap-2 px-5 py-2 bg-transparent border border-gray-300/50 text-gray-700 text-sm font-medium rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300">
                <LogIn className="w-4 h-4" />
                LOGIN
              </a>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden text-gray-700 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 overflow-hidden"
            >
              <div className="py-4 max-h-[70vh] overflow-y-auto">
                {/* Business Menu with Submenu */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => toggleMobileSubmenu("business")}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <span>BUSINESSES</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        mobileExpandedMenu === "business" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {mobileExpandedMenu === "business" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-50 overflow-hidden"
                      >
                        {businessCategories.map((category, index) => (
                          <div key={index} className="px-6 py-3 border-b border-gray-100 last:border-0">
                            <h4 className="font-semibold text-xs text-gray-900 mb-2 uppercase tracking-wider">
                              {category.title}
                            </h4>
                            <ul className="space-y-1.5">
                              {category.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <Link href={`/business/${item.toLowerCase().replace(/\s+/g, "-")}`}>
                                    <a onClick={handleLinkClick} className="block text-sm text-gray-600 hover:text-primary py-1 transition-colors">
                                      {item}
                                    </a>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* About Us */}
                <Link href="/about">
                  <a onClick={handleLinkClick} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100">
                    ABOUT US
                  </a>
                </Link>

                {/* Events */}
                <Link href="/events">
                  <a onClick={handleLinkClick} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100">
                    EVENTS
                  </a>
                </Link>

                {/* Reviews */}
                <Link href="/reviews">
                  <a onClick={handleLinkClick} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100">
                    REVIEWS
                  </a>
                </Link>

                {/* Join Us Menu with Submenu */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => toggleMobileSubmenu("joinus")}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <span>JOIN US</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        mobileExpandedMenu === "joinus" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {mobileExpandedMenu === "joinus" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-50 overflow-hidden"
                      >
                        <Link href="/join/partner">
                          <a onClick={handleLinkClick} className="block px-6 py-2.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors">
                            Become a Partner
                          </a>
                        </Link>
                        <Link href="/join/franchise">
                          <a onClick={handleLinkClick} className="block px-6 py-2.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors">
                            Franchise Opportunities
                          </a>
                        </Link>
                        <Link href="/join/investor">
                          <a onClick={handleLinkClick} className="block px-6 py-2.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors">
                            Investor Relations
                          </a>
                        </Link>
                        <Link href="/join/supplier">
                          <a onClick={handleLinkClick} className="block px-6 py-2.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors">
                            Supplier Registration
                          </a>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Login Button */}
                <div className="px-4 pt-4">
                  <Link href="/login">
                    <a onClick={handleLinkClick} className="flex items-center justify-center gap-2 w-full py-2.5 bg-transparent border border-gray-300/50 text-gray-700 text-sm font-medium rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300">
                      <LogIn className="w-4 h-4" />
                      LOGIN
                    </a>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}