import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Phone, Mail, Users, ChevronRight, ChevronLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const YUM_MESSAGES = [
  { text: "Delicious choice! 🍽️", subtext: "Let's continue..." },
  { text: "Almost there! 🎉", subtext: "One more step..." },
  { text: "Perfect! ✨", subtext: "Confirming your reservation..." }
];

export default function ReservationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showYumMessage, setShowYumMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showYumAndProceed = (nextStep) => {
    setShowYumMessage(true);
    setTimeout(() => {
      setShowYumMessage(false);
      setCurrentStep(nextStep);
    }, 1500);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (formData.name && formData.email && formData.phone) {
        showYumAndProceed(2);
      }
    } else if (currentStep === 2) {
      if (formData.date && formData.time && formData.guests) {
        showYumAndProceed(3);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    alert(`Reservation request submitted!\n\nName: ${formData.name}\nDate: ${formData.date}\nTime: ${formData.time}\nGuests: ${formData.guests}\n\nWe'll confirm your booking shortly.`);
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: "2"
    });
    
    setIsSubmitting(false);
    setCurrentStep(1);
  };

  return (
    <section id="reservation" className="relative py-10 md:py-14 bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.02, 0.04, 0.02]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-primary rounded-full blur-3xl"
        />
        
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} 
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Compact Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-medium mb-2"
            >
              <Calendar className="w-3 h-3" />
              <span>Book Your Table</span>
            </motion.span>
            
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              Reserve Your Experience
            </h2>
            
            <p className="text-muted-foreground text-sm">
              Quick & easy reservation in 3 steps
            </p>
          </motion.div>

          {/* Yum Message Overlay */}
          <AnimatePresence>
            {showYumMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 0.5, repeat: 1 }}
                  className="bg-card border-2 border-primary rounded-2xl p-8 shadow-2xl text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, ease: "linear" }}
                  >
                    <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {YUM_MESSAGES[currentStep - 1].text}
                  </h3>
                  <p className="text-muted-foreground">
                    {YUM_MESSAGES[currentStep - 1].subtext}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Card - Wider Format */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 shadow-xl">
              {/* Step Indicators */}
              <div className="flex items-center justify-center gap-4 mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: currentStep >= step ? 1 : 0.8,
                        backgroundColor: currentStep >= step ? 'hsl(var(--primary))' : 'hsl(var(--border))'
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        currentStep >= step ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {currentStep > step ? <Check className="w-4 h-4" /> : step}
                    </motion.div>
                    {step < 3 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: currentStep > step ? '100%' : '0%',
                          backgroundColor: currentStep > step ? 'hsl(var(--primary))' : 'hsl(var(--border))'
                        }}
                        className="h-0.5 w-12 md:w-20 mx-2"
                        style={{ backgroundColor: 'hsl(var(--border))' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Info */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-foreground mb-1">Personal Information</h3>
                        <p className="text-xs text-muted-foreground">Tell us who you are</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-1.5 text-xs text-foreground">
                            <User className="w-3 h-3 text-primary" />
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="h-10 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-1.5 text-xs text-foreground">
                            <Mail className="w-3 h-3 text-primary" />
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="h-10 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center gap-1.5 text-xs text-foreground">
                            <Phone className="w-3 h-3 text-primary" />
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="h-10 text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Reservation Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-foreground mb-1">Reservation Details</h3>
                        <p className="text-xs text-muted-foreground">When would you like to dine?</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="flex items-center gap-1.5 text-xs text-foreground">
                            <Calendar className="w-3 h-3 text-primary" />
                            Date
                          </Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="h-10 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="time" className="flex items-center gap-1.5 text-xs text-foreground">
                            <Clock className="w-3 h-3 text-primary" />
                            Time
                          </Label>
                          <Input
                            id="time"
                            name="time"
                            type="time"
                            required
                            value={formData.time}
                            onChange={handleChange}
                            className="h-10 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="guests" className="flex items-center gap-1.5 text-xs text-foreground">
                            <Users className="w-3 h-3 text-primary" />
                            Guests
                          </Label>
                          <Input
                            id="guests"
                            name="guests"
                            type="number"
                            required
                            min="1"
                            max="20"
                            value={formData.guests}
                            onChange={handleChange}
                            className="h-10 text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Confirmation */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-foreground mb-1">Confirm Your Reservation</h3>
                        <p className="text-xs text-muted-foreground">Review your details</p>
                      </div>

                      <div className="bg-muted/50 rounded-xl p-5 space-y-3">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Guest Name</p>
                              <p className="font-semibold text-sm text-foreground">{formData.name}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Mail className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Email</p>
                              <p className="font-semibold text-sm text-foreground">{formData.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Date & Time</p>
                              <p className="font-semibold text-sm text-foreground">{formData.date} at {formData.time}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Party Size</p>
                              <p className="font-semibold text-sm text-foreground">{formData.guests} {formData.guests === "1" ? "Guest" : "Guests"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-primary">Note:</span> Confirmation within 24 hours. Call +91-9211308384 for immediate assistance.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between gap-4 mt-6">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      variant="outline"
                      size="default"
                      className="px-6 py-5 text-sm rounded-full"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  )}

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      size="default"
                      className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-sm rounded-full"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="default"
                      className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-sm rounded-full"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Confirm Reservation
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}