import { useQuery } from "@tanstack/react-query";
import { FaFileAlt, FaEllipsisV, FaSearch, FaFilter } from "react-icons/fa";
import { Transcript } from "@shared/schema";
import { Link } from "wouter";
import { format } from "date-fns";
import { useState } from "react";

type TranscriptsListProps = {
  caseId: number;
};

export function TranscriptsList({ caseId }: TranscriptsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: transcripts, isLoading } = useQuery<Transcript[]>({
    queryKey: [`/api/cases/${caseId}/transcripts`],
  });

  const filteredTranscripts =
    transcripts?.filter(
      (transcript) =>
        transcript.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transcript.witnessName.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">
          Case Transcripts
        </h2>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transcripts..."
              className="pl-8 pr-4 py-2 border border-neutral-300 rounded-md text-sm focus:ring-primary focus:border-primary w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          </div>
          <button className="bg-white border border-neutral-300 hover:bg-neutral-100 p-2 rounded-md">
            <FaFilter className="text-neutral-600" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-neutral-500">Loading transcripts...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {filteredTranscripts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-neutral-500">
                No transcripts found. Upload a transcript to get started.
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-neutral-300">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Witness
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredTranscripts.map((transcript) => (
                  <tr key={transcript.id} className="hover:bg-neutral-100">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaFileAlt className="text-neutral-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-neutral-800">
                            {transcript.title}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {transcript.pages} pages
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {transcript.witnessName}{" "}
                      {transcript.witnessType
                        ? `(${transcript.witnessType})`
                        : ""}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-700">
                      {transcript.date
                        ? format(new Date(transcript.date), "MMM d, yyyy")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/transcripts/${transcript.id}`} className="text-primary-dark hover:text-primary-light mr-3">
                          View
                      </Link>
                      <button className="text-neutral-600 hover:text-neutral-800">
                        <FaEllipsisV />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
