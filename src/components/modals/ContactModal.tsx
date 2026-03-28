"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/use-media-query";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName?: string;
  candidateEmail?: string;
  candidateEmailLoading?: boolean;
}

function ContactModalContent({
  candidateName,
  candidateEmail,
  candidateEmailLoading,
}: {
  candidateName?: string;
  candidateEmail?: string;
  candidateEmailLoading?: boolean;
}) {
  return (
    <div className="space-y-4">
      {candidateName && (
        <p className="text-sm text-slate-600">
          Contacting <span className="font-semibold text-slate-900">{candidateName}</span>
        </p>
      )}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          defaultValue={candidateEmail ?? ""}
          readOnly={!!candidateEmail}
          placeholder={candidateEmailLoading ? "Loading email..." : "candidate@example.com"}
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
      <a
        href={candidateEmail ? `mailto:${candidateEmail}` : undefined}
        className={`flex items-center justify-center w-full min-h-[48px] bg-brand-primary text-white font-medium rounded-md transition-colors ${candidateEmail ? "hover:bg-brand-secondary" : "opacity-50 pointer-events-none cursor-not-allowed"}`}
        aria-disabled={!candidateEmail}
        tabIndex={candidateEmail ? 0 : -1}
      >
        Send Message
      </a>
    </div>
  );
}

export function ContactModal({ open, onOpenChange, candidateName, candidateEmail, candidateEmailLoading }: ContactModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Candidate</DialogTitle>
            <DialogDescription>Send a message to the candidate.</DialogDescription>
          </DialogHeader>
          <ContactModalContent
            candidateName={candidateName}
            candidateEmail={candidateEmail}
            candidateEmailLoading={candidateEmailLoading}
          />
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
          <ContactModalContent
            candidateName={candidateName}
            candidateEmail={candidateEmail}
            candidateEmailLoading={candidateEmailLoading}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
