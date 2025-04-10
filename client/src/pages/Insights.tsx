import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaLightbulb } from "react-icons/fa";

export default function Insights() {
  const transcripts = JSON.parse(localStorage.getItem('transcripts') || '[]');
  const hasAnalyzedTranscripts = transcripts.some((t: any) => t.analysis);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">AI Insights</h1>
        <p className="text-neutral-600">View analysis of your transcripts</p>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="questions">Key Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardContent className="pt-6">
              {hasAnalyzedTranscripts ? (
                <div className="space-y-4">
                  {transcripts
                    .filter((t: any) => t.analysis)
                    .map((t: any) => (
                      <div key={t.id} className="border-b pb-4">
                        <h3 className="font-medium mb-2">{t.title}</h3>
                        <p className="text-neutral-600">{t.analysis.summary}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaLightbulb className="mx-auto text-neutral-300 text-4xl mb-4" />
                  <h3 className="text-lg font-medium text-neutral-800 mb-1">
                    No Analyzed Transcripts
                  </h3>
                  <p className="text-neutral-500">
                    Upload and analyze transcripts to see insights here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardContent className="pt-6">
              {hasAnalyzedTranscripts ? (
                <div className="space-y-4">
                  {transcripts
                    .filter((t: any) => t.analysis?.questions)
                    .map((t: any) => (
                      <div key={t.id} className="border-b pb-4">
                        <h3 className="font-medium mb-2">{t.title}</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          {t.analysis.questions.map((q: string, i: number) => (
                            <li key={i} className="text-neutral-600">{q}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaLightbulb className="mx-auto text-neutral-300 text-4xl mb-4" />
                  <h3 className="text-lg font-medium text-neutral-800 mb-1">
                    No Questions Generated
                  </h3>
                  <p className="text-neutral-500">
                    Analyze transcripts to see key questions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}