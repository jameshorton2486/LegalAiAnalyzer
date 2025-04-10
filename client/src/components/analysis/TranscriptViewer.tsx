import { Dialog, DialogContent } from "@/components/ui/dialog";

type TranscriptViewerProps = {
  isOpen: boolean;
  onClose: () => void;
  transcript: {
    title: string;
    content: string;
    witnessName: string;
    date: string;
  } | null;
};

export function TranscriptViewer({ isOpen, onClose, transcript }: TranscriptViewerProps) {
  if (!transcript) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{transcript.title}</h2>
            <p className="text-sm text-neutral-500">
              {transcript.witnessName} • {new Date(transcript.date).toLocaleDateString()}
            </p>
          </div>
          <div className="overflow-auto max-h-[calc(80vh-10rem)]">
            <pre className="whitespace-pre-wrap font-sans">{transcript.content}</pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}