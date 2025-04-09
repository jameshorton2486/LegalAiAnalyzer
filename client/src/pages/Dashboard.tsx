import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Case } from "@shared/schema";
import { Link } from "wouter";
import { FaFileAlt, FaFolder, FaPlus, FaSearch } from "react-icons/fa";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: cases, isLoading } = useQuery<Case[]>({
    queryKey: ['/api/cases'],
  });
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Dashboard</h1>
        <p className="text-neutral-600">Welcome to DepositionAI</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cases?.length || 0}</div>
            <p className="text-sm text-neutral-500 mt-1">Active legal cases</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Transcripts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-neutral-500 mt-1">Uploaded deposition transcripts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-neutral-500 mt-1">Transcripts awaiting AI analysis</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Cases</CardTitle>
            <Link href="/cases/new">
              <a className="text-sm text-primary-dark hover:text-primary-light flex items-center">
                <FaPlus className="mr-1" /> New Case
              </a>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-neutral-500 text-center py-6">Loading cases...</p>
            ) : cases?.length === 0 ? (
              <div className="text-center py-8">
                <FaFolder className="text-neutral-300 text-4xl mx-auto mb-3" />
                <p className="text-neutral-600 mb-4">No cases found</p>
                <Link href="/cases/new">
                  <a className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md">
                    Create your first case
                  </a>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {cases?.slice(0, 5).map(caseItem => (
                  <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                    <a className="flex items-center py-3 hover:bg-neutral-50 px-1">
                      <FaFolder className="text-neutral-400 mr-3" />
                      <div className="flex-1">
                        <div className="font-medium text-neutral-800">{caseItem.title}</div>
                        <div className="text-sm text-neutral-500">
                          {caseItem.caseNumber ? `Case #${caseItem.caseNumber}` : 'No case number'}
                        </div>
                      </div>
                      <div className="text-sm text-neutral-500">
                        {caseItem.createdAt ? format(new Date(caseItem.createdAt), 'MMM d, yyyy') : ''}
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <div className="text-sm text-neutral-500">Last 7 days</div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FaSearch className="text-neutral-300 text-4xl mx-auto mb-3" />
              <p className="text-neutral-600">No recent activity</p>
              <p className="text-sm text-neutral-500 mt-1">Upload a transcript to get started</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
