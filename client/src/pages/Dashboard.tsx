import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { FaFileAlt, FaPlus } from "react-icons/fa";

export default function Dashboard() {
  const transcripts = JSON.parse(localStorage.getItem('transcripts') || '[]');
  const analyzedTranscripts = transcripts.filter((t: any) => t.analysis);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Dashboard</h1>
        <p className="text-neutral-600">Welcome to Legal Transcript Analyzer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Transcripts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{transcripts.length}</div>
            <p className="text-sm text-neutral-500 mt-1">Uploaded transcripts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Analyzed Transcripts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyzedTranscripts.length}</div>
            <p className="text-sm text-neutral-500 mt-1">AI-processed transcripts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Link 
              href="/transcripts"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              <FaPlus className="mr-2" /> Upload Transcript
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Recent Transcripts</CardTitle>
          <Link
            href="/transcripts"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          {transcripts.length === 0 ? (
            <div className="text-center py-8">
              <FaFileAlt className="text-neutral-300 text-4xl mx-auto mb-3" />
              <p className="text-neutral-600 mb-4">No transcripts yet</p>
              <Link
                href="/transcripts"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Upload your first transcript
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {transcripts.slice(0, 5).map((transcript: any) => (
                <div key={transcript.id} className="py-3">
                  <div className="font-medium text-neutral-800">
                    {transcript.title || 'Untitled Transcript'}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {transcript.analysis ? 'Analyzed' : 'Pending Analysis'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}