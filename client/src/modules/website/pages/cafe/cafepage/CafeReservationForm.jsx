import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, CheckCircle2, Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TIME_SLOTS = [
  "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM",
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  guests: "1",
  occasion: "",
};

export default function CafeReservationForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section className="py-16 lg:py-28 bg-white dark:bg-[#080808]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-primary text-[11px] font-bold uppercase tracking-[0.4em]">
                  Reservations
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 dark:text-white tracking-tight">
                Secure Your <span className="italic text-primary">Table</span>
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
                Reserve a spot at Kennedia Cafe and we will have everything ready for you — your preferred corner, your favourite brew, and a warm welcome.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Calendar, title: "Flexible Booking", desc: "Reserve up to 30 days in advance for any occasion" },
                { icon: Clock, title: "All-Day Hours", desc: "Open from 7 AM to 11 PM on weekends" },
                { icon: Users, title: "Group Friendly", desc: "We accommodate groups of up to 30 for private events" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white text-sm">{title}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-50 dark:bg-zinc-900/60 rounded-3xl p-8 border border-zinc-100 dark:border-white/10 shadow-sm"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <h3 className="text-2xl font-serif text-zinc-900 dark:text-white">
                  Reservation Received!
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We'll confirm your table via email or phone within a few hours.
                </p>
                <Button
                  variant="outline"
                  onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); }}
                  className="rounded-full mt-2"
                >
                  Make Another Reservation
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="guests">Guests</Label>
                    <Input
                      id="guests"
                      name="guests"
                      type="number"
                      min="1"
                      max="30"
                      placeholder="No. of guests"
                      value={form.guests}
                      onChange={handleChange}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Preferred Time</Label>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, time: slot }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          form.time === slot
                            ? "bg-primary text-white border-primary"
                            : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-primary"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="occasion">Occasion (Optional)</Label>
                  <Input
                    id="occasion"
                    name="occasion"
                    placeholder="Birthday, business meeting, date night..."
                    value={form.occasion}
                    onChange={handleChange}
                    className="rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl h-12 text-base font-semibold"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Confirm Reservation
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
