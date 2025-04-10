import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { getQueryFn, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdCompareArrows } from "react-icons/md";
import type { Contradiction } from "@/lib/openai";
import { findContradictions } from "@/lib/openai";

export default function Contradictions() {
  const [, params] = useRoute("/contradictions/:caseId?");
  const caseId = params?.caseId ? parseInt(params.caseId) : undefined;
  const [location, setLocation] = useLocation();

  // Define types for API responses
  type Case = { id: number; title: string; caseNumber: string; description: string; createdAt: Date };

  // Fetch case data if caseId is provided
  const caseQuery = useQuery<Case>({
    queryKey: ['/api/cases', caseId],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!caseId,
  });

  // Fetch all contradictions or filter by caseId
  const contradictionsQuery = useQuery<Contradiction[]>({
    queryKey: ['/api/contradictions', caseId],
    queryFn: () => {
      const transcripts = JSON.parse(localStorage.getItem('transcripts') || '[]');
      return findContradictions(transcripts[0]?.content || '', transcripts[1]?.content || '');
    },
  });

  // Get all cases for the case selector
  const casesQuery = useQuery<Case[]>({
    queryKey: ['/api/cases'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Handle case selection
  const handleCaseChange = (caseId: number) => {
    setLocation(`/contradictions/${caseId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Testimony Contradictions</h1>
            <p className="text-gray-600 max-w-2xl">
              AI-detected contradictions between different witness testimonies in the same case.
            </p>
          </div>

          {/* Case selector */}
          {!caseId && (
            <div className="mt-4 md:mt-0">
              <select 
                className="p-2 border rounded-md bg-background"
                onChange={(e) => handleCaseChange(parseInt(e.target.value))}
                value={caseId || ""}
              >
                <option value="">Select a case</option>
                {casesQuery.data?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Breadcrumbs */}
        {caseId && (
          <div className="flex items-center mb-6 text-sm">
            <Link href="/contradictions">
              <a className="text-blue-600 hover:underline">All Cases</a>
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium">
              {caseQuery.isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                caseQuery.data?.title
              )}
            </span>
          </div>
        )}

        {/* Loading state */}
        {contradictionsQuery.isLoading && (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No contradictions state */}
        {!contradictionsQuery.isLoading && contradictionsQuery.data?.length === 0 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>No Contradictions Found</CardTitle>
              <CardDescription>
                {caseId 
                  ? "No contradictions have been detected in this case yet. Upload more transcripts to enable comparison."
                  : "Select a case to view contradictions or upload transcripts to enable comparison."}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href={caseId ? `/cases/${caseId}` : "/dashboard"}>
                  {caseId ? "Back to Case" : "Go to Dashboard"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Contradictions list */}
        {!contradictionsQuery.isLoading && 
          contradictionsQuery.data && 
          Array.isArray(contradictionsQuery.data) && 
          contradictionsQuery.data.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {contradictionsQuery.data.map((contradiction: Contradiction) => (
                <ContradictionCard 
                  key={contradiction.id} 
                  contradiction={contradiction} 
                />
              ))}
            </div>
          )}
      </div>
    </Layout>
  );
}

function ContradictionCard({ contradiction }: { contradiction: Contradiction }) {
  return (
    <Card className="w-full overflow-hidden border-l-4 border-l-red-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{contradiction.description}</CardTitle>
            <CardDescription className="mt-1">
              Between <strong>{contradiction.witness1}</strong> and <strong>{contradiction.witness2}</strong>
            </CardDescription>
          </div>
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            {contradiction.confidence}% Match
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="testimony1">
          <TabsList className="mb-4">
            <TabsTrigger value="testimony1">{contradiction.witness1}</TabsTrigger>
            <TabsTrigger value="testimony2">{contradiction.witness2}</TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-1">
              <MdCompareArrows className="mr-1" />
              Compare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="testimony1">
            <div className="bg-muted/40 p-4 rounded-md">
              <p className="whitespace-pre-line">{contradiction.testimony1}</p>
            </div>
          </TabsContent>

          <TabsContent value="testimony2">
            <div className="bg-muted/40 p-4 rounded-md">
              <p className="whitespace-pre-line">{contradiction.testimony2}</p>
            </div>
          </TabsContent>

          <TabsContent value="compare">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium mb-2 text-blue-700">{contradiction.witness1}</h4>
                <p className="whitespace-pre-line">{contradiction.testimony1}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-md">
                <h4 className="font-medium mb-2 text-indigo-700">{contradiction.witness2}</h4>
                <p className="whitespace-pre-line">{contradiction.testimony2}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}