import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaLightbulb, FaExclamationTriangle, FaSearch, FaFolder } from "react-icons/fa";

import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Case, Contradiction } from "@shared/schema";

export default function Insights() {
  const [searchTerm, setSearchTerm] = useState("");
  const [caseFilter, setCaseFilter] = useState<string>("all");
  
  // Fetch cases for the filter
  const { data: cases } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });
  
  // Mock contradictions data (this would be from an API endpoint)
  const { data: contradictions, isLoading } = useQuery<Contradiction[]>({
    queryKey: ["/api/contradictions", caseFilter],
  });
  
  // Filter contradictions based on search term and case filter
  const filteredContradictions = contradictions
    ? contradictions.filter((contradiction) => {
        const matchesSearch =
          contradiction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contradiction.witness1.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contradiction.witness2.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCase =
          caseFilter === "all" || contradiction.caseId.toString() === caseFilter;
        
        return matchesSearch && matchesCase;
      })
    : [];

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">AI Insights</h1>
          <p className="text-neutral-600">Discover key contradictions and insights from your transcripts</p>
        </div>
      </div>

      <Tabs defaultValue="contradictions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contradictions">Contradictions</TabsTrigger>
          <TabsTrigger value="summary">Case Summaries</TabsTrigger>
          <TabsTrigger value="questions">Key Questions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contradictions" className="space-y-4">
          <Card className="mb-6">
            <CardContent className="pt-6 pb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <Input
                    placeholder="Search contradictions..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-56">
                  <Select value={caseFilter} onValueChange={setCaseFilter}>
                    <SelectTrigger>
                      <FaFolder className="mr-2 text-neutral-500" />
                      <SelectValue placeholder="Filter by case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cases</SelectItem>
                      {cases?.map((caseItem) => (
                        <SelectItem key={caseItem.id} value={caseItem.id.toString()}>
                          {caseItem.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <Skeleton className="h-4 w-[250px]" />
                        </div>
                        <Skeleton className="h-20 w-full" />
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-[150px]" />
                          <Skeleton className="h-3 w-[100px]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : filteredContradictions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FaLightbulb className="mx-auto text-neutral-300 text-4xl mb-4" />
                  <h3 className="text-lg font-medium text-neutral-800 mb-1">No contradictions found</h3>
                  <p className="text-neutral-500 mb-6">
                    {searchTerm || caseFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "Upload and analyze more transcripts to find contradictions"}
                  </p>
                  {!(searchTerm || caseFilter !== "all") && (
                    <Button>Upload New Transcript</Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredContradictions.map((contradiction) => (
                <Card key={contradiction.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 p-2 rounded-full flex-shrink-0">
                        <FaExclamationTriangle className="text-amber-600" />
                      </div>
                      <div className="space-y-3 w-full">
                        <div>
                          <h3 className="font-medium text-lg text-neutral-800">
                            {contradiction.description}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            Detected between testimony from {contradiction.witness1} and {contradiction.witness2}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                            <div className="text-sm font-medium text-neutral-700 mb-1">{contradiction.witness1} testimony:</div>
                            <div className="text-sm text-neutral-600">{contradiction.testimony1}</div>
                          </div>
                          <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                            <div className="text-sm font-medium text-neutral-700 mb-1">{contradiction.witness2} testimony:</div>
                            <div className="text-sm text-neutral-600">{contradiction.testimony2}</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="text-sm text-neutral-500">
                            Confidence: <span className="font-medium text-neutral-700">{contradiction.confidence}%</span>
                          </div>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <FaLightbulb className="mx-auto text-neutral-300 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-neutral-800 mb-1">Case Summaries Coming Soon</h3>
              <p className="text-neutral-500 mb-6">
                This feature is under development and will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <FaLightbulb className="mx-auto text-neutral-300 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-neutral-800 mb-1">Key Questions Coming Soon</h3>
              <p className="text-neutral-500 mb-6">
                This feature is under development and will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}