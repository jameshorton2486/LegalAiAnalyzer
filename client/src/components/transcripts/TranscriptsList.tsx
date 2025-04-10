import { useState } from "react";
import { FaFileAlt, FaSearch, FaFilter } from "react-icons/fa";
import { format } from "date-fns";

export function TranscriptsList() {
  const [searchTerm, setSearchTerm] = useState("");

  // Get transcripts from localStorage
  const getTranscripts = () => {
    const stored = localStorage.getItem('transcripts');
    return stored ? JSON.parse(stored) : [];
  };

  const transcripts = getTranscripts();

  const filteredTranscripts = transcripts.filter(
    (transcript) =>
      transcript.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">
          Uploaded Transcripts
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
                  Date
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
                      <div className="text-sm font-medium text-neutral-800">
                        {transcript.fileName}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-700">
                    {format(new Date(transcript.date), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => {
                        const viewer = document.createElement('div');
                        viewer.innerHTML = `<pre>${transcript.content}</pre>`;
                        const w = window.open('', '_blank');
                        w?.document.body.appendChild(viewer);
                      }}
                      className="text-primary-dark hover:text-primary-light"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}