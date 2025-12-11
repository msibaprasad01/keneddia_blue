import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogIn } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

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
  // {
  //   title: "Events & Conferences",
  //   items: [
  //     "Banquet Halls",
  //     "Conference Centers",
  //     "Wedding Venues",
  //     "Exhibition Spaces",
  //   ],
  // },
  // {
  //   title: "Wellness & Spa",
  //   items: [
  //     "Day Spas",
  //     "Wellness Centers",
  //     "Fitness Studios",
  //     "Yoga Retreats",
  //   ],
  // },
];

type NavItem =
  | { type: 'link'; label: string; href: string; key: string }
  | { type: 'dropdown'; label: string; key: string; items: { label: string; href: string }[] }
  | { type: 'mega'; label: string; key: string; items: typeof businessCategories };

const navItems: NavItem[] = [
  {
    type: 'mega',
    label: 'BUSINESSES',
    key: 'business',
    items: businessCategories
  },
  {
    type: 'link',
    label: 'ABOUT US',
    key: 'about',
    href: '/about'
  },
  {
    type: 'link',
    label: 'EVENTS',
    key: 'events',
    href: '/events'
  },
  {
    type: 'link',
    label: 'REVIEWS',
    key: 'reviews',
    href: '/reviews'
  },
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
  }
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[#FAFAFA] shadow-md"
        : "bg-[#FAFAFA]/95 backdrop-blur-sm"
        }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <a onClick={handleLinkClick} className="block hover:opacity-90 transition-opacity shrink-0">
              {siteContent.brand.logo.image ? (
                <img
                  src={siteContent.brand.logo.image.src}
                  alt={siteContent.brand.logo.image.alt}
                  className="h-16 lg:h-20 w-auto max-w-[450px] lg:max-w-[720px] object-contain mix-blend-multiply"
                />
              ) : (
                <span className="text-[#2B2B2B] font-light text-3xl tracking-[0.2em] uppercase hover:text-[#B11226] transition-colors" style={{ fontFamily: 'serif' }}>
                  {siteContent.brand.logo.text}
                </span>
              )}
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => item.type !== 'link' && handleMouseEnter(item.key)}
                onMouseLeave={handleMouseLeave}
              >
                {item.type === 'link' ? (
                  <Link href={item.href}>
                    <a onClick={handleLinkClick} className="flex items-center gap-1 px-2 lg:px-3 xl:px-4 py-2 text-xs lg:text-sm font-medium text-[#2B2B2B] hover:text-[#B11226] transition-colors relative whitespace-nowrap">
                      {item.label}
                      {activeDropdown === item.key && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-[#B11226]"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </a>
                  </Link>
                ) : (
                  <>
                    <button className="flex items-center gap-1 px-2 lg:px-3 xl:px-4 py-2 text-xs lg:text-sm font-medium text-[#2B2B2B] hover:text-[#B11226] transition-colors relative group whitespace-nowrap">
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                      {activeDropdown === item.key && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-[#B11226]"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>

                    {/* Dropdown/Mega Menu */}
                    <AnimatePresence>
                      {activeDropdown === item.key && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute top-full mt-0 bg-[#FAFAFA] shadow-xl border-t-4 border-[#B11226] ${item.type === 'mega'
                            ? "left-1/2 -translate-x-1/2 shadow-2xl"
                            : "right-0 w-64"
                            }`}
                          style={
                            item.type === 'mega'
                              ? {
                                width: 'max-content',
                                maxWidth: '90vw',
                              }
                              : undefined
                          }
                        >
                          {item.type === 'mega' ? (
                            <div className="p-8">
                              <div
                                className="grid gap-8"
                                style={{
                                  gridTemplateColumns: `repeat(${item.items.length}, minmax(180px, 1fr))`
                                }}
                              >
                                {item.items.map((category, index) => (
                                  <div key={index}>
                                    <h3 className="font-bold text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                      {category.title}
                                    </h3>
                                    <ul className="space-y-2.5">
                                      {category.items.map((subItem, itemIndex) => (
                                        <li key={itemIndex}>
                                          <Link href={`/business/${subItem.toLowerCase().replace(/\s+/g, "-")}`}>
                                            <a onClick={handleLinkClick} className="text-sm text-[#2B2B2B]/80 hover:text-[#B11226] transition-colors block">
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
                          ) : item.type === 'dropdown' ? (
                            <div className="py-3">
                              {item.items.map((subItem, idx) => (
                                <Link key={idx} href={subItem.href}>
                                  <a onClick={handleLinkClick} className="block px-6 py-3 text-sm text-[#2B2B2B] hover:bg-gray-50 hover:text-[#B11226] transition-colors">
                                    {subItem.label}
                                  </a>
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Login Button - Minimalistic transparent design */}
            <Link href="/login">
              <a onClick={handleLinkClick} className="flex items-center gap-2 px-5 py-2 bg-transparent border border-gray-300/50 text-[#2B2B2B] text-sm font-medium rounded-full hover:border-[#B11226] hover:text-[#B11226] hover:bg-[#B11226]/5 transition-all duration-300">
                <LogIn className="w-4 h-4" />
                LOGIN
              </a>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-[#2B2B2B] hover:text-[#B11226] transition-colors"
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
                {navItems.map((item) => (
                  item.type === 'link' ? (
                    <Link key={item.key} href={item.href}>
                      <a onClick={handleLinkClick} className="block px-4 py-3 text-sm font-medium text-[#2B2B2B] hover:bg-gray-50 hover:text-[#B11226] transition-colors border-b border-gray-100">
                        {item.label}
                      </a>
                    </Link>
                  ) : (
                    <div key={item.key} className="border-b border-gray-100">
                      <button
                        onClick={() => toggleMobileSubmenu(item.key)}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[#2B2B2B] hover:bg-gray-50 hover:text-[#B11226] transition-colors"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${mobileExpandedMenu === item.key ? "rotate-180" : ""
                            }`}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileExpandedMenu === item.key && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-50 overflow-hidden"
                          >
                            {item.type === 'mega' ? (
                              item.items.map((category, index) => (
                                <div key={index} className="px-6 py-3 border-b border-gray-100 last:border-0">
                                  <h4 className="font-semibold text-xs text-gray-900 mb-2 uppercase tracking-wider">
                                    {category.title}
                                  </h4>
                                  <ul className="space-y-1.5">
                                    {category.items.map((subItem, itemIndex) => (
                                      <li key={itemIndex}>
                                        <Link href={`/business/${subItem.toLowerCase().replace(/\s+/g, "-")}`}>
                                          <a onClick={handleLinkClick} className="block text-sm text-[#2B2B2B]/80 hover:text-[#B11226] py-1 transition-colors">
                                            {subItem}
                                          </a>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))
                            ) : item.type === 'dropdown' ? (
                              item.items.map((subItem, idx) => (
                                <Link key={idx} href={subItem.href}>
                                  <a onClick={handleLinkClick} className="block px-6 py-2.5 text-sm text-[#2B2B2B]/80 hover:text-[#B11226] hover:bg-gray-100 transition-colors">
                                    {subItem.label}
                                  </a>
                                </Link>
                              ))
                            ) : null}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                ))}

                {/* Login Button */}
                <div className="px-4 pt-4">
                  <Link href="/login">
                    <a onClick={handleLinkClick} className="flex items-center justify-center gap-2 w-full py-2.5 bg-transparent border border-gray-300/50 text-[#2B2B2B] text-sm font-medium rounded-full hover:border-[#B11226] hover:text-[#B11226] hover:bg-[#B11226]/5 transition-all duration-300">
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