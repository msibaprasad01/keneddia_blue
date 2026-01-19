
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon, Users, ArrowRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FindYourStayProps {
  initialDate?: DateRange;
  initialGuests?: { adults: number; children: number; rooms: number };
}

export default function FindYourStay({ initialDate, initialGuests }: FindYourStayProps) {
  const [date, setDate] = useState<DateRange | undefined>(initialDate || {
    from: new Date(),
    to: addDays(new Date(), 2),
  });

  const [guests, setGuests] = useState(initialGuests || { adults: 2, children: 0, rooms: 1 });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-3 shadow-sm mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Date Picker */}
        <div className="flex-1 grid grid-cols-2 gap-3 p-2 rounded-lg bg-secondary/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Check-in</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors text-left">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  {date?.from ? format(date.from, "EEE, dd MMM") : "Select"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col border-l border-border/10 pl-3">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Check-out</span>
            <button
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors text-left"
              onClick={() => document.getElementById('date-trigger')?.click()}
            >
              <CalendarIcon className="w-4 h-4 text-primary" />
              {date?.to ? format(date.to, "EEE, dd MMM") : "Select"}
            </button>
          </div>
        </div>

        {/* Guests */}
        <div className="flex-1 p-2 rounded-lg bg-secondary/5 relative">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1 block">Guests & Rooms</span>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors w-full">
                <Users className="w-4 h-4 text-primary" />
                {guests.rooms} Room, {guests.adults} Adults, {guests.children} Children
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <h4 className="font-serif font-medium">Guests & Rooms</h4>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Rooms</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setGuests(p => ({ ...p, rooms: Math.max(1, p.rooms - 1) }))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center">-</button>
                    <span className="text-sm font-medium w-4 text-center">{guests.rooms}</span>
                    <button onClick={() => setGuests(p => ({ ...p, rooms: Math.max(1, p.rooms + 1) }))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center">+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Adults</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setGuests(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center">-</button>
                    <span className="text-sm font-medium w-4 text-center">{guests.adults}</span>
                    <button onClick={() => setGuests(p => ({ ...p, adults: Math.max(1, p.adults + 1) }))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center">+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Children</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setGuests(p => ({ ...p, children: Math.max(0, p.children - 1) }))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center">-</button>
                    <span className="text-sm font-medium w-4 text-center">{guests.children}</span>
                    <button onClick={() => setGuests(p => ({ ...p, children: Math.max(0, p.children + 1) }))} className="w-8 h-8 rounded-full border border-border flex items-center justify-center">+</button>
                  </div>
                </div>

                <Button className="w-full" onClick={() => setIsOpen(false)}>Done</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* CTA */}
        <div>
          <Button className="h-full w-full lg:w-auto px-8 py-4 text-sm font-bold uppercase tracking-wider">
            Update Stay
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
