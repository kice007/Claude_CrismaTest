"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/use-media-query";

interface CalendarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (date: string, time: string) => void;
}

function CalendarModalContent({
  onConfirm,
  onClose,
}: {
  onConfirm?: (date: string, time: string) => void;
  onClose: () => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function handleConfirm() {
    if (!date || !time) return;
    onConfirm?.(date, time);
    onClose();
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground" htmlFor="calendar-date">
          Date
        </label>
        <input
          id="calendar-date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
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
          value={time}
          onChange={e => setTime(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <button
        type="button"
        disabled={!date || !time}
        onClick={handleConfirm}
        className="w-full min-h-[48px] bg-brand-primary text-white font-medium rounded-md hover:bg-brand-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Confirm
      </button>
    </div>
  );
}

export function CalendarModal({ open, onOpenChange, onConfirm }: CalendarModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>Choose a date and time for the candidate interview.</DialogDescription>
          </DialogHeader>
          <CalendarModalContent onConfirm={onConfirm} onClose={() => onOpenChange(false)} />
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
          <CalendarModalContent onConfirm={onConfirm} onClose={() => onOpenChange(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
