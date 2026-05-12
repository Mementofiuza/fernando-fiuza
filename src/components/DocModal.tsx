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
      <DialogContent className="max-w-5xl w-[95vw] h-[88vh] p-0 overflow-hidden bg-background">
        <DialogHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between gap-4 space-y-0">
          <DialogTitle className="font-serif text-lg text-primary line-clamp-1 pr-6">
            {title}
          </DialogTitle>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-gold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Abrir
            </a>
            <a
              href={url} download
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-gold transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Baixar
            </a>
          </div>
        </DialogHeader>
        <iframe
          src={url}
          title={title}
          className="w-full h-full bg-muted"
        />
      </DialogContent>
    </Dialog>
  );
}
