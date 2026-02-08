import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Calendar, Clock, User, Phone, Mail, Users, Check, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const YUM_MESSAGES = [
  { text: "Great Choice! 🍽️", subtext: "Now, tell us about your party." },
  { text: "Perfect Timing! 🎉", subtext: "Just reviewing the details..." },
  { text: "Almost Dining! ✨", subtext: "Secure your table now." }
];

export default function ReservationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", date: "", time: "", guests: "2", specialRequest: ""
  });

  // PARALLAX CONTROLS
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgTextX = useTransform(scrollYProgress, [0, 1], ["10%", "-20%"]);
  const formY = useTransform(scrollYProgress, [0, 1], ["50px", "-100px"]); // Reverse Lift
  const smoothFormY = useSpring(formY, { stiffness: 100, damping: 30 });

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handlePrev = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    alert("Request Received! We will contact you shortly.");
  };

  return (
    <section 
      ref={containerRef}
      id="reservation" 
      className="relative py-24 bg-[#050505] overflow-hidden min-h-[900px]"
    >
      {/* 1. BACKGROUND STORYTELLING LAYER */}
      <motion.div 
        style={{ x: bgTextX }}
        className="absolute top-1/4 left-0 whitespace-nowrap text-[15rem] font-black text-white/[0.02] pointer-events-none select-none italic uppercase z-0"
      >
        Reservations Table Booking Experience
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* LEFT: STATIC STORY CONTENT */}
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em]">Primary Conversion</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-white leading-none mb-8">
              Secure Your <br />
              <span className="italic text-white/30">Table.</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed font-light mb-8">
              A curated dining experience awaits. Reserve your space in Ghaziabad's premier BYOB destination.
            </p>
            <div className="h-1 w-20 bg-primary/30" />
          </div>

          {/* RIGHT: PARALLAX REVERSE FORM */}
          <motion.div 
            style={{ y: smoothFormY }} 
            className="lg:w-2/3 w-full"
          >
            <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden">
              
              {/* Progress Indicator */}
              <div className="flex gap-2 mb-12">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex-1 h-1 bg-white/10 relative overflow-hidden">
                    <motion.div 
                      className="absolute inset-0 bg-primary"
                      initial={false}
                      animate={{ x: currentStep >= step ? "0%" : "-100%" }}
                    />
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-white font-serif text-2xl mb-8 italic text-white/50">Who is joining us?</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-primary">Guest Name</Label>
                          <Input required className="bg-white/5 border-white/10 rounded-none h-14" placeholder="Full Name" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-primary">Contact Number</Label>
                          <Input required className="bg-white/5 border-white/10 rounded-none h-14" placeholder="+91" />
                        </div>
                      </div>
                      <Button type="button" onClick={handleNext} className="w-full h-14 bg-white text-black hover:bg-primary hover:text-white transition-all rounded-none uppercase text-xs font-black">
                        Continue to Schedule <ChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-white font-serif text-2xl mb-8 italic text-white/50">Pick your Moment</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-primary">Select Date</Label>
                          <Input required type="date" className="bg-white/5 border-white/10 rounded-none h-14 text-white" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-primary">Select Time</Label>
                          <Input required type="time" className="bg-white/5 border-white/10 rounded-none h-14 text-white" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-primary">Total Guests</Label>
                          <Input required type="number" min="1" className="bg-white/5 border-white/10 rounded-none h-14 text-white" />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={handlePrev} className="h-14 px-8 border-white/10 text-white rounded-none">Back</Button>
                        <Button type="button" onClick={handleNext} className="flex-1 h-14 bg-white text-black hover:bg-primary hover:text-white transition-all rounded-none uppercase text-xs font-black">
                          Review Details
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-white font-serif text-2xl mb-8 italic text-white/50">Final Confirmation</h3>
                      <div className="p-6 bg-primary/5 border border-primary/20 space-y-4">
                        <p className="text-white/60 text-sm italic">
                          By clicking confirm, you are sending a request for a curated table experience. We will contact you via phone for final confirmation.
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={handlePrev} className="h-14 px-8 border-white/10 text-white rounded-none">Modify</Button>
                        <Button type="submit" disabled={isSubmitting} className="flex-1 h-14 bg-primary text-white hover:bg-primary/90 transition-all rounded-none uppercase text-xs font-black">
                          {isSubmitting ? "Sending Request..." : "Confirm My Table"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Step Label Overlay */}
              <div className="absolute top-12 right-12 text-white/5 text-8xl font-black italic select-none">
                0{currentStep}
              </div>
            </div>
          </motion.div>

        </div>

        {/* BOTTOM REASSURANCE */}
        <div className="mt-20 flex flex-col items-center">
          <p className="text-white/20 text-[9px] uppercase tracking-[0.5em] font-bold">
            Guaranteed Response within 24 Hours • Call +91-9211308384
          </p>
        </div>
      </div>
    </section>
  );
}