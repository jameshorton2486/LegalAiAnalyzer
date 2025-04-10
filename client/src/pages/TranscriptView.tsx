import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Transcript } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FaArrowLeft,
  FaFileAlt,
  FaDownload,
  FaQuestionCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { TranscriptViewer } from "@/components/analysis/TranscriptViewer";
import { useState } from "react";
import { analyzeTranscript } from "@/lib/openai";
import { Question } from "@/lib/openai";
import { format } from "date-fns";

export default function TranscriptView() {
  const { id } = useParams();
  const transcriptId = parseInt(id as string);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Fetch transcript
  const { data: transcript, isLoading } = useQuery<Transcript>({
    queryKey: [`/api/transcripts/${transcriptId}`],
    enabled: !isNaN(transcriptId),
  });

  // Get local analysis
  const questions = transcript?.analysis ? JSON.parse(transcript.analysis).questions : [];

  // Format transcript content preview
  const formatPreview = (content: string, maxLength = 500) => {
    const preview = content.substring(0, maxLength);
    return preview + (content.length > maxLength ? "..." : "");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-neutral-600">Loading transcript...</p>
        </div>
      </Layout>
    );
  }

  if (!transcript) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
            Transcript Not Found
          </h1>
          <p className="text-neutral-600">
            The transcript you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href={`/cases/${transcript.caseId}`}
            className="text-primary-dark hover:text-primary-light inline-flex items-center mb-2"
          >
            <FaArrowLeft className="mr-1" /> Back to Case
          </Link>
          <h1 className="text-2xl font-semibold text-neutral-800">
            {transcript.title}
          </h1>
          <p className="text-neutral-600">
            {transcript.witnessName}{" "}
            {transcript.witnessType ? `(${transcript.witnessType})` : ""} •
            {transcript.date
              ? format(new Date(transcript.date), " MMM d, yyyy")
              : ""}
          </p>
        </div>
        <div>
          <Button variant="outline" className="mr-2">
            <FaDownload className="mr-2" /> Download
          </Button>
          <Button onClick={() => setIsViewerOpen(true)}>
            View Full Transcript
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-2">
              <FaFileAlt className="text-neutral-400" />
              <h3 className="font-medium">Pages</h3>
            </div>
            <p className="text-2xl font-semibold">
              {transcript.pages || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-2">
              <FaQuestionCircle className="text-primary-dark" />
              <h3 className="font-medium">Suggested Questions</h3>
            </div>
            <p className="text-2xl font-semibold">{questions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-2">
              <FaExclamationCircle className="text-warning" />
              <h3 className="font-medium">Processing Status</h3>
            </div>
            <div
              className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                transcript.status === "analyzed"
                  ? "bg-green-100 text-success"
                  : transcript.status === "processing"
                    ? "bg-blue-100 text-primary-dark"
                    : transcript.status === "error"
                      ? "bg-red-100 text-error"
                      : "bg-yellow-100 text-warning"
              }`}
            >
              {transcript.status === "analyzed"
                ? "Analyzed"
                : transcript.status === "processing"
                  ? "Processing"
                  : transcript.status === "error"
                    ? "Error"
                    : "Pending"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                Transcript Preview
              </h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line text-neutral-700">
                  {formatPreview(transcript.content)}
                </p>
              </div>

              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => setIsViewerOpen(true)}>
                  View Full Transcript
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                Key Follow-up Questions
              </h2>

              {transcript.status !== "analyzed" ? (
                <div className="text-center py-4">
                  <p className="text-neutral-500">
                    {transcript.status === "processing"
                      ? "Analysis in progress..."
                      : "Transcript needs to be analyzed"}
                  </p>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-neutral-500">No questions generated yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions
                    .slice(0, 5)
                    .map((question: Question, index: number) => (
                      <div
                        key={index}
                        className="border-b border-neutral-200 pb-3 last:border-b-0 last:pb-0"
                      >
                        <h3 className="font-medium text-sm text-neutral-800 mb-1">
                          {index + 1}. {question.question}
                        </h3>
                        <p className="text-xs text-neutral-500">
                          {question.reference}
                        </p>
                      </div>
                    ))}

                  {questions.length > 5 && (
                    <Link
                      href={`/cases/${transcript.caseId}`}
                      className="text-primary-dark hover:text-primary-light text-sm block text-center mt-2"
                    >
                      View all {questions.length} questions
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <TranscriptViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        transcript={
          transcript
            ? {
                id: transcript.id,
                title: transcript.title,
                content: transcript.content,
                date: transcript.date
                  ? transcript.date.toString()
                  : new Date().toString(),
                witnessName: transcript.witnessName,
              }
            : null
        }
      />
    </Layout>
  );
}