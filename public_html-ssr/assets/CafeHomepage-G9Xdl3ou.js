import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useRef } from "react";
import { s as siteContent, B as Button, L as Label, N as Navbar, F as Footer } from "../entry-server.js";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Coffee, ChevronLeft, ChevronRight, Search, ChevronUp, MapPin, Star, ArrowRight, Clock, Gift, Users, ArrowUpRight, ChevronDown } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import "react-dom/server";
import "react-router";
import "@tanstack/react-query";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "react-toastify";
import "@radix-ui/react-dialog";
import "cmdk";
import "axios";
import "@radix-ui/react-slot";
import "react-hot-toast";
import "@radix-ui/react-avatar";
import "react-calendar";
import "@radix-ui/react-label";
import "@heroicons/react/24/outline";
import "@heroicons/react/24/solid";
const SLIDES$1 = [
  {
    id: 1,
    tag: "House Roasts",
    title: "Slow Coffee, Warm Light, All-Day Conversations",
    desc: "Single-origin pours, flaky bakes, and a calm cafe rhythm built for mornings that stretch into evenings.",
    img: siteContent.images.cafes.parisian.src,
    bgTitle: "AROMA"
  },
  {
    id: 2,
    tag: "Bakery Counter",
    title: "Fresh Bakes Paired With Signature Brews",
    desc: "From buttery croissants to indulgent desserts, every table begins with coffee and ends with comfort.",
    img: siteContent.images.cafes.bakery.src,
    bgTitle: "BAKERY"
  },
  {
    id: 3,
    tag: "Tea Lounge",
    title: "An Elevated Cafe Escape For Catch-Ups And Quiet Hours",
    desc: "High tea service, lounge seating, and a softer hospitality format designed for intimate social time.",
    img: siteContent.images.cafes.highTea.src,
    bgTitle: "LOUNGE"
  }
];
function CafeHeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES$1.length);
    }, 6e3);
    return () => window.clearInterval(timer);
  }, []);
  const goToSlide = (index) => {
    setActiveIndex((index + SLIDES$1.length) % SLIDES$1.length);
  };
  const activeSlide = SLIDES$1[activeIndex];
  return /* @__PURE__ */ jsxs("section", { className: "relative h-[90vh] w-full overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 1.04 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.9, ease: "easeOut" },
        className: "absolute inset-0",
        children: [
          /* @__PURE__ */ jsx("img", { src: activeSlide.img, alt: activeSlide.title, className: "hidden h-full w-full object-cover md:block" }),
          /* @__PURE__ */ jsx("img", { src: activeSlide.img, alt: activeSlide.title, className: "block h-full w-full object-cover md:hidden" })
        ]
      },
      activeSlide.id
    ) }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 hidden bg-gradient-to-r from-black/80 via-black/40 to-transparent md:block" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/15 md:hidden" }),
    /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-1/4 hidden whitespace-nowrap text-[16rem] font-black italic text-white/[0.03] pointer-events-none md:block", children: activeSlide.bgTitle }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 hidden h-full items-center md:flex", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto flex h-full items-center px-8 md:px-16 lg:px-24", children: /* @__PURE__ */ jsxs("div", { className: "w-full md:w-[70%] xl:w-[60%]", children: [
      /* @__PURE__ */ jsx(
        motion.h1,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15, duration: 0.8 },
          className: "mb-6 text-4xl font-serif font-medium leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl",
          children: activeSlide.title
        },
        `title-${activeSlide.id}`
      ),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.3, duration: 0.8 },
          className: "mb-10 max-w-2xl text-lg font-light uppercase tracking-[0.18em] text-white/85",
          children: activeSlide.desc
        },
        `desc-${activeSlide.id}`
      )
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 block md:hidden", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full overflow-hidden bg-black", style: { height: "calc(75vw + 64px)", minHeight: "320px", maxHeight: "500px" }, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 overflow-hidden", style: { top: "64px" }, children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
        motion.img,
        {
          src: activeSlide.img,
          alt: activeSlide.title,
          initial: { opacity: 0, scale: 1.03 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.7 },
          className: "absolute inset-0 h-full w-full object-cover"
        },
        `mobile-${activeSlide.id}`
      ) }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 pointer-events-none", style: { top: "64px" }, children: /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/55 to-transparent" }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 z-20 flex flex-col items-center justify-center px-5 text-center", style: { top: "64px", bottom: "2.5rem" }, children: [
        /* @__PURE__ */ jsx(
          motion.span,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
            className: "mb-2 inline-flex rounded-full bg-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80 backdrop-blur-md",
            children: activeSlide.tag
          },
          `m-tag-${activeSlide.id}`
        ),
        /* @__PURE__ */ jsx(
          motion.h1,
          {
            initial: { opacity: 0, y: 14 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.15, duration: 0.6 },
            className: "mb-2 text-xl font-serif font-semibold leading-snug text-white drop-shadow-md",
            children: activeSlide.title
          },
          `m-title-${activeSlide.id}`
        ),
        /* @__PURE__ */ jsx(
          motion.p,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3, duration: 0.6 },
            className: "mb-4 text-[11px] font-light uppercase tracking-[0.18em] text-white/75",
            children: activeSlide.desc
          },
          `m-desc-${activeSlide.id}`
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.92 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.45, duration: 0.6 },
            className: "flex flex-wrap items-center justify-center gap-3",
            children: [
              /* @__PURE__ */ jsxs(Button, { className: "h-auto rounded-full border border-amber-300/40 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-5 py-2 text-xs font-semibold text-gray-900 shadow-[0_4px_16px_rgba(251,191,36,0.35)]", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-3.5 w-3.5" }),
                "Reserve"
              ] }),
              /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "h-auto rounded-full border-white/30 bg-white/5 px-5 py-2 text-xs font-semibold text-white backdrop-blur-md", children: [
                /* @__PURE__ */ jsx(Coffee, { className: "mr-2 h-3.5 w-3.5" }),
                "Menu"
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => goToSlide(activeIndex - 1), className: "flex h-7 w-7 items-center justify-center rounded-full border border-white/40 text-white backdrop-blur-sm transition-colors hover:bg-white/20", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5", children: SLIDES$1.map((_, index) => /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => goToSlide(index),
            className: `h-[3px] cursor-pointer rounded-full transition-all duration-500 ${activeIndex === index ? "w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" : "w-4 bg-white/40 hover:bg-white/70"}`
          },
          `mob-dot-${index}`
        )) }),
        /* @__PURE__ */ jsx("button", { onClick: () => goToSlide(activeIndex + 1), className: "flex h-7 w-7 items-center justify-center rounded-full border border-white/40 text-white backdrop-blur-sm transition-colors hover:bg-white/20", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-48 right-4 z-20 hidden max-w-[calc(100vw-2rem)] flex-col items-end gap-4 md:flex md:right-8 lg:right-12", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-row items-end gap-2 overflow-hidden md:gap-3 lg:gap-4", children: SLIDES$1.map((slide, index) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.12 + 0.35 },
          onClick: () => goToSlide(index),
          className: `group relative h-28 w-[67px] flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-500 ease-out md:h-[134px] md:w-[78px] lg:h-[179px] lg:w-28 ${activeIndex === index ? "z-10 scale-105 ring-2 ring-[#FDFBF7] shadow-2xl" : "grayscale opacity-60 hover:opacity-100 hover:grayscale-0"}`,
          children: [
            /* @__PURE__ */ jsx("img", { src: slide.img, alt: slide.title, className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-2 md:p-3", children: /* @__PURE__ */ jsx("p", { className: "truncate text-[10px] font-medium text-white/90 md:text-xs", children: slide.tag }) })
          ]
        },
        `thumbnail-${slide.id}`
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pr-2 md:gap-4 lg:gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5 md:gap-2", children: SLIDES$1.map((_, index) => /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => goToSlide(index),
            className: `h-[3px] cursor-pointer rounded-full transition-all duration-500 ${activeIndex === index ? "w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] md:w-10 lg:w-12" : "w-4 bg-white/30 hover:bg-white/60 md:w-5 lg:w-6"}`
          },
          `indicator-${index}`
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 md:gap-3", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => goToSlide(activeIndex - 1), className: "flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black md:h-10 md:w-10", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-3 w-3 md:h-4 md:w-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => goToSlide(activeIndex + 1), className: "flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black md:h-10 md:w-10", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3 md:h-4 md:w-4" }) })
        ] })
      ] })
    ] })
  ] });
}
const VISIT_TYPES = [
  { value: "coffee", label: "Coffee Date" },
  { value: "work", label: "Work Session" },
  { value: "high-tea", label: "High Tea" }
];
const LOCATIONS = [
  { value: "ghaziabad", label: "Ghaziabad" },
  { value: "delhi", label: "Delhi" },
  { value: "noida", label: "Noida" }
];
const CAFES$1 = [
  { id: 1, name: "Kennedia Roast Room", type: "coffee", location: "ghaziabad", specialty: "Espresso Bar", timing: "8:00 AM - 10:30 PM" },
  { id: 2, name: "Kennedia Library Cafe", type: "work", location: "delhi", specialty: "Quiet Seating + Fast Wi-Fi", timing: "9:00 AM - 11:00 PM" },
  { id: 3, name: "Kennedia High Tea Lounge", type: "high-tea", location: "noida", specialty: "Tea Towers + Desserts", timing: "11:30 AM - 9:30 PM" },
  { id: 4, name: "Garden Brew Terrace", type: "coffee", location: "noida", specialty: "Cold Brew + Outdoor Seating", timing: "8:30 AM - 9:30 PM" }
];
function PillSelect({ options, value, onChange, placeholder }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
    options.map((option) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(option.value),
        className: `rounded-full border px-4 py-2 text-sm transition-colors ${value === option.value ? "border-primary bg-primary text-primary-foreground" : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-primary/40"}`,
        children: option.label
      },
      option.value
    )),
    !value && /* @__PURE__ */ jsx("span", { className: "self-center text-sm text-zinc-400", children: placeholder })
  ] });
}
function CafeQuickBooking() {
  const [visitType, setVisitType] = useState("");
  const [location, setLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const matches = useMemo(() => {
    if (!visitType || !location) return [];
    return CAFES$1.filter((cafe) => cafe.type === visitType && cafe.location === location);
  }, [visitType, location]);
  return /* @__PURE__ */ jsxs("section", { id: "reservation", className: "relative overflow-hidden bg-white py-12 transition-colors duration-500 dark:bg-[#050505]", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-8 select-none text-[6rem] font-black uppercase italic text-zinc-900/[0.03] dark:text-white/[0.02] md:text-[8rem]", children: "Quick Booking" }),
    /* @__PURE__ */ jsxs("div", { className: "container relative z-10 mx-auto px-6", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-7 max-w-3xl", children: /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-serif leading-tight text-zinc-900 dark:text-white md:text-3xl", children: [
        "Plan A Better Cafe Stop.",
        /* @__PURE__ */ jsx("span", { className: "italic text-zinc-400 dark:text-white/30", children: " Faster." })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-[1.5rem] border border-zinc-200 bg-white/80 p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 md:p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-zinc-200 pb-6 dark:border-white/10", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold uppercase tracking-[0.35em] text-primary", children: "Select Visit Type" }),
              /* @__PURE__ */ jsx(PillSelect, { options: VISIT_TYPES, value: visitType, onChange: setVisitType, placeholder: "Choose a cafe format" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-[10px] font-bold uppercase tracking-[0.35em] text-primary", children: "Select Location" }),
              /* @__PURE__ */ jsx(PillSelect, { options: LOCATIONS, value: location, onChange: setLocation, placeholder: "Choose a city" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: () => setIsOpen(true),
                disabled: !(visitType && location),
                className: "h-10 rounded-full bg-zinc-900 px-6 text-sm text-white transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-primary dark:hover:text-white",
                children: [
                  /* @__PURE__ */ jsx(Search, { className: "mr-2 h-4 w-4" }),
                  "Search"
                ]
              }
            ),
            isOpen && /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: () => setIsOpen(false),
                variant: "outline",
                className: "h-10 rounded-full border-zinc-200 px-6 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5",
                children: [
                  /* @__PURE__ */ jsx(ChevronUp, { className: "mr-2 h-4 w-4" }),
                  "Hide"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: isOpen && /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
            style: { overflow: "hidden" },
            children: /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500 dark:text-white/40", children: "Available Cafes" }),
                  /* @__PURE__ */ jsx("h3", { className: "mt-1.5 text-xl font-serif text-zinc-900 dark:text-white", children: "Curated picks for your visit" })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500 dark:text-white/50", children: [
                  matches.length,
                  " option",
                  matches.length === 1 ? "" : "s",
                  " available"
                ] })
              ] }),
              matches.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: matches.map((cafe, index) => /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: index * 0.08, duration: 0.3 },
                  className: "flex min-h-[248px] flex-col justify-between rounded-[1.2rem] border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5",
                  children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
                        /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary", children: VISIT_TYPES.find((item) => item.value === cafe.type)?.label }),
                        /* @__PURE__ */ jsx(Coffee, { className: "h-4 w-4 text-zinc-400 dark:text-white/40" })
                      ] }),
                      /* @__PURE__ */ jsx("h4", { className: "text-lg font-serif text-zinc-900 dark:text-white", children: cafe.name }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-2.5 space-y-1.5 text-sm text-zinc-600 dark:text-white/60", children: [
                        /* @__PURE__ */ jsx("p", { children: cafe.specialty }),
                        /* @__PURE__ */ jsx("p", { children: cafe.timing }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-primary" }),
                          /* @__PURE__ */ jsx("span", { children: LOCATIONS.find((item) => item.value === cafe.location)?.label })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        onClick: () => document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" }),
                        className: "mt-5 h-10 rounded-full bg-zinc-900 text-sm text-white transition-all hover:bg-primary dark:bg-white dark:text-black dark:hover:bg-primary dark:hover:text-white",
                        children: "Reserve"
                      }
                    )
                  ]
                },
                cafe.id
              )) }) : /* @__PURE__ */ jsx("div", { className: "flex min-h-[160px] items-center justify-center rounded-[1.2rem] border border-dashed border-zinc-200 dark:border-white/10", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400 dark:text-white/30", children: "No options available for this combination." }) })
            ] })
          },
          "results"
        ) })
      ] })
    ] })
  ] });
}
const CAFES = [
  {
    id: 1,
    name: "Kennedia Roast Room",
    city: "Ghaziabad",
    location: "Raj Nagar Extension, Ghaziabad",
    type: "Cafe",
    image: siteContent.images.cafes.minimalist,
    rating: 4.7,
    description: "A modern espresso room with mellow interiors, pastry displays, and long-stay seating.",
    highlights: ["Espresso Bar", "Work-Friendly", "Dessert Counter"]
  },
  {
    id: 2,
    name: "Kennedia Garden Terrace Cafe",
    city: "Noida",
    location: "Sector 62, Noida",
    type: "Cafe",
    image: siteContent.images.cafes.garden,
    rating: 4.8,
    description: "An open-air cafe setup designed for daytime brunches, relaxed meetings, and sunset coffee.",
    highlights: ["Outdoor Seating", "Brunch Menu", "Cold Brew"]
  },
  {
    id: 3,
    name: "Kennedia High Tea Lounge",
    city: "Delhi",
    location: "Connaught Place, New Delhi",
    type: "Cafe",
    image: siteContent.images.cafes.highTea,
    rating: 4.9,
    description: "An elevated tea-and-dessert lounge with plated sweets, polished service, and soft evening ambience.",
    highlights: ["High Tea", "Patisserie", "Lounge Seating"]
  }
];
function CafeProperties() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const cities = useMemo(() => ["All Cities", ...new Set(CAFES.map((item) => item.city))], []);
  const filteredCafes = useMemo(() => {
    if (selectedCity === "All Cities") return CAFES;
    return CAFES.filter((item) => item.city === selectedCity);
  }, [selectedCity]);
  const activeCafe = filteredCafes[activeIndex] || filteredCafes[0];
  if (!activeCafe) return null;
  const handlePrev = () => {
    setActiveIndex((prev) => prev === 0 ? filteredCafes.length - 1 : prev - 1);
  };
  const handleNext = () => {
    setActiveIndex((prev) => prev === filteredCafes.length - 1 ? 0 : prev + 1);
  };
  return /* @__PURE__ */ jsx("section", { className: "relative overflow-hidden bg-gradient-to-br from-background via-secondary/5 to-background py-6", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 lg:px-12", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 rounded-xl border border-border bg-card p-4 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary", children: "Cafe Collection" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-serif text-foreground md:text-2xl", children: "Our Cafes" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: cities.map((city) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setSelectedCity(city);
            setActiveIndex(0);
          },
          className: `rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${selectedCity === city ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
          children: city
        },
        city
      )) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-[60%_40%]", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl", children: [
        /* @__PURE__ */ jsx("img", { src: activeCafe.image.src, alt: activeCafe.image.alt || activeCafe.name, className: "h-[500px] w-full object-cover" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 text-white", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]", children: activeCafe.type }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif font-semibold", children: activeCafe.name }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 text-sm text-white/80", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: activeCafe.location })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 right-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("button", { onClick: handlePrev, className: "flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: handleNext, className: "flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex h-[500px] flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary", children: "Signature Cafe" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1", children: [
              /* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5 fill-current text-yellow-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-yellow-900", children: activeCafe.rating })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-serif font-semibold text-foreground", children: activeCafe.name }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: activeCafe.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-muted/30 px-3 py-3 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "City" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-foreground", children: activeCafe.city })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-muted/30 px-3 py-3 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Type" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-foreground", children: activeCafe.type })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-muted/30 px-3 py-3 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Rating" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-foreground", children: activeCafe.rating })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 text-xs font-bold uppercase tracking-wider text-foreground", children: "Cafe Highlights" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: activeCafe.highlights.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
              /* @__PURE__ */ jsx("span", { children: item })
            ] }, item)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" }),
              className: "flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold uppercase text-primary-foreground shadow-md",
              children: [
                "Reserve A Table ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("button", { onClick: handleNext, className: "w-full py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground", children: "Browse next cafe →" })
        ] })
      ] })
    ] })
  ] }) });
}
const ABOUT_SECTIONS = [
  {
    id: 1,
    subTitle: "Neighbourhood Cafe",
    sectionTitle: "Coffee First. Atmosphere Always.",
    description: "Our cafe concept blends specialty coffee, bakery-led comfort, and softer hospitality. The experience is shaped for morning regulars, casual meetings, and guests who want time to stay rather than rush.",
    image: siteContent.images.cafes.library.src
  },
  {
    id: 2,
    subTitle: "Tea & Dessert Lounge",
    sectionTitle: "A Slower Format Built Around Warm Service",
    description: "From plated desserts and tea towers to low-light lounge corners, every detail is arranged to feel intimate, polished, and easy to return to throughout the week.",
    image: siteContent.images.cafes.highTea.src
  }
];
function CafeAbout() {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ABOUT_SECTIONS.length);
    }, 5e3);
    return () => clearInterval(timer);
  }, []);
  const section = ABOUT_SECTIONS[currentIndex];
  return /* @__PURE__ */ jsx("section", { id: "about", className: "bg-white px-6 py-8 transition-colors duration-500 dark:bg-[#050505]", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 items-center gap-8 lg:grid-cols-[45%_55%]", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -50 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        className: "relative",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200/10 shadow-2xl dark:border-white/10", children: [
            /* @__PURE__ */ jsx("img", { src: section.image, alt: section.sectionTitle, className: "h-full w-full object-cover" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-4 -right-4 h-2/3 w-2/3 rounded-xl border-2 border-primary/20 -z-0" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -left-4 -top-4 h-1/2 w-1/2 rounded-xl bg-zinc-100/80 -z-0 dark:bg-white/5" })
        ]
      },
      `about-image-${currentIndex}`
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative lg:pl-4", children: [
      /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
          transition: { duration: 0.5 },
          className: "space-y-4",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h3", { className: "mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
                section.subTitle
              ] }),
              /* @__PURE__ */ jsx("h2", { className: "mb-3 text-3xl font-serif leading-tight text-zinc-900 dark:text-white md:text-4xl", children: section.sectionTitle })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-base font-light leading-relaxed text-zinc-500 dark:text-white/60", children: section.description }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6 border-t border-zinc-200 pt-2 dark:border-white/10", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "mb-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/40", children: "Availability" }),
                /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 font-serif text-base italic text-zinc-900 dark:text-white", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5 text-primary" }),
                  "8:00 AM - 11:00 PM"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] font-bold tracking-tighter text-zinc-400 dark:text-white/30", children: "MONDAY - SUNDAY" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "mb-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-white/40", children: "Connect" }),
                /* @__PURE__ */ jsx("a", { href: "tel:+919999999999", className: "block font-serif text-base italic text-zinc-900 transition-colors hover:text-primary dark:text-white", children: "+91 999 999 9999" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-tighter text-zinc-400 dark:text-white/30", children: "Reservations & Private Tables" })
              ] })
            ] })
          ]
        },
        currentIndex
      ) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex gap-2", children: ABOUT_SECTIONS.map((_, idx) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setCurrentIndex(idx),
          className: `h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-6 bg-primary" : "w-3 bg-zinc-200 hover:bg-primary/50 dark:bg-white/10"}`
        },
        idx
      )) })
    ] })
  ] }) }) });
}
const SLIDES = [
  {
    id: "offer-1",
    type: "Offer",
    title: "Morning Brew & Bake Combo",
    description: "Fresh croissant, house roast, and a quick breakfast format designed for early hours.",
    image: siteContent.images.cafes.bakery.src,
    icon: Gift
  },
  {
    id: "booking-1",
    type: "Group Booking",
    title: "Creative Team Coffee Meetups",
    description: "Pre-set tables, quick service flow, and shared platters for compact office gatherings.",
    image: siteContent.images.cafes.minimalist.src,
    icon: Users
  },
  {
    id: "event-1",
    type: "Event",
    title: "Acoustic Evenings & Slow Sips",
    description: "Intimate live sessions paired with curated brews and dessert tastings.",
    image: siteContent.images.cafes.garden.src,
    icon: Calendar
  },
  {
    id: "offer-2",
    type: "Offer",
    title: "High Tea For Two",
    description: "Tea tower service with petit desserts and savouries in a lounge-style format.",
    image: siteContent.images.cafes.highTea.src,
    icon: Gift
  },
  {
    id: "booking-2",
    type: "Group Booking",
    title: "Celebration Tables For Small Parties",
    description: "Birthdays, catch-ups, and cosy celebrations arranged with dessert add-ons.",
    image: siteContent.images.cafes.parisian.src,
    icon: Users
  },
  {
    id: "event-2",
    type: "Event",
    title: "Latte Art Workshops",
    description: "Interactive cafe sessions focused on pouring techniques, beans, and tasting notes.",
    image: siteContent.images.cafes.library.src,
    icon: Coffee
  }
];
function CafeShowcaseSlider() {
  const [swiper, setSwiper] = useState(null);
  return /* @__PURE__ */ jsx("section", { id: "showcase", className: "bg-muted py-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-[92%] max-w-7xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-primary", children: "Offers • Group Booking • Events" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif md:text-3xl", children: "Cafe Showcase" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => swiper?.slidePrev(), className: "rounded-full border border-border bg-background p-2 shadow-sm transition-colors hover:bg-muted", children: /* @__PURE__ */ jsx(ChevronLeft, { size: 18 }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => swiper?.slideNext(), className: "rounded-full border border-border bg-background p-2 shadow-sm transition-colors hover:bg-muted", children: /* @__PURE__ */ jsx(ChevronRight, { size: 18 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [Navigation, Autoplay],
        slidesPerView: 1,
        spaceBetween: 16,
        breakpoints: {
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        },
        autoplay: {
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        onSwiper: setSwiper,
        children: SLIDES.map((item) => {
          const Icon = item.icon;
          return /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsxs("article", { className: "group relative flex h-[420px] overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl", children: [
            /* @__PURE__ */ jsx("img", { src: item.image, alt: item.title, className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex h-full flex-col justify-between p-5 text-white", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur-sm", children: item.type }),
                /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif font-semibold leading-tight", children: item.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-white/78", children: item.description }),
                /* @__PURE__ */ jsx("button", { className: "mt-5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] backdrop-blur-sm transition-colors hover:bg-white hover:text-black", children: "Explore" })
              ] })
            ] })
          ] }) }, item.id);
        })
      }
    )
  ] }) });
}
const cafeNewsItems = [
  {
    id: 1,
    category: "Cafe",
    title: "Kennedia Launches A New Single-Origin Coffee Program",
    description: "The cafe introduces rotating beans, guided tasting notes, and brew options designed around a slower specialty format.",
    dateBadge: "2026-02-21",
    badgeType: "Press Release",
    ctaText: "Read Story",
    ctaLink: "/news/kennedia-single-origin-coffee-program",
    imageUrl: siteContent.images.cafes.minimalist.src
  },
  {
    id: 2,
    category: "Cafe",
    title: "High Tea Lounge Format Expands With Weekend Dessert Service",
    description: "New tea towers, plated patisserie, and lounge sets extend the cafe into a more elevated afternoon experience.",
    dateBadge: "2026-01-18",
    badgeType: "Feature",
    ctaText: "Read Story",
    ctaLink: "/news/kennedia-high-tea-lounge-expansion",
    imageUrl: siteContent.images.cafes.highTea.src
  },
  {
    id: 3,
    category: "Cafe",
    title: "Neighbourhood Events Calendar Adds Acoustic Nights And Workshops",
    description: "Kennedia builds a lighter events rhythm around live sessions, tasting tables, and intimate community gatherings.",
    dateBadge: "2025-12-09",
    badgeType: "Update",
    ctaText: "Read Story",
    ctaLink: "/news/kennedia-cafe-events-calendar",
    imageUrl: siteContent.images.cafes.garden.src
  }
];
function NewsCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(item.dateBadge).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxs("div", { className: "group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-primary/50", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative w-full overflow-hidden bg-black", children: [
      /* @__PURE__ */ jsx("img", { src: item.imageUrl, alt: item.title, className: "block h-auto w-full object-contain transition-transform duration-700 group-hover:scale-105", style: { maxHeight: "280px", minHeight: "140px" } }),
      /* @__PURE__ */ jsx("div", { className: "absolute left-3 top-3", children: /* @__PURE__ */ jsx("span", { className: "rounded bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md", children: date }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-grow flex-col p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-2 text-xs font-bold uppercase tracking-wider text-primary", children: [
        item.category,
        " • ",
        item.badgeType
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "mb-3 line-clamp-2 text-lg font-serif font-bold leading-tight text-foreground transition-colors group-hover:text-primary", children: item.title }),
      /* @__PURE__ */ jsxs("div", { className: "flex-grow", children: [
        /* @__PURE__ */ jsx("p", { className: `text-sm leading-relaxed text-muted-foreground transition-all duration-300 ${expanded ? "" : "line-clamp-2"}`, children: item.description }),
        item.description.length > 100 && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            },
            className: "mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline",
            children: expanded ? /* @__PURE__ */ jsxs(Fragment, { children: [
              "Show less ",
              /* @__PURE__ */ jsx(ChevronUp, { className: "h-3 w-3" })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              "Show more ",
              /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3" })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 border-t border-border/50 pt-2", children: /* @__PURE__ */ jsxs(Link, { to: item.ctaLink, className: "group/link inline-flex items-center gap-1.5 pt-2 text-xs font-bold text-foreground transition-colors hover:text-primary", children: [
        item.ctaText,
        /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" })
      ] }) })
    ] })
  ] });
}
function CafeNewsSection() {
  const swiperRef = useRef(null);
  return /* @__PURE__ */ jsx("section", { id: "news", className: "relative overflow-hidden bg-background py-12 md:py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 lg:px-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif text-foreground md:text-3xl", children: "Cafe News & Press" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/news", className: "hidden items-center gap-1.5 text-sm font-semibold text-primary transition-all hover:gap-2.5 md:flex", children: [
          "View All ",
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => swiperRef.current?.slidePrev(), className: "flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-all hover:bg-primary hover:text-primary-foreground", "aria-label": "Previous", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => swiperRef.current?.slideNext(), className: "flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-all hover:bg-primary hover:text-primary-foreground", "aria-label": "Next", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [Autoplay, Navigation],
        spaceBetween: 24,
        slidesPerView: 1,
        loop: false,
        autoplay: { delay: 5e3, disableOnInteraction: false },
        breakpoints: {
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        },
        onSwiper: (swiper) => {
          swiperRef.current = swiper;
        },
        className: "w-full pb-4",
        children: cafeNewsItems.map((item) => /* @__PURE__ */ jsx(SwiperSlide, { className: "!h-auto", children: /* @__PURE__ */ jsx(NewsCard, { item }) }, item.id))
      }
    )
  ] }) });
}
const guestReviews = [
  {
    id: 1,
    author: "Ritika Sharma",
    description: "The roast quality stood out immediately. It felt calm, polished, and genuinely designed for longer catch-ups.",
    imageUrl: siteContent.images.cafes.minimalist.src
  },
  {
    id: 2,
    author: "Arjun Mehta",
    description: "We used it for a small work session and the service pace was exactly right. Quiet enough to stay productive.",
    imageUrl: siteContent.images.cafes.library.src
  },
  {
    id: 3,
    author: "Sneha Kapoor",
    description: "High tea here feels premium without becoming stiff. Desserts, tea selection, and seating were all very strong.",
    imageUrl: siteContent.images.cafes.highTea.src
  },
  {
    id: 4,
    author: "Kabir Sethi",
    description: "One of the better cafe interiors for evening meetups. Warm light, good dessert program, and strong repeat value.",
    imageUrl: siteContent.images.cafes.parisian.src
  }
];
function CafeGuestReviews() {
  const swiperRef = useRef(null);
  return /* @__PURE__ */ jsx("section", { id: "reviews", className: "bg-background py-12", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-6 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs font-bold uppercase tracking-widest text-primary", children: "Guest Impressions" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif font-bold italic", children: "Cafe Moments Worth Returning For" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-1 flex items-center justify-end gap-1 text-primary", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(Star, { size: 14, className: "fill-primary text-primary" }, i)) }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-tighter", children: "Average guest cafe rating" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [Autoplay, Navigation],
        spaceBetween: 15,
        slidesPerView: 1.2,
        breakpoints: { 768: { slidesPerView: 3 } },
        autoplay: { delay: 6e3, disableOnInteraction: false },
        onSwiper: (s) => {
          swiperRef.current = s;
        },
        onMouseEnter: () => {
          swiperRef.current?.autoplay?.stop();
        },
        onMouseLeave: () => {
          swiperRef.current?.autoplay?.start();
        },
        className: "h-full w-full",
        children: guestReviews.map((item) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx("div", { className: "group flex h-full flex-col overflow-hidden rounded-xl border bg-background", children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-[3/4] overflow-hidden bg-muted", children: [
          /* @__PURE__ */ jsx("img", { src: item.imageUrl, alt: item.author, className: "h-full w-full object-cover" }),
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/25 to-transparent p-4", children: [
            /* @__PURE__ */ jsxs("p", { className: "line-clamp-4 text-base italic text-white", children: [
              '"',
              item.description,
              '"'
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-white", children: item.author })
          ] })
        ] }) }) }, item.id))
      }
    )
  ] }) }) });
}
const CAFE_NAV_ITEMS = [
  { type: "link", label: "HOME", key: "home", href: "#home" },
  { type: "link", label: "ABOUT", key: "about", href: "#about" },
  { type: "link", label: "SHOWCASE", key: "showcase", href: "#showcase" },
  { type: "link", label: "NEWS", key: "news", href: "#news" },
  { type: "link", label: "RESERVATION", key: "reservation", href: "#reservation" }
];
function CafeHomepage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background [scrollbar-gutter:stable]", children: [
    /* @__PURE__ */ jsx(Navbar, { navItems: CAFE_NAV_ITEMS, logo: siteContent.brand.logo_restaurant }),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("div", { id: "home", children: /* @__PURE__ */ jsx(CafeHeroBanner, {}) }),
      /* @__PURE__ */ jsx(CafeQuickBooking, {}),
      /* @__PURE__ */ jsx(CafeProperties, {}),
      /* @__PURE__ */ jsx(CafeAbout, {}),
      /* @__PURE__ */ jsx(CafeShowcaseSlider, {}),
      /* @__PURE__ */ jsx(CafeNewsSection, {}),
      /* @__PURE__ */ jsx(CafeGuestReviews, {})
    ] }),
    /* @__PURE__ */ jsx("div", { id: "contact", children: /* @__PURE__ */ jsx(Footer, {}) })
  ] });
}
export {
  CafeHomepage as default
};
