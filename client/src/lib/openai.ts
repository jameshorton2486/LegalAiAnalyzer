import { apiRequest } from "@/lib/queryClient";

export type Question = {
  question: string;
  reasoning: string;
  reference: string;
};

export type Insight = {
  title: string;
  description: string;
  reference: string;
};

export type Contradiction = {
  description: string;
  excerpt1: string;
  excerpt2: string;
  transcript1Id: number;
  transcript2Id: number;
};

// Fetch analysis for a transcript
export async function fetchTranscriptAnalysis(transcriptId: number) {
  const response = await apiRequest(
    "GET",
    `/api/transcripts/${transcriptId}/analysis`,
    undefined,
  );
  const data = await response.json();

  // Parse JSON content from analysis items
  return data.map((item: any) => ({
    ...item,
    parsedContent: JSON.parse(item.content),
  }));
}

// Get suggested questions from analysis
export function getQuestionsFromAnalysis(analysisItems: any[]) {
  const questionsAnalysis = analysisItems.find(
    (item) => item.type === "questions",
  );
  return questionsAnalysis ? questionsAnalysis.parsedContent : [];
}

// Get insights from analysis
export function getInsightsFromAnalysis(analysisItems: any[]) {
  const insightsAnalysis = analysisItems.find(
    (item) => item.type === "insights",
  );
  return insightsAnalysis ? insightsAnalysis.parsedContent : [];
}

// Fetch contradictions for a case
export async function fetchCaseContradictions(caseId: number) {
  const response = await apiRequest(
    "GET",
    `/api/cases/${caseId}/contradictions`,
    undefined,
  );
  return await response.json();
}

// Initiate a comparison between transcripts
export async function compareTranscripts(
  caseId: number,
  transcriptIds: number[],
) {
  const response = await apiRequest("POST", `/api/cases/${caseId}/compare`, {
    transcriptIds,
  });
  return await response.json();
}
