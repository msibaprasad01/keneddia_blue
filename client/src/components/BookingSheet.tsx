"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ChevronRight, User, Calendar, CreditCard, ChevronLeft } from "lucide-react"

interface BookingSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  category: "hotel" | "dining" | "delivery" | null
}

const locations = [
  { value: "kennedia-blu-bangalore", label: "Kennedia Blu - Bangalore (MG Road)" },
  { value: "kennedia-grand-mumbai", label: "Kennedia Grand - Mumbai (Juhu)" },
  { value: "kennedia-resort-goa", label: "Kennedia Resort - Goa (Calangute)" },
  { value: "kennedia-suites-delhi", label: "Kennedia Suites - New Delhi" },
]

export function BookingSheet({ isOpen, onOpenChange, category }: BookingSheetProps) {
  const [step, setStep] = useState(1)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setSelectedLocation(null)
    }
  }, [isOpen])

  const handleSelect = (value: string) => {
    setSelectedLocation(value)
    setStep(2)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const getTitle = () => {
    switch (category) {
      case "hotel": return "Book a Stay"
      case "dining": return "Reserve a Table"
      case "delivery": return "Order Food"
      default: return "Booking"
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-background text-foreground border-l border-border/10">

        {/* Header with Back Button */}
        <div className="p-6 border-b border-border/10 bg-card/50 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            {step > 1 && (
              <button onClick={handleBack} className="p-1 hover:bg-white/10 rounded-full transition-colors -ml-2">
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            <SheetTitle className="text-xl font-serif font-medium">{getTitle()}</SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
            Step {step} of 3 • {step === 1 ? "Select Location" : step === 2 ? "Review" : "Checkout"}
          </SheetDescription>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="p-4 h-full flex flex-col">
              <Command className="border border-border/10 rounded-lg bg-card/30">
                <CommandInput placeholder="Search location..." className="text-foreground placeholder:text-muted-foreground/50 border-none" />
                <CommandList className="max-h-[500px]">
                  <CommandEmpty className="py-6 text-sm text-muted-foreground">No locations found.</CommandEmpty>
                  <CommandGroup heading="Available Locations" className="text-muted-foreground">
                    {locations.map((loc) => (
                      <CommandItem
                        key={loc.value}
                        onSelect={() => handleSelect(loc.value)}
                        className="flex items-center justify-between py-3 cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary"
                      >
                        <span className="font-medium text-foreground">{loc.label}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
                <p>Showing {category} availability for nearby properties.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 space-y-6">
              <div className="rounded-xl border border-border/10 bg-card overflow-hidden">
                <div className="h-32 bg-muted/20 relative">
                  {/* Placeholder for map or image */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-sm font-medium">Selected Property Image</div>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg font-medium text-foreground mb-1">
                    {locations.find(l => l.value === selectedLocation)?.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">5 Star Luxury Property • Free Cancellation</p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/5">
                      <Calendar className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Date</p>
                        <p className="text-sm text-muted-foreground">Dec 15 - Dec 16 (1 Night)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/5">
                      <User className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Guests</p>
                        <p className="text-sm text-muted-foreground">2 Adults, 0 Children</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => setStep(3)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base">
                Confirm & Continue
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input id="name" placeholder="John Doe" className="bg-card/50 border-border/20 text-foreground placeholder:text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="bg-card/50 border-border/20 text-foreground placeholder:text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" className="bg-card/50 border-border/20 text-foreground placeholder:text-muted-foreground/50" />
                </div>
              </div>

              <div className="pt-4 border-t border-border/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="text-xl font-bold text-foreground">₹12,499</span>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Proceed to Pay
                </Button>
                <p className="text-center text-[10px] text-muted-foreground mt-3">
                  Secured by Kennedia SafePay. By proceeding, you agree to our Terms.
                </p>
              </div>
            </div>
          )}
        </div>

      </SheetContent>
    </Sheet>
  )
}
