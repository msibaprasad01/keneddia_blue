import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat,
  Flame,
  ArrowUpRight,
  Sparkles,
  Maximize2,
  X,
  Quote,
  MessageCircle,
  Phone,
  ClipboardList,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- Data ---
const BUFFET_DATA = [
  { id: "b1", name: "Royal Lunch", price: "₹1,299", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600", chef: "Chef Rajat", remark: "Mughal Era inspiration with authentic spices." },
  { id: "b2", name: "Grand Dinner", price: "₹1,599", img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=600", chef: "Chef Lin", remark: "Applewood smoked grills and coastal curries." },
  { id: "b3", name: "Sunday Brunch", price: "₹1,899", img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=600", chef: "Chef Rajat", remark: "Live pasta stations and bottomless prosecco." },
];

const SIGNATURE_DATA = [
  { id: "s1", name: "Butter Chicken", price: "₹545", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600", spice: 2, chef: "Chef Rajat" },
  { id: "s2", name: "Tandoori Jhinga", price: "₹695", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600", spice: 3, chef: "Chef Rajat" },
  { id: "s3", name: "Truffle Dim Sum", price: "₹425", img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=600", spice: 1, chef: "Chef Lin" },
  { id: "s4", name: "Szechuan Prawns", price: "₹745", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600", spice: 4, chef: "Chef Lin" },
];

export default function EnhancedCulinaryCuration() {
  const [isPausedLeft, setIsPausedLeft] = useState(false);
  const [isPausedRight, setIsPausedRight] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [bookingModal, setBookingModal] = useState({ isOpen: false, item: null, method: null });

  const scrollVariants = (direction) => ({
    animate: {
      y: direction === 'up' ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: {
        y: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" },
      },
    },
  });

  const openBooking = (item) => {
    setBookingModal({ isOpen: true, item, method: null });
  };

  return (
    <section className="relative py-16 bg-white dark:bg-[#050505] transition-colors duration-500 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8 border-b border-zinc-100 dark:border-white/5 pb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-primary text-[11px] font-black uppercase tracking-[0.4em]">Culinary Masterpieces</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif dark:text-white leading-tight">
              One Location. <span className="italic text-primary">Diverse Flavors.</span>
            </h2>
          </div>

          {/* Chef Spotlight */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-5 bg-zinc-50 dark:bg-zinc-900/40 p-5 rounded-2xl border border-primary/10 max-w-lg shadow-sm"
          >
            <div className="relative shrink-0">
              <img src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=200" className="w-16 h-16 rounded-full object-cover border-2 border-primary" alt="Chef" />
              <div className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-full border-2 border-white dark:border-zinc-900">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2"><Quote className="w-3 h-3 text-primary fill-primary" /><span className="text-[10px] font-bold dark:text-zinc-400 uppercase tracking-widest">Chef's Remark</span></div>
              <p className="text-sm italic dark:text-zinc-200 leading-snug">"We don't just serve food; we serve memories crafted with heritage spices."</p>
            </div>
          </motion.div>
        </div>

        {/* --- SCROLLING SECTIONS --- */}
        <div className="grid lg:grid-cols-2 gap-8 h-[750px]">
          {/* Buffet */}
          <div className="relative group overflow-hidden bg-zinc-50 dark:bg-zinc-900/30 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 shadow-inner">
            <div className="absolute top-6 left-8 z-20 flex justify-between w-[calc(100%-64px)] items-center">
               <h3 className="text-2xl font-serif dark:text-white">Buffet <span className="text-primary italic text-xl">Selection</span></h3>
               <button onClick={() => setExpandedSection('buffet')} className="p-2.5 bg-white dark:bg-black rounded-full shadow-lg hover:bg-primary hover:text-white transition-all"><Maximize2 className="w-5 h-5" /></button>
            </div>
            <motion.div className="flex flex-col gap-6 p-8 pt-24" variants={scrollVariants('up')} animate={isPausedLeft ? "pause" : "animate"} onMouseEnter={() => setIsPausedLeft(true)} onMouseLeave={() => setIsPausedLeft(false)}>
              {[...BUFFET_DATA, ...BUFFET_DATA].map((item, idx) => (
                <div key={`${item.id}-${idx}`} onClick={() => openBooking(item)} className="cursor-pointer bg-white dark:bg-zinc-900 min-h-[160px] p-6 rounded-[2rem] flex gap-6 border border-zinc-100 dark:border-white/5 shadow-sm hover:border-primary/50 transition-all">
                  <img src={item.img} className="w-32 h-32 rounded-2xl object-cover shrink-0 shadow-md" alt="" />
                  <div className="flex flex-col justify-between py-1 w-full">
                    <div><h4 className="font-serif text-xl dark:text-white mb-1">{item.name}</h4><p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed italic line-clamp-2">"{item.remark}"</p></div>
                    <div className="flex items-center justify-between border-t border-zinc-50 dark:border-white/5 pt-3 mt-2"><span className="text-primary font-bold text-lg">{item.price}</span><div className="flex items-center gap-2 dark:text-zinc-300"><ChefHat className="w-4 h-4 text-primary" /><span className="text-[10px] font-black uppercase tracking-tighter">{item.chef}</span></div></div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Signature */}
          <div className="relative group overflow-hidden bg-zinc-50 dark:bg-zinc-900/30 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 shadow-inner">
            <div className="absolute top-6 left-8 z-20 flex justify-between w-[calc(100%-64px)] items-center">
               <h3 className="text-2xl font-serif dark:text-white">Signature <span className="text-primary italic text-xl">Dishes</span></h3>
               <button onClick={() => setExpandedSection('signature')} className="p-2.5 bg-white dark:bg-black rounded-full shadow-lg hover:bg-primary hover:text-white transition-all"><Maximize2 className="w-5 h-5" /></button>
            </div>
            <motion.div className="flex flex-col gap-6 p-8 pt-24" variants={scrollVariants('down')} animate={isPausedRight ? "pause" : "animate"} onMouseEnter={() => setIsPausedRight(true)} onMouseLeave={() => setIsPausedRight(false)}>
              {[...SIGNATURE_DATA, ...SIGNATURE_DATA].map((item, idx) => (
                <div key={`${item.id}-${idx}`} onClick={() => openBooking(item)} className="cursor-pointer bg-white dark:bg-zinc-900 min-h-[160px] p-6 rounded-[2rem] flex items-center justify-between border border-zinc-100 dark:border-white/5 shadow-sm hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-6">
                    <img src={item.img} className="w-32 h-32 rounded-2xl object-cover shrink-0 shadow-md" alt="" />
                    <div className="space-y-2"><h4 className="font-serif text-xl dark:text-white leading-tight">{item.name}</h4><div className="flex gap-1">{[...Array(item.spice)].map((_, i) => <Flame key={i} className="w-4 h-4 text-primary fill-primary" />)}</div><p className="text-[10px] dark:text-zinc-500 font-bold uppercase tracking-widest italic">By {item.chef}</p></div>
                  </div>
                  <div className="text-right flex flex-col items-end justify-between h-28">
                    <p className="text-primary font-black text-2xl">{item.price}</p>
                    <button onClick={(e) => { e.stopPropagation(); openBooking(item); }} className="p-3 bg-zinc-100 dark:bg-white/5 rounded-full hover:bg-primary hover:text-white transition-all group"><ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" /></button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- BOOKING MODAL --- */}
      <AnimatePresence>
        {bookingModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBookingModal({ ...bookingModal, isOpen: false })} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
              
              <div className="p-8 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-serif dark:text-white">Book <span className="text-primary italic">{bookingModal.item?.name}</span></h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Choose your preferred booking method</p>
                </div>
                <button onClick={() => setBookingModal({ ...bookingModal, isOpen: false })} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors"><X className="w-6 h-6 dark:text-white" /></button>
              </div>

              <div className="p-8">
                {!bookingModal.method ? (
                  <div className="grid gap-4">
                    <button onClick={() => setBookingModal({ ...bookingModal, method: 'form' })} className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-primary transition-all group">
                      <div className="flex items-center gap-4"><div className="p-3 bg-primary/10 rounded-xl text-primary"><ClipboardList className="w-6 h-6" /></div><div className="text-left"><p className="font-bold dark:text-white uppercase text-xs tracking-widest">Reserve Table</p><p className="text-xs text-zinc-500">Fill our digital form</p></div></div>
                      <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-primary" />
                    </button>
                    <a href="https://wa.me/919211308384" target="_blank" className="flex items-center justify-between p-6 bg-green-50/50 dark:bg-green-500/5 rounded-2xl border border-transparent hover:border-green-500 transition-all group">
                      <div className="flex items-center gap-4"><div className="p-3 bg-green-500/10 rounded-xl text-green-500"><MessageCircle className="w-6 h-6" /></div><div className="text-left"><p className="font-bold dark:text-white uppercase text-xs tracking-widest">WhatsApp</p><p className="text-xs text-zinc-500">Quick chat booking</p></div></div>
                      <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-green-500" />
                    </a>
                    <a href="tel:+919211308384" className="flex items-center justify-between p-6 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-transparent hover:border-blue-500 transition-all group">
                      <div className="flex items-center gap-4"><div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Phone className="w-6 h-6" /></div><div className="text-left"><p className="font-bold dark:text-white uppercase text-xs tracking-widest">Direct Call</p><p className="text-xs text-zinc-500">+91 9211308384</p></div></div>
                      <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-blue-500" />
                    </a>
                  </div>
                ) : (
                  <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <button onClick={() => setBookingModal({ ...bookingModal, method: null })} className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-6"><ChevronLeft className="w-4 h-4" /> Change Method</button>
                    <BookingFormContent />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EXPAND OVERLAY --- */}
      <AnimatePresence>
        {expandedSection && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] bg-white dark:bg-black p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-16"><h2 className="text-5xl font-serif dark:text-white">Full <span className="text-primary italic">Menu Catalog</span></h2><button onClick={() => setExpandedSection(null)} className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:bg-primary hover:text-white transition-all"><X className="w-8 h-8 dark:text-white" /></button></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{(expandedSection === 'buffet' ? BUFFET_DATA : SIGNATURE_DATA).map(item => (<div key={item.id} onClick={() => { setExpandedSection(null); openBooking(item); }} className="group cursor-pointer bg-zinc-50 dark:bg-zinc-900 p-4 rounded-[2.5rem] border border-zinc-100 dark:border-white/5"><div className="aspect-[4/3] overflow-hidden rounded-[2rem] mb-6 shadow-xl"><img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" /></div><div className="px-2"><h4 className="text-2xl dark:text-white font-serif mb-2">{item.name}</h4><div className="flex justify-between items-center"><p className="text-primary font-black text-2xl">{item.price}</p><div className="flex items-center gap-2"><ChefHat className="w-4 h-4 text-primary" /><span className="text-xs dark:text-zinc-400 font-bold uppercase">{item.chef}</span></div></div></div></div>))}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// --- RESERVATION FORM SUB-COMPONENT ---
function BookingFormContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", date: "", time: "", guests: "2" });

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handlePrev = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    alert("Table request sent! We will call you for final confirmation.");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(step => (
          <div key={step} className="flex-1 h-1 bg-zinc-100 dark:bg-white/10 relative overflow-hidden rounded-full">
            <motion.div className="absolute inset-0 bg-primary" initial={false} animate={{ x: currentStep >= step ? "0%" : "-100%" }} />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Your Name</Label>
                <Input required className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 rounded-xl h-12" placeholder="Full Name" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Phone Number</Label>
                <Input required className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 rounded-xl h-12" placeholder="+91" />
              </div>
              <Button type="button" onClick={handleNext} className="w-full h-12 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-primary transition-all rounded-xl uppercase text-[10px] font-black tracking-widest">Next Step <ChevronRight className="ml-1 w-4 h-4" /></Button>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Date</Label>
                  <Input required type="date" className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Time</Label>
                  <Input required type="time" className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 rounded-xl h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Total Guests</Label>
                <Input required type="number" min="1" className="bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 rounded-xl h-12" />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handlePrev} className="h-12 border-zinc-200 dark:border-white/10 rounded-xl dark:text-white">Back</Button>
                <Button type="button" onClick={handleNext} className="flex-1 h-12 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-primary transition-all rounded-xl uppercase text-[10px] font-black tracking-widest">Review</Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-[11px] italic dark:text-white/60">
                A curated table will be prepared. We will call you within 15 mins for final confirmation.
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handlePrev} className="h-12 border-zinc-200 dark:border-white/10 rounded-xl dark:text-white">Modify</Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 bg-primary text-white hover:bg-primary/90 transition-all rounded-xl uppercase text-[10px] font-black tracking-widest">
                  {isSubmitting ? "Sending..." : "Confirm Booking"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}