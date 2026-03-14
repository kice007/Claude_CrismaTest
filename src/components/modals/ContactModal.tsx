"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/use-media-query";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ContactModalContent() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          placeholder="candidate@example.com"
          className="w-full rounded-md border border-input bg-background px-3 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground" htmlFor="contact-subject">
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          placeholder="Subject"
          className="w-full rounded-md border border-input bg-background px-3 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          placeholder="Your message..."
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-3 text-base min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>
      <button
        type="button"
        className="w-full min-h-[48px] bg-brand-primary text-white font-medium rounded-md hover:bg-brand-secondary transition-colors"
      >
        Send Message
      </button>
    </div>
  );
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Candidate</DialogTitle>
            <DialogDescription>Send a message to the candidate.</DialogDescription>
          </DialogHeader>
          <ContactModalContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Contact Candidate</DrawerTitle>
          <DrawerDescription>Send a message to the candidate.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6 pb-safe">
          <ContactModalContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
