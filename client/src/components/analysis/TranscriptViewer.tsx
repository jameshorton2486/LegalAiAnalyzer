import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FaPrint,
  FaDownload,
  FaRobot,
  FaArrowRight,
  FaCopy,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchTranscriptAnalysis,
  getQuestionsFromAnalysis,
} from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

type TranscriptViewerProps = {
  isOpen: boolean;
  onClose: () => void;
  transcript: {
    id: number;
    title: string;
    content: string;
    date: string;
    witnessName: string;
  } | null;
};

export function TranscriptViewer({
  isOpen,
  onClose,
  transcript,
}: TranscriptViewerProps) {
  const { toast } = useToast();

  const { data: analysisData } = useQuery({
    queryKey: [`/api/transcripts/${transcript?.id}/analysis`],
    queryFn: () =>
      transcript?.id
        ? fetchTranscriptAnalysis(transcript.id)
        : Promise.resolve([]),
    enabled: !!transcript?.id,
  });

  const questions =
    transcript?.id && analysisData
      ? getQuestionsFromAnalysis(analysisData)
      : [];

  const formatTranscriptContent = (content: string) => {
    // Basic transcript formatting - in a real app, you'd parse the transcript format more intelligently
    const lines = content.split("\n");
    const formattedContent = [];

    let pageCounter = 1;
    let lineCounter = 0;

    formattedContent.push(
      <p key="page-1" className="text-neutral-500 text-sm mb-4">
        Page {pageCounter}
      </p>,
    );

    for (const line of lines) {
      if (line.trim() === "") continue;

      lineCounter++;

      // Approximate page breaks
      if (lineCounter > 25) {
        pageCounter++;
        lineCounter = 0;
        formattedContent.push(
          <p
            key={`page-${pageCounter}`}
            className="text-neutral-500 text-sm my-4"
          >
            Page {pageCounter}
          </p>,
        );
      }

      // Format speaker lines
      const attorneyMatch = line.match(/^Attorney:/i);
      const witnessMatch = line.match(
        new RegExp(`^${transcript?.witnessName || "Witness"}:`, "i"),
      );

      if (attorneyMatch || witnessMatch) {
        formattedContent.push(
          <p key={`line-${formattedContent.length}`} className="mb-4">
            <strong>
              {attorneyMatch ? "Attorney" : transcript?.witnessName}:
            </strong>{" "}
            {line.substring(line.indexOf(":") + 1).trim()}
          </p>,
        );
      } else {
        formattedContent.push(
          <p key={`line-${formattedContent.length}`} className="mb-4">
            {line}
          </p>,
        );
      }
    }

    return formattedContent;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  if (!transcript) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b border-neutral-300">
          <DialogTitle className="text-lg font-semibold text-neutral-800">
            {transcript.title} -{" "}
            {new Date(transcript.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-2/3 overflow-y-auto p-6 border-r border-neutral-300">
            <div className="prose max-w-none">
              {formatTranscriptContent(transcript.content)}
            </div>
          </div>
          <div className="w-1/3 overflow-y-auto bg-neutral-50 p-6">
            <h3 className="font-medium text-neutral-800 mb-3">AI Insights</h3>

            {questions.length === 0 ? (
              <p className="text-neutral-500 text-sm">
                No insights available yet.
              </p>
            ) : (
              <div className="space-y-4">
                {questions.slice(0, 3).map((question, index) => (
                  <div
                    key={index}
                    className="bg-white border border-neutral-300 rounded-md p-3"
                  >
                    <h4 className="text-sm font-medium text-neutral-800 mb-1">
                      {index === 0
                        ? "Potential Inconsistency"
                        : index === 1
                          ? "Suggested Question"
                          : "Related Information"}
                    </h4>
                    <p className="text-xs text-neutral-600 mb-2">
                      {index === 0
                        ? question.reasoning
                        : index === 1
                          ? question.question
                          : question.reference}
                    </p>
                    <button
                      className="text-xs text-primary-dark flex items-center"
                      onClick={() =>
                        index === 0 ? null : copyToClipboard(question.question)
                      }
                    >
                      {index === 0 ? (
                        <>
                          <FaArrowRight className="mr-1" /> Follow up on this
                        </>
                      ) : index === 1 ? (
                        <>
                          <FaCopy className="mr-1" /> Copy to clipboard
                        </>
                      ) : (
                        <>
                          <FaExternalLinkAlt className="mr-1" /> View document
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t border-neutral-300 p-4 flex justify-between">
          <div>
            <Button variant="outline" className="mr-2">
              <FaPrint className="mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <FaDownload className="mr-2" />
              Download
            </Button>
          </div>
          <Button>
            <FaRobot className="mr-2" />
            Generate More Insights
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
