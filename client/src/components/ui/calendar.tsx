"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-4 [--cell-size:2.5rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "long" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit select-none", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-6 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 px-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 select-none p-0 rounded-full border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200 aria-disabled:opacity-30 aria-disabled:cursor-not-allowed",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 select-none p-0 rounded-full border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200 aria-disabled:opacity-30 aria-disabled:cursor-not-allowed",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-10 w-full items-center justify-center",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-10 w-full items-center justify-center gap-2 text-base font-semibold tracking-tight",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-primary border-input shadow-sm has-focus:ring-primary/20 has-focus:ring-[3px] relative rounded-lg border bg-background hover:border-primary/50 transition-colors",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0 cursor-pointer",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-semibold text-foreground tracking-tight",
          captionLayout === "label"
            ? "text-base"
            : "[&>svg]:text-muted-foreground flex h-9 items-center gap-1.5 rounded-lg pl-3 pr-1.5 text-sm [&>svg]:size-4",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse mt-2",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground/70 flex-1 select-none rounded-md text-xs font-semibold uppercase tracking-wider pb-2",
          defaultClassNames.weekday
        ),
        week: cn("mt-1 flex w-full gap-0.5", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-xs font-medium",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0.5 text-center [&:first-child[data-selected=true]_button]:rounded-l-lg [&:last-child[data-selected=true]_button]:rounded-r-lg",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-primary/15 rounded-l-lg",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none bg-primary/10", defaultClassNames.range_middle),
        range_end: cn("bg-primary/15 rounded-r-lg", defaultClassNames.range_end),
        today: cn(
          "bg-primary/10 text-primary font-semibold rounded-lg data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground/40 aria-selected:text-muted-foreground/60",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground/30 opacity-50 cursor-not-allowed",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn("animate-in fade-in-0 zoom-in-95 duration-200", className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-2", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-2", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isToday = modifiers.today
  const isSelected = modifiers.selected
  const isDisabled = modifiers.disabled
  const isOutside = modifiers.outside

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        // Base styles
        "relative flex aspect-square h-auto w-full min-w-[--cell-size] flex-col items-center justify-center gap-0.5 font-medium leading-none rounded-lg transition-all duration-150",
        
        // Default state
        "hover:bg-primary/10 hover:text-primary",
        
        // Today indicator
        isToday && !isSelected && "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20",
        
        // Selected single day
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:font-semibold data-[selected-single=true]:shadow-md data-[selected-single=true]:hover:bg-primary/90",
        
        // Range styles
        "data-[range-middle=true]:bg-primary/15 data-[range-middle=true]:text-primary data-[range-middle=true]:rounded-none",
        "data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-start=true]:rounded-lg data-[range-start=true]:rounded-r-none data-[range-start=true]:shadow-md",
        "data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-end=true]:rounded-lg data-[range-end=true]:rounded-l-none data-[range-end=true]:shadow-md",
        
        // Focus styles
        "group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-primary group-data-[focused=true]/day:ring-offset-2 group-data-[focused=true]/day:z-10",
        
        // Outside month
        isOutside && "text-muted-foreground/40 hover:text-muted-foreground/60 hover:bg-muted/50",
        
        // Disabled
        isDisabled && "text-muted-foreground/30 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground/30",
        
        defaultClassNames.day,
        className
      )}
      {...props}
    >
      <span className="text-sm">{day.date.getDate()}</span>
    </Button>
  )
}

export { Calendar, CalendarDayButton }