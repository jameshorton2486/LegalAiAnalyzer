import { Layout } from "@/components/layout/Layout";
import { TranscriptUploader } from "@/components/transcripts/TranscriptUploader";
import { TranscriptsList } from "@/components/transcripts/TranscriptsList";
import { AnalysisSection } from "@/components/analysis/AnalysisSection";
import { useState } from "react";

export default function CaseView() {
  const [transcripts, setTranscripts] = useState(() => {
    const saved = localStorage.getItem('transcripts');
    return saved ? JSON.parse(saved) : [];
  });

  const analyzedTranscripts = transcripts.filter(t => t.analysis);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">
          Transcript Management
        </h1>
        <p className="text-neutral-600">
          Upload and analyze legal transcripts
        </p>
      </div>

      <TranscriptUploader />
      <TranscriptsList transcripts={transcripts} />
      {analyzedTranscripts.length > 0 && (
        <AnalysisSection transcripts={analyzedTranscripts} />
      )}
    </Layout>
  );
}