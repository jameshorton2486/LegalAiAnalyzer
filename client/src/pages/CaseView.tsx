import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { TranscriptUploader } from "@/components/transcripts/TranscriptUploader";
import { TranscriptsList } from "@/components/transcripts/TranscriptsList";
import { AnalysisSection } from "@/components/analysis/AnalysisSection";
import { Case, Transcript } from "@shared/schema";
import { useState } from "react";

export default function CaseView() {
  const { id } = useParams();
  const caseId = parseInt(id as string);
  const [activeTab, setActiveTab] = useState("transcripts");

  // Fetch case details
  const { data: caseData, isLoading: isLoadingCase } = useQuery<Case>({
    queryKey: [`/api/cases/${caseId}`],
    enabled: !isNaN(caseId),
  });

  // Fetch transcripts for this case
  const { data: transcripts = [], isLoading: isLoadingTranscripts } = useQuery<
    Transcript[]
  >({
    queryKey: [`/api/cases/${caseId}/transcripts`],
    enabled: !isNaN(caseId),
  });

  // Get analyzed transcripts for AI analysis
  const analyzedTranscripts = transcripts.filter(
    (t) => t.status === "analyzed",
  );

  if (isLoadingCase) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading case details...</p>
        </div>
      </Layout>
    );
  }

  if (!caseData) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
            Case Not Found
          </h1>
          <p className="text-neutral-600">
            The case you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">
          {caseData.title}
        </h1>
        <p className="text-neutral-600">
          {caseData.caseNumber
            ? `Case #${caseData.caseNumber}`
            : "No case number"}{" "}
          • {caseData.description || "No description"}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-neutral-300">
        <nav className="flex space-x-8">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("transcripts");
            }}
            className={`border-b-2 pb-4 px-1 font-medium ${
              activeTab === "transcripts"
                ? "border-primary text-primary-dark"
                : "border-transparent hover:border-neutral-300 text-neutral-600"
            }`}
          >
            Transcripts
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("documents");
            }}
            className={`border-b-2 pb-4 px-1 font-medium ${
              activeTab === "documents"
                ? "border-primary text-primary-dark"
                : "border-transparent hover:border-neutral-300 text-neutral-600"
            }`}
          >
            Documents
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("timeline");
            }}
            className={`border-b-2 pb-4 px-1 font-medium ${
              activeTab === "timeline"
                ? "border-primary text-primary-dark"
                : "border-transparent hover:border-neutral-300 text-neutral-600"
            }`}
          >
            Timeline
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("notes");
            }}
            className={`border-b-2 pb-4 px-1 font-medium ${
              activeTab === "notes"
                ? "border-primary text-primary-dark"
                : "border-transparent hover:border-neutral-300 text-neutral-600"
            }`}
          >
            Notes
          </a>
        </nav>
      </div>

      {activeTab === "transcripts" && (
        <>
          <TranscriptUploader caseId={caseId} />
          <TranscriptsList caseId={caseId} />
          {analyzedTranscripts.length > 0 && (
            <AnalysisSection
              caseId={caseId}
              transcripts={analyzedTranscripts}
            />
          )}
        </>
      )}

      {activeTab === "documents" && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center py-10">
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">
            Documents
          </h2>
          <p className="text-neutral-600">Document management coming soon</p>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center py-10">
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">
            Timeline
          </h2>
          <p className="text-neutral-600">Case timeline coming soon</p>
        </div>
      )}

      {activeTab === "notes" && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center py-10">
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">Notes</h2>
          <p className="text-neutral-600">Case notes coming soon</p>
        </div>
      )}
    </Layout>
  );
}
