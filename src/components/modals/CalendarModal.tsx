"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/use-media-query";

interface CalendarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CalendarModalContent() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground" htmlFor="calendar-date">
          Date
        </label>
        <input
          id="calendar-date"
          type="date"
          className="w-full rounded-md border border-input bg-background px-3 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground" htmlFor="calendar-time">
          Time
        </label>
        <input
          id="calendar-time"
          type="time"
          className="w-full rounded-md border border-input bg-background px-3 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <button
        type="button"
        className="w-full min-h-[48px] bg-brand-primary text-white font-medium rounded-md hover:bg-brand-secondary transition-colors"
      >
        Confirm
      </button>
    </div>
  );
}

export function CalendarModal({ open, onOpenChange }: CalendarModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>Choose a date and time for the candidate interview.</DialogDescription>
          </DialogHeader>
          <CalendarModalContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Schedule Interview</DrawerTitle>
          <DrawerDescription>Choose a date and time for the candidate interview.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6 pb-safe">
          <CalendarModalContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
