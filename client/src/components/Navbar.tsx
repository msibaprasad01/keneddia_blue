import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogIn } from "lucide-react";
import { siteContent } from "@/data/siteContent";

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-background ${scrolled ? "shadow-md" : ""}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-22">
          {/* wrapper: allow natural logo width, don't force 10rem */}
          <div className="flex items-center justify-start flex-shrink-0">
            <Link href="/">
              <a onClick={handleLinkClick} className="block opacity-90">
                <img
                  src={siteContent.brand.logo.image.src}
                  alt={siteContent.brand.logo.image.alt}
                  className="mix-blend-multiply h-16 lg:h-20 w-[8rem]"
                />
              </a>
            </Link>
          </div>

          {/* Desktop Navigation - Takes Remaining Space */}
          <div className="hidden lg:flex items-center justify-center flex-1 space-x-1">
            {navItems.map((item) => (
              <NavItem
                key={item.key}
                item={item}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                handleLinkClick={handleLinkClick}
              />
            ))}
          </div>

          {/* Right Actions - Auto Width */}
          <div className="hidden lg:flex items-center justify-end w-auto">
            <Link href="/login">
              <a onClick={handleLinkClick} className="flex items-center gap-2 px-5 py-2 bg-transparent border border-gray-300/50 text-[#2B2B2B] text-sm font-medium rounded-full hover:border-[#B11226] hover:text-[#B11226] hover:bg-[#B11226]/5 transition-all">
                <LogIn className="w-4 h-4" />
                LOGIN
              </a>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#2B2B2B] hover:text-[#B11226] transition-colors"
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
    </nav>
  );
}

// Desktop Nav Item Component
function NavItem({ item, activeDropdown, setActiveDropdown, handleLinkClick }: any) {
  return (
    <div
      className="relative"
      onMouseEnter={() => item.type !== 'link' && setActiveDropdown(item.key)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      {item.type === 'link' ? (
        <Link href={item.href}>
          <a onClick={handleLinkClick} className="flex items-center gap-1 px-2 lg:px-3 xl:px-4 py-2 text-xs lg:text-sm font-medium text-[#2B2B2B] hover:text-[#B11226] transition-colors relative whitespace-nowrap">
            {item.label}
            {activeDropdown === item.key && <ActiveIndicator />}
          </a>
        </Link>
      ) : (
        <>
          <button className="flex items-center gap-1 px-2 lg:px-3 xl:px-4 py-2 text-xs lg:text-sm font-medium text-[#2B2B2B] hover:text-[#B11226] transition-colors relative whitespace-nowrap">
            {item.label}
            <ChevronDown className="w-4 h-4" />
            {activeDropdown === item.key && <ActiveIndicator />}
          </button>

          <AnimatePresence>
            {activeDropdown === item.key && (
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
      className="absolute bottom-0 left-0 right-0 h-1 bg-[#B11226]"
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
      className={`absolute top-full mt-0 bg-background shadow-xl border-t-4 border-primary ${item.type === 'mega' ? "left-1/2 -translate-x-1/2 shadow-2xl" : "right-0 w-64"
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
            <h3 className="font-bold text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">
              {category.title}
            </h3>
            <ul className="space-y-2.5">
              {category.items.map((subItem: string, itemIndex: number) => (
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
  );
}

// Simple Dropdown Component
function SimpleDropdown({ items, handleLinkClick }: any) {
  return (
    <div className="py-3">
      {items.map((subItem: any, idx: number) => (
        <Link key={idx} href={subItem.href}>
          <a onClick={handleLinkClick} className="block px-6 py-3 text-sm text-[#2B2B2B] hover:bg-gray-50 hover:text-[#B11226] transition-colors">
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
          className="lg:hidden border-t border-gray-200 overflow-hidden"
        >
          <div className="py-4 max-h-[70vh] overflow-y-auto">
            {navItems.map((item: NavItem) =>
              item.type === 'link' ? (
                <Link key={item.key} href={item.href}>
                  <a onClick={handleLinkClick} className="block px-4 py-3 text-sm font-medium text-[#2B2B2B] hover:bg-gray-50 hover:text-[#B11226] transition-colors border-b border-gray-100">
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
                <a onClick={handleLinkClick} className="flex items-center justify-center gap-2 w-full py-2.5 bg-transparent border border-gray-300/50 text-[#2B2B2B] text-sm font-medium rounded-full hover:border-[#B11226] hover:text-[#B11226] hover:bg-[#B11226]/5 transition-all">
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
    <div className="border-b border-gray-100">
      <button
        onClick={() => setMobileExpandedMenu(isExpanded ? null : item.key)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[#2B2B2B] hover:bg-gray-50 hover:text-[#B11226] transition-colors"
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
            className="bg-gray-50 overflow-hidden"
          >
            {item.type === 'mega' ? (
              item.items.map((category: any, index: number) => (
                <div key={index} className="px-6 py-3 border-b border-gray-100 last:border-0">
                  <h4 className="font-semibold text-xs text-gray-900 mb-2 uppercase tracking-wider">
                    {category.title}
                  </h4>
                  <ul className="space-y-1.5">
                    {category.items.map((subItem: string, itemIndex: number) => (
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
            ) : (
              item.items.map((subItem: any, idx: number) => (
                <Link key={idx} href={subItem.href}>
                  <a onClick={handleLinkClick} className="block px-6 py-2.5 text-sm text-[#2B2B2B]/80 hover:text-[#B11226] hover:bg-gray-100 transition-colors">
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