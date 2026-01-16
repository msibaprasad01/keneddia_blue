import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarHeart, Users, PartyPopper, ArrowRight, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { siteContent } from "@/data/siteContent";
import { CITIES, HOTELS_DATA, Hotel } from "@/data/hotelsData";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const GROUP_OFFERS = [
  {
    id: "birthday",
    title: "Birthday Celebrations",
    icon: PartyPopper,
    image: siteContent.images.hotels.mumbai,
    description: "Make your special day unforgettable with our exclusive birthday packages including cake, decor, and private dining.",
  },
  {
    id: "valentines",
    title: "Valentine's Getaway",
    icon: CalendarHeart,
    image: siteContent.images.bars.beach,
    description: "Romantic suites, couple's spa treatments, and candlelight dinners for the perfect romantic escape.",
  },
  {
    id: "group-events",
    title: "Group Events",
    icon: Users,
    image: siteContent.images.hotels.hyderabad,
    description: "Perfect for corporate retreats, family reunions, or friend getaways with special group rates and activities.",
  },
];

export default function GroupBookingSection() {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<typeof GROUP_OFFERS[0] | null>(null);
  const [step, setStep] = useState(1);

  // Wizard State
  const [city, setCity] = useState("");
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleOpen = (offer: typeof GROUP_OFFERS[0]) => {
    setSelectedOffer(offer);
    setStep(1);
    setCity("");
    setHotel(null);
    setDate(undefined);
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleFinish = () => {
    if (!selectedOffer || !hotel) return;

    const params = new URLSearchParams();
    params.append("type", selectedOffer.id);
    params.append("hotel", hotel.name);
    params.append("location", hotel.city);
    if (date) params.append("checkIn", date.toISOString());

    navigate(`/checkout?${params.toString()}`);
  };

  const filteredHotels = city ? HOTELS_DATA.filter(h => h.city === city) : [];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Celebrations & Groups</h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From intimate celebrations to grand gatherings, we create moments that last a lifetime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {GROUP_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="group relative bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[16/9] relative overflow-hidden">
                <OptimizedImage
                  {...offer.image}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <offer.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-serif text-lg font-medium tracking-wide">
                    {offer.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-3">
                  {offer.description}
                </p>

                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                    onClick={() => handleOpen(offer)}
                  >
                    Plan Event <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Wizard Modal */}
      <Dialog open={!!selectedOffer} onOpenChange={(open) => !open && setSelectedOffer(null)}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card border-border/20">
          <div className="p-6 pb-0">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl flex items-center gap-3">
                {selectedOffer?.icon && <selectedOffer.icon className="w-6 h-6 text-primary" />}
                {selectedOffer?.title}
              </DialogTitle>
              <DialogDescription>
                Plan your event in 3 simple steps.
              </DialogDescription>
            </DialogHeader>

            {/* Progress indicator */}
            <div className="flex gap-2 mt-4 mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} className={cn("h-1 flex-1 rounded-full", step >= i ? "bg-primary" : "bg-muted")} />
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 min-h-[300px]">
            {/* STEP 1: CITY */}
            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <h3 className="font-medium text-lg">Select a Destination</h3>
                <div className="grid grid-cols-2 gap-3">
                  {CITIES.map(c => (
                    <div
                      key={c}
                      onClick={() => setCity(c)}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 flex items-center justify-between",
                        city === c ? "border-primary bg-primary/5" : "border-border/50 bg-card"
                      )}
                    >
                      <span>{c}</span>
                      {city === c && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: HOTEL */}
            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <h3 className="font-medium text-lg">Select a Venue in {city}</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {filteredHotels.length > 0 ? filteredHotels.map(h => (
                    <div
                      key={h.id}
                      onClick={() => setHotel(h)}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 flex items-start gap-3",
                        hotel?.id === h.id ? "border-primary bg-primary/5" : "border-border/50 bg-card"
                      )}
                    >
                      <div className="w-16 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                        <OptimizedImage {...h.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{h.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{h.description}</p>
                      </div>
                      {hotel?.id === h.id && <Check className="w-4 h-4 text-primary mt-1" />}
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-sm">No venues available in this city.</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: DATE */}
            {step === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 flex flex-col items-center">
                <h3 className="font-medium text-lg self-start">Select Event Date</h3>
                <div className="border rounded-lg p-3 bg-card/50">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    initialFocus
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-muted/20 border-t flex justify-between items-center">
            <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
              Back
            </Button>

            {step < 3 ? (
              <Button onClick={handleNext} disabled={step === 1 ? !city : !hotel}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={!date}>
                Proceed to Checkout
              </Button>
            )}
          </div>

        </DialogContent>
      </Dialog>
    </section>
  );
}
