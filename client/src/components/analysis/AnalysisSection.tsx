import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Transcript } from "@shared/schema";

type AnalysisSectionProps = {
  transcripts: Transcript[];
};

export function AnalysisSection({ transcripts }: AnalysisSectionProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "key-points">("summary");

  const generateLocalAnalysis = (content: string) => {
    // Simple local analysis
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const questions = content.split("?").length - 1;

    return {
      words,
      sentences,
      questions,
      estimatedReadTime: Math.ceil(words / 200) // Assuming 200 words per minute
    };
  };

  const currentTranscript = transcripts[0];
  const analysis = currentTranscript ? generateLocalAnalysis(currentTranscript.content) : null;

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Transcript Analysis</h2>

        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "summary" ? "bg-primary text-white" : "bg-gray-100"
            }`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "key-points" ? "bg-primary text-white" : "bg-gray-100"
            }`}
            onClick={() => setActiveTab("key-points")}
          >
            Key Points
          </button>
        </div>

        {analysis && (
          <div className="space-y-4">
            {activeTab === "summary" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-2xl font-bold">{analysis.words}</div>
                  <div className="text-sm text-gray-600">Total Words</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-2xl font-bold">{analysis.sentences}</div>
                  <div className="text-sm text-gray-600">Total Sentences</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-2xl font-bold">{analysis.questions}</div>
                  <div className="text-sm text-gray-600">Questions Asked</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-2xl font-bold">{analysis.estimatedReadTime}min</div>
                  <div className="text-sm text-gray-600">Est. Read Time</div>
                </div>
              </div>
            )}

            {activeTab === "key-points" && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Basic statistical analysis of the transcript content.
                  Full AI-powered analysis can be added later.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}