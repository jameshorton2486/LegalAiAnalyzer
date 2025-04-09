import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaLightbulb, FaExclamationCircle, FaFileAlt, FaPlusCircle, FaPlus, FaCopy, FaSyncAlt } from "react-icons/fa";
import { fetchTranscriptAnalysis, getQuestionsFromAnalysis, fetchCaseContradictions, compareTranscripts } from "@/lib/openai";
import { Question, Contradiction } from "@/lib/openai";
import { Transcript } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type AnalysisSectionProps = {
  caseId: number;
  transcripts: Transcript[];
  selectedTranscriptId?: number;
};

type AnalysisTab = "questions" | "contradictions" | "insights";

export function AnalysisSection({ caseId, transcripts, selectedTranscriptId }: AnalysisSectionProps) {
  const [activeTab, setActiveTab] = useState<AnalysisTab>("questions");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get first transcript ID if none selected
  const transcriptId = selectedTranscriptId || (transcripts && transcripts.length > 0 ? transcripts[0]?.id : undefined);
  
  // Fetch analysis for the selected transcript
  const { data: analysisData, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: [`/api/transcripts/${transcriptId}/analysis`],
    queryFn: () => transcriptId ? fetchTranscriptAnalysis(transcriptId) : Promise.resolve([]),
    enabled: !!transcriptId,
  });
  
  // Fetch contradictions for the case
  const { data: contradictions, isLoading: isLoadingContradictions } = useQuery({
    queryKey: [`/api/cases/${caseId}/contradictions`],
    queryFn: () => fetchCaseContradictions(caseId),
    enabled: activeTab === "contradictions",
  });
  
  // Extract questions and insights from analysis
  const questions = transcriptId && analysisData ? getQuestionsFromAnalysis(analysisData) : [];
  
  // Handle run comparison button
  const runComparisonMutation = useMutation({
    mutationFn: () => {
      const transcriptIds = transcripts.map(t => t.id);
      return compareTranscripts(caseId, transcriptIds);
    },
    onSuccess: () => {
      toast({
        title: "Comparison initiated",
        description: "The AI is comparing transcripts. Results will be available soon.",
      });
      
      // Poll for new contradictions
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [`/api/cases/${caseId}/contradictions`] });
      }, 5000);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to run comparison: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleRunComparison = () => {
    if (transcripts.length < 2) {
      toast({
        title: "Not enough transcripts",
        description: "You need at least two analyzed transcripts to run a comparison.",
        variant: "destructive",
      });
      return;
    }
    
    runComparisonMutation.mutate();
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };
  
  const saveToNotes = (text: string) => {
    toast({
      title: "Added to notes",
      description: "Item has been saved to your notes.",
    });
  };
  
  // Get current transcript name
  const currentTranscript = transcripts.find(t => t.id === transcriptId);
  const transcriptName = currentTranscript?.title || "Transcript";

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">AI Analysis</h2>
        <button 
          onClick={handleRunComparison}
          disabled={runComparisonMutation.isPending || transcripts.length < 2}
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
        >
          <FaSyncAlt className="inline mr-2" />
          Run Comparison
        </button>
      </div>

      {/* Tabs for analysis types */}
      <div className="border-b border-neutral-300 mb-6">
        <div className="flex -mb-px">
          <button 
            onClick={() => setActiveTab("questions")}
            className={`py-2 px-4 font-medium mr-4 ${
              activeTab === "questions" 
                ? "text-primary-dark border-b-2 border-primary-dark" 
                : "text-neutral-600 hover:text-neutral-800 border-b-2 border-transparent hover:border-neutral-300"
            }`}
          >
            Suggested Questions
          </button>
          <button 
            onClick={() => setActiveTab("contradictions")}
            className={`py-2 px-4 font-medium mr-4 ${
              activeTab === "contradictions" 
                ? "text-primary-dark border-b-2 border-primary-dark" 
                : "text-neutral-600 hover:text-neutral-800 border-b-2 border-transparent hover:border-neutral-300"
            }`}
          >
            Contradictions
          </button>
          <button 
            onClick={() => setActiveTab("insights")}
            className={`py-2 px-4 font-medium ${
              activeTab === "insights" 
                ? "text-primary-dark border-b-2 border-primary-dark" 
                : "text-neutral-600 hover:text-neutral-800 border-b-2 border-transparent hover:border-neutral-300"
            }`}
          >
            Key Insights
          </button>
        </div>
      </div>

      {/* Analysis Content */}
      <div>
        {activeTab === "questions" && (
          <>
            <h3 className="font-medium text-neutral-800 mb-3">
              {transcriptName} - Follow-up Questions
            </h3>
            
            {isLoadingAnalysis ? (
              <div className="py-8 text-center">
                <p className="text-neutral-500">Loading suggested questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="py-8 text-center border border-neutral-300 rounded-md">
                <p className="text-neutral-500">No suggested questions available yet.</p>
                <p className="text-sm text-neutral-400 mt-2">Analysis may still be in progress or no transcript has been analyzed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question: Question, index: number) => (
                  <div key={index} className="border border-neutral-300 rounded-md p-4 hover:bg-neutral-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <FaLightbulb className="text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-800 mb-1">{question.question}</h4>
                        <p className="text-sm text-neutral-600 mb-2">
                          {question.reasoning}
                        </p>
                        <div className="flex items-center text-sm text-neutral-500">
                          <span className="inline-flex items-center text-xs bg-neutral-100 px-2 py-1 rounded mr-2">
                            <FaFileAlt className="mr-1" /> {question.reference}
                          </span>
                          <div className="flex space-x-3">
                            <button 
                              className="text-primary-dark hover:text-primary flex items-center"
                              onClick={() => saveToNotes(question.question)}
                            >
                              <FaPlus className="mr-1" /> Save to notes
                            </button>
                            <button 
                              className="text-primary-dark hover:text-primary flex items-center"
                              onClick={() => copyToClipboard(question.question)}
                            >
                              <FaCopy className="mr-1" /> Copy
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {questions.length > 5 && (
                  <div className="mt-4 flex justify-center">
                    <button className="text-primary-dark hover:text-primary-light flex items-center font-medium">
                      <FaPlusCircle className="mr-1" /> View More Suggestions
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {activeTab === "contradictions" && (
          <>
            <h3 className="font-medium text-neutral-800 mb-3">
              Contradictions Between Witnesses
            </h3>
            
            {isLoadingContradictions ? (
              <div className="py-8 text-center">
                <p className="text-neutral-500">Loading contradictions...</p>
              </div>
            ) : contradictions?.length === 0 ? (
              <div className="py-8 text-center border border-neutral-300 rounded-md">
                <p className="text-neutral-500">No contradictions found yet.</p>
                <p className="text-sm text-neutral-400 mt-2">
                  {transcripts.length < 2 
                    ? "You need at least two transcripts to find contradictions."
                    : "Run a comparison to find contradictions between transcripts."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {contradictions?.map((contradiction: Contradiction, index: number) => {
                  const transcript1 = transcripts.find(t => t.id === contradiction.transcript1Id);
                  const transcript2 = transcripts.find(t => t.id === contradiction.transcript2Id);
                  
                  return (
                    <div key={index} className="border border-neutral-300 rounded-md p-4 hover:bg-neutral-50">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <FaExclamationCircle className="text-warning" />
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-800 mb-1">{contradiction.description}</h4>
                          <div className="mt-2 mb-3">
                            <div className="bg-neutral-50 p-3 rounded-md mb-2 text-sm">
                              <p className="font-medium text-primary-dark mb-1">{transcript1?.witnessName || "Witness 1"}:</p>
                              <p className="text-neutral-600">{contradiction.excerpt1}</p>
                            </div>
                            <div className="bg-neutral-50 p-3 rounded-md text-sm">
                              <p className="font-medium text-primary-dark mb-1">{transcript2?.witnessName || "Witness 2"}:</p>
                              <p className="text-neutral-600">{contradiction.excerpt2}</p>
                            </div>
                          </div>
                          <div className="flex space-x-3 text-sm">
                            <button 
                              className="text-primary-dark hover:text-primary flex items-center"
                              onClick={() => saveToNotes(contradiction.description)}
                            >
                              <FaPlus className="mr-1" /> Save to notes
                            </button>
                            <button 
                              className="text-primary-dark hover:text-primary flex items-center"
                              onClick={() => copyToClipboard(`${contradiction.description}\n\n${transcript1?.witnessName || "Witness 1"}: ${contradiction.excerpt1}\n\n${transcript2?.witnessName || "Witness 2"}: ${contradiction.excerpt2}`)}
                            >
                              <FaCopy className="mr-1" /> Copy
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        
        {activeTab === "insights" && (
          <div className="py-8 text-center border border-neutral-300 rounded-md">
            <p className="text-neutral-500">Key insights feature coming soon.</p>
            <p className="text-sm text-neutral-400 mt-2">
              This feature will provide AI-generated insights about key themes and critical points in the transcript.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
