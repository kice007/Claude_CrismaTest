"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/use-media-query";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ExportModalContent() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <fieldset>
          <legend className="text-sm font-medium text-foreground mb-2">Export format</legend>
          <div className="space-y-2">
            <label className="flex items-center gap-3 min-h-[48px] cursor-pointer" htmlFor="export-pdf">
              <input
                id="export-pdf"
                type="radio"
                name="export-format"
                value="pdf"
                defaultChecked
                className="accent-brand-primary"
              />
              <span className="text-base">PDF Report</span>
            </label>
            <label className="flex items-center gap-3 min-h-[48px] cursor-pointer" htmlFor="export-csv">
              <input
                id="export-csv"
                type="radio"
                name="export-format"
                value="csv"
                className="accent-brand-primary"
              />
              <span className="text-base">CSV Data</span>
            </label>
            <label className="flex items-center gap-3 min-h-[48px] cursor-pointer" htmlFor="export-full">
              <input
                id="export-full"
                type="radio"
                name="export-format"
                value="full"
                className="accent-brand-primary"
              />
              <span className="text-base">Full Assessment</span>
            </label>
          </div>
        </fieldset>
      </div>
      <button
        type="button"
        className="w-full min-h-[48px] bg-brand-primary text-white font-medium rounded-md hover:bg-brand-secondary transition-colors"
      >
        Export
      </button>
    </div>
  );
}

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription>Download the candidate assessment report.</DialogDescription>
          </DialogHeader>
          <ExportModalContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Export Report</DrawerTitle>
          <DrawerDescription>Download the candidate assessment report.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6 pb-safe">
          <ExportModalContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
