import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Download } from "lucide-react";

export function DocModal({
  open, onOpenChange, title, url,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  url: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[96vh] p-0 overflow-hidden bg-background gap-0 flex flex-col rounded-sm">
        <DialogHeader className="px-3 py-1.5 border-b border-border flex flex-row items-center justify-between gap-3 space-y-0 shrink-0">
          <DialogTitle className="font-serif text-xs text-primary line-clamp-1 pr-4">
            {title}
          </DialogTitle>
          <div className="flex items-center gap-2 shrink-0 mr-6">
            <a
              href={url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-primary hover:text-gold transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Abrir
            </a>
            <a
              href={url} download
              className="inline-flex items-center gap-1 text-[10px] text-primary hover:text-gold transition-colors"
            >
              <Download className="w-3 h-3" /> Baixar
            </a>
          </div>
        </DialogHeader>
        <iframe
          src={url}
          title={title}
          className="w-full flex-1 bg-muted min-h-0"
        />

      </DialogContent>
    </Dialog>
  );
}
