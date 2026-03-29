import { Calendar, ChevronLeft, ChevronRight, Coffee, Gift, Users } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useState } from "react";
import { siteContent } from "@/data/siteContent";

import "swiper/css";

const SLIDES = [
  {
    id: "offer-1",
    type: "Offer",
    title: "Morning Brew & Bake Combo",
    description: "Fresh croissant, house roast, and a quick breakfast format designed for early hours.",
    image: siteContent.images.cafes.bakery.src,
    icon: Gift,
  },
  {
    id: "booking-1",
    type: "Group Booking",
    title: "Creative Team Coffee Meetups",
    description: "Pre-set tables, quick service flow, and shared platters for compact office gatherings.",
    image: siteContent.images.cafes.minimalist.src,
    icon: Users,
  },
  {
    id: "event-1",
    type: "Event",
    title: "Acoustic Evenings & Slow Sips",
    description: "Intimate live sessions paired with curated brews and dessert tastings.",
    image: siteContent.images.cafes.garden.src,
    icon: Calendar,
  },
  {
    id: "offer-2",
    type: "Offer",
    title: "High Tea For Two",
    description: "Tea tower service with petit desserts and savouries in a lounge-style format.",
    image: siteContent.images.cafes.highTea.src,
    icon: Gift,
  },
  {
    id: "booking-2",
    type: "Group Booking",
    title: "Celebration Tables For Small Parties",
    description: "Birthdays, catch-ups, and cosy celebrations arranged with dessert add-ons.",
    image: siteContent.images.cafes.parisian.src,
    icon: Users,
  },
  {
    id: "event-2",
    type: "Event",
    title: "Latte Art Workshops",
    description: "Interactive cafe sessions focused on pouring techniques, beans, and tasting notes.",
    image: siteContent.images.cafes.library.src,
    icon: Coffee,
  },
];

export default function CafeShowcaseSlider() {
  const [swiper, setSwiper] = useState(null);

  return (
    <section id="showcase" className="bg-muted py-10">
      <div className="mx-auto w-[92%] max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-primary">Offers • Group Booking • Events</p>
            <h2 className="text-2xl font-serif md:text-3xl">Cafe Showcase</h2>
          </div>

          <div className="flex gap-2">
            <button onClick={() => swiper?.slidePrev()} className="rounded-full border border-border bg-background p-2 shadow-sm transition-colors hover:bg-muted">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => swiper?.slideNext()} className="rounded-full border border-border bg-background p-2 shadow-sm transition-colors hover:bg-muted">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={setSwiper}
        >
          {SLIDES.map((item) => {
            const Icon = item.icon;

            return (
              <SwiperSlide key={item.id}>
                <article className="group relative flex h-[420px] overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
                  <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white">
                    <div className="flex items-start justify-between">
                      <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur-sm">
                        {item.type}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-serif font-semibold leading-tight">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/78">{item.description}</p>
                      <button className="mt-5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] backdrop-blur-sm transition-colors hover:bg-white hover:text-black">
                        Explore
                      </button>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
