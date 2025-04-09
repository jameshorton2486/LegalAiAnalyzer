import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { Link } from "wouter";
import { FaFileAlt, FaSearch, FaPlus, FaFilter, FaSortAmountDown } from "react-icons/fa";

import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transcript } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function TranscriptList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const { data: transcripts, isLoading } = useQuery<Transcript[]>({
    queryKey: ["/api/transcripts"],
  });

  // Filter and sort transcripts
  const filteredTranscripts = transcripts
    ? transcripts
        .filter((transcript) => {
          // Filter by search term
          const matchesSearch =
            transcript.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transcript.witnessName.toLowerCase().includes(searchTerm.toLowerCase());
          
          // Filter by status
          const matchesStatus =
            filterStatus === "all" || transcript.status === filterStatus;
          
          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
          // Sort by selected criteria
          if (sortBy === "date") {
            return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
          } else if (sortBy === "title") {
            return a.title.localeCompare(b.title);
          } else if (sortBy === "witness") {
            return a.witnessName.localeCompare(b.witnessName);
          } else if (sortBy === "status") {
            return a.status.localeCompare(b.status);
          }
          return 0;
        })
    : [];

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">All Transcripts</h1>
          <p className="text-neutral-600">View and manage deposition transcripts</p>
        </div>
        <Button className="sm:w-auto w-full">
          <FaPlus className="mr-2" /> Upload New Transcript
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6 pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search by title or witness..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <FaFilter className="mr-2 text-neutral-500" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="analyzed">Analyzed</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <FaSortAmountDown className="mr-2 text-neutral-500" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date (newest)</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                    <SelectItem value="witness">Witness (A-Z)</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center p-3 border-b border-neutral-200 last:border-b-0">
                  <Skeleton className="h-10 w-10 rounded-md mr-4" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredTranscripts.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="mx-auto text-neutral-300 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-neutral-800 mb-1">No transcripts found</h3>
              <p className="text-neutral-500 mb-6">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "Upload your first transcript to get started"}
              </p>
              {!(searchTerm || filterStatus !== "all") && (
                <Button>
                  <FaPlus className="mr-2" /> Upload Transcript
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredTranscripts.map((transcript) => (
                <Link
                  key={transcript.id}
                  href={`/transcripts/${transcript.id}`}
                  className="flex items-center py-4 px-2 hover:bg-neutral-50 transition-colors"
                >
                  <div className="bg-neutral-100 p-2 rounded-md mr-4">
                    <FaFileAlt className="text-primary-dark text-lg" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-800">{transcript.title}</h3>
                    <div className="text-sm text-neutral-500 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span>Witness: {transcript.witnessName}</span>
                      {transcript.date && (
                        <span>Date: {format(new Date(transcript.date), "MMM d, yyyy")}</span>
                      )}
                      {transcript.pages && <span>Pages: {transcript.pages}</span>}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      transcript.status === "analyzed"
                        ? "bg-green-100 text-green-800"
                        : transcript.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : transcript.status === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {transcript.status.charAt(0).toUpperCase() + transcript.status.slice(1)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}