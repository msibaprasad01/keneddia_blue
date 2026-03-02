import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import { siteContent } from "@/data/siteContent";
import CategoryHero from "./components/shared/CategoryHero";
import CategoryMenu from "./components/shared/CategoryMenu";
import ResturantpageEvents from "./resturantpage/ResturantpageEvents";
import Testimonials from "./components/Testimonials";
import ReservationForm from "./components/ReservationForm";
import { getAllVerticalCards } from "@/Api/RestaurantApi";
import { getAllGalleries } from "@/Api/Api";

import beverage from "@/assets/resturant_images/beverage.jpg";
import drink1 from "@/assets/resturant_images/drink1.jpg";
import drink2 from "@/assets/resturant_images/drink2.jpg";
import drink3 from "@/assets/resturant_images/drink3.jpg";
import food1 from "@/assets/resturant_images/food1.jpg";
import italian1 from "@/assets/resturant_images/italian1.jpg";
import item1 from "@/assets/resturant_images/item1.jpg";
import item2 from "@/assets/resturant_images/item2.jpg";

import luxury1 from "@/assets/resturant_images/luxuary/099A9508.JPG";
import luxury2 from "@/assets/resturant_images/luxuary/099A9535.JPG";
import luxury3 from "@/assets/resturant_images/luxuary/099A9684.JPG";
import luxury4 from "@/assets/resturant_images/luxuary/luxury1.JPG";
import luxury5 from "@/assets/resturant_images/luxuary/luxury2.JPG";

const LUXURY_IMAGES = [luxury1, luxury2, luxury3, luxury4, luxury5];
const SHUFFLED_LUXURY = [...LUXURY_IMAGES].sort(() => Math.random() - 0.5);

/* Navigation for Category Page */
const resturant_NAV_ITEMS = [
  { type: "link", label: "HOME", href: "/" },
  { type: "link", label: "MENU", href: "#menu" },
  { type: "link", label: "CONTACT", href: "#contact" },
];

const CARD_BG_COLORS = [
  {
    bgColor: "bg-orange-50 dark:bg-orange-950/10",
    hoverBg: "hover:bg-orange-50 dark:hover:bg-orange-900/20",
  },
  {
    bgColor: "bg-blue-50 dark:bg-blue-950/10",
    hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
  },
  {
    bgColor: "bg-red-50 dark:bg-red-950/10",
    hoverBg: "hover:bg-red-50 dark:hover:bg-red-900/20",
  },
  {
    bgColor: "bg-emerald-50 dark:bg-emerald-950/10",
    hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
  },
];

const generateSlug = (name) => name?.toLowerCase().trim().replace(/\s+/g, "-");

// Static menu & theme data keyed by slug — used until API provides menu data
const CATEGORY_DATA = {
  italian: {
    heroImage: italian1,
    themeColor: "#ef4444",
    menu: [
      {
        category: "Antipasti (Starters)",
        categoryImage: food1,
        items: [
          {
            name: "Bruschetta Trio",
            description: "Tomato, Mushroom, and Olive Tapenade.",
            price: "₹450",
            image: item1,
          },
          {
            name: "Arancini di Riso",
            description: "Crispy risotto balls stuffed with ragu.",
            price: "₹550",
            image: item2,
          },
        ],
      },
      {
        category: "Pasta & Zuppe",
        categoryImage: italian1,
        items: [
          {
            name: "Aglio e Olio",
            description: "Garlic, olive oil, and crushed chili flakes.",
            price: "₹650",
            isSpicy: true,
            image: food1,
          },
          {
            name: "Lasagna Classica",
            description: "Layered pasta with rich meat sauce.",
            price: "₹780",
            image: item2,
          },
        ],
      },
    ],
  },

  "luxury-lounge": {
    heroImage: SHUFFLED_LUXURY[0],
    themeColor: "#8b5cf6",
    menu: [
      {
        category: "Signature Cocktails",
        categoryImage: SHUFFLED_LUXURY[1],
        items: [
          {
            name: "Royal Old Fashioned",
            description: "Premium bourbon with smoked orange zest.",
            price: "₹850",
            image: SHUFFLED_LUXURY[2],
          },
          {
            name: "Velvet Martini",
            description: "Vodka infused with elderflower essence.",
            price: "₹900",
            image: SHUFFLED_LUXURY[3],
          },
        ],
      },
      {
        category: "Gourmet Bites",
        categoryImage: SHUFFLED_LUXURY[4],
        items: [
          {
            name: "Truffle Fries",
            description: "Crispy fries with truffle oil & parmesan.",
            price: "₹420",
            image: SHUFFLED_LUXURY[0],
          },
        ],
      },
    ],
  },

  "luxury-family-lounge": {
    heroImage: SHUFFLED_LUXURY[0],
    themeColor: "#8b5cf6",
    menu: [
      {
        category: "Signature Cocktails",
        categoryImage: SHUFFLED_LUXURY[1],
        items: [
          {
            name: "Royal Old Fashioned",
            description: "Premium bourbon with smoked orange zest.",
            price: "₹850",
            image: SHUFFLED_LUXURY[2],
          },
          {
            name: "Velvet Martini",
            description: "Vodka infused with elderflower essence.",
            price: "₹900",
            image: SHUFFLED_LUXURY[3],
          },
        ],
      },
      {
        category: "Gourmet Bites",
        categoryImage: SHUFFLED_LUXURY[4],
        items: [
          {
            name: "Truffle Fries",
            description: "Crispy fries with truffle oil & parmesan.",
            price: "₹420",
            image: SHUFFLED_LUXURY[0],
          },
        ],
      },
    ],
  },

  "spicy-darbar": {
    heroImage: food1,
    themeColor: "#f59e0b",
    menu: [
      {
        category: "Kebab & Tandoor",
        categoryImage: item2,
        items: [
          {
            name: "Murgh Malai Tikka",
            description: "Creamy chicken kebabs with cardamom.",
            price: "₹595",
            image: item1,
          },
          {
            name: "Paneer Tikka",
            description: "Char-grilled cottage cheese with spices.",
            price: "₹520",
            image: italian1,
          },
        ],
      },
    ],
  },

  takeaway: {
    heroImage: item1,
    themeColor: "#10b981",
    menu: [
      {
        category: "Quick Bites",
        categoryImage: item2,
        items: [
          {
            name: "Loaded Chicken Wrap",
            description: "Grilled chicken with spicy mayo.",
            price: "₹320",
            image: food1,
          },
          {
            name: "Veg Club Sandwich",
            description: "Triple layered with fresh veggies.",
            price: "₹280",
            image: italian1,
          },
        ],
      },
    ],
  },

  bakery: {
    heroImage: item2,
    themeColor: "#f472b6",
    menu: [
      {
        category: "Freshly Baked",
        categoryImage: item1,
        items: [
          {
            name: "Butter Croissant",
            description: "Flaky French classic baked daily.",
            price: "₹180",
            image: food1,
          },
          {
            name: "Chocolate Éclair",
            description: "Filled with rich vanilla custard.",
            price: "₹220",
            image: beverage,
          },
        ],
      },
    ],
  },
};

// Default fallback for slugs not yet in CATEGORY_DATA
const DEFAULT_STATIC = {
  heroImage: food1,
  themeColor: "#ef4444",
  menu: [
    {
      category: "Coming Soon",
      categoryImage: food1,
      items: [
        {
          name: "Menu updating",
          description: "Our menu will be available shortly.",
          price: "—",
          image: item1,
        },
      ],
    },
  ],
};

/* ── Other Verticals Grid (same card style as ResturantSubCategories) ── */
function OtherVerticalsSection({ experiences, propertyId }) {
  const navigate = useNavigate();

  if (!experiences || experiences.length === 0) return null;

  return (
    <section className="py-10 lg:py-20 bg-white dark:bg-[#080808]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-primary text-[11px] font-bold uppercase tracking-[0.4em]">
              Explore More
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-zinc-900 dark:text-white tracking-tight">
            Other <span className="italic text-primary">Verticals</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/resturant/${propertyId}/${exp.slug}`)}
              style={exp.isHexColor ? { backgroundColor: exp.bgColor } : {}}
              className={`
                group cursor-pointer relative flex transition-all duration-500 hover:shadow-2xl
                ${!exp.isHexColor ? exp.bgColor : ""} ${exp.hoverBg}
                w-full p-4 rounded-2xl flex-row items-center border border-zinc-100 dark:border-white/5 shadow-sm
                lg:flex-col lg:items-center lg:text-center lg:p-10 lg:rounded-[2.5rem] lg:w-[calc(25%-1.5rem)] lg:min-h-[420px] lg:hover:border-primary/20
              `}
            >
              <div className="shrink-0 overflow-hidden rounded-full border-4 border-white dark:border-zinc-800 shadow-lg z-20 transition-transform duration-500 group-hover:scale-110 w-14 h-14 lg:w-28 lg:h-28 lg:mb-8">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                />
              </div>

              <div className="flex flex-col flex-grow px-4 lg:px-0">
                <h3 className="text-lg lg:text-3xl font-serif text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors tracking-tight">
                  {exp.title}
                </h3>
                <p className="hidden lg:block text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mt-4 mb-6 line-clamp-4 font-light">
                  {exp.description}
                </p>
                <div className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                  <ChevronRight size={20} />
                </div>
                <div className="hidden lg:flex mt-auto items-center justify-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <ChevronRight size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    Explore Vertical
                  </span>
                  {exp.ctaButtonText && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(exp.link || "#");
                      }}
                      className="px-3 py-2 text-[10px] font-light uppercase tracking-wider bg-primary text-white rounded-full shadow-lg hover:scale-105 transition-all"
                    >
                      {exp.ctaButtonText}
                    </button>
                  )}
                </div>
              </div>

              <span className="hidden lg:block absolute bottom-8 right-10 text-7xl font-black text-zinc-900/[0.03] dark:text-white/[0.02] italic select-none">
                0{index + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Main Template ── */
function ResturantCategoryPageTemplate() {
  const { propertyId, categoryType } = useParams();
  const navigate = useNavigate();
  const [galleryData, setGalleryData] = useState([]);

  const [currentCategory, setCurrentCategory] = useState(null); // data for this vertical
  const [otherVerticals, setOtherVerticals] = useState([]); // all other verticals
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const normalizedSlug = categoryType?.toLowerCase().trim();

  // Scroll to top on category change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryType]);

  useEffect(() => {
    if (!propertyId) return;

    const fetchData = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        // 1️⃣ Fetch vertical cards
        const cardsRes = await getAllVerticalCards();
        const cards = cardsRes?.data || cardsRes || [];

        const filtered = cards
          .filter(
            (c) => String(c.propertyId) === String(propertyId) && c.isActive,
          )
          .sort((a, b) => a.displayOrder - b.displayOrder);

        const mapped = filtered.map((card, index) => {
          const slug = generateSlug(card.verticalName);
          const staticData = CATEGORY_DATA[slug] || DEFAULT_STATIC;

          return {
            slug,
            id: card.id,
            title: card.verticalName || card.itemName,
            description: card.description || "",
            image:
              card.media?.url ||
              "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800",
            link: card.link || "#",
            ctaButtonText: card.showOrderButton
              ? card.extraText || "Order"
              : null,
            bgColor:
              card.cardBackgroundColor ||
              CARD_BG_COLORS[index % CARD_BG_COLORS.length].bgColor,
            hoverBg: CARD_BG_COLORS[index % CARD_BG_COLORS.length].hoverBg,
            isHexColor: !!card.cardBackgroundColor,
            heroImage: card.media?.url || staticData.heroImage,
            themeColor: staticData.themeColor,
            menu: staticData.menu,
          };
        });

        const matched = mapped.find((m) => m.slug === normalizedSlug);

        if (!matched) {
          setNotFound(true);
        } else {
          setCurrentCategory(matched);
          setOtherVerticals(mapped.filter((m) => m.slug !== normalizedSlug));
        }

        // 2️⃣ Fetch gallery (same as homepage)
        const galleryRes = await getAllGalleries({
          page: 0,
          size: 100,
        });

        const allGallery = galleryRes?.data?.content || [];

        const filteredGallery = allGallery.filter(
          (g) =>
            String(g.propertyId) === String(propertyId) &&
            g.isActive &&
            g.media?.url &&
            g.categoryName?.toLowerCase() !== "3d",
        );

        console.log("[CategoryPage] Gallery:", filteredGallery);

        setGalleryData(filteredGallery);
      } catch (err) {
        console.error("[CategoryPage] Error:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propertyId, normalizedSlug]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#080808] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  /* ── Not Found ── */
  if (notFound || !currentCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar navItems={resturant_NAV_ITEMS} logo={siteContent.brand.logo} />
        <div className="py-40 text-center container mx-auto px-6">
          <h2 className="text-5xl font-serif mb-6 dark:text-white">
            Category Not Found
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            The culinary vertical you are looking for is currently unavailable.
          </p>
          <button
            onClick={() => navigate(`/resturant/${propertyId}`)}
            className="px-8 py-3 bg-primary text-white rounded-full font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg"
          >
            Return to Restaurant
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Page ── */
  return (
    <div className="min-h-screen bg-white dark:bg-[#080808] transition-colors duration-500">
      <Navbar navItems={resturant_NAV_ITEMS} logo={siteContent.brand.logo} />

      <main>
        {/* Hero */}
        <CategoryHero
          content={currentCategory}
          propertyId={propertyId}
          galleryData={galleryData}
        />

        {/* Menu */}
        <div id="menu">
          <CategoryMenu
            menu={currentCategory.menu}
            themeColor={currentCategory.themeColor}
          />
        </div>

        {/* Other Verticals (excluding current) */}
        <div id="categories">
          <OtherVerticalsSection
            experiences={otherVerticals}
            propertyId={propertyId}
          />
        </div>

        <div id="events">
          <ResturantpageEvents />
        </div>

        <div id="testimonials">
          <Testimonials />
        </div>

        <div id="ReservationForm">
          <ReservationForm />
        </div>
      </main>

      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}

export default ResturantCategoryPageTemplate;
