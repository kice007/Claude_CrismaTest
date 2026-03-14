"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/use-media-query";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function InviteModalContent() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground" htmlFor="invite-email">
          Candidate email
        </label>
        <input
          id="invite-email"
          type="email"
          placeholder="candidate@example.com"
          className="w-full rounded-md border border-input bg-background px-3 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <button
        type="button"
        className="w-full min-h-[48px] bg-brand-primary text-white font-medium rounded-md hover:bg-brand-secondary transition-colors"
      >
        Send Invite
      </button>
    </div>
  );
}

export function InviteModal({ open, onOpenChange }: InviteModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Candidate</DialogTitle>
            <DialogDescription>Send an invitation to a candidate to take a test.</DialogDescription>
          </DialogHeader>
          <InviteModalContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Invite Candidate</DrawerTitle>
          <DrawerDescription>Send an invitation to a candidate.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6 pb-safe">
          <InviteModalContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
