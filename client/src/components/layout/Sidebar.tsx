import { Link, useLocation } from "wouter";
import {
  FaHome,
  FaFolder,
  FaFileAlt,
  FaLightbulb,
  FaCog,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Case } from "@shared/schema";

export function Sidebar() {
  const [location] = useLocation();

  // Fetch cases for recent cases list
  const { data: cases } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });

  const recentCases = cases?.slice(0, 3) || [];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-neutral-300 md:h-[calc(100vh-57px)] md:sticky md:top-[57px]">
      <nav className="p-4">
        <div className="space-y-1">
          <Link 
            href="/"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
              location === "/"
                ? "bg-primary-light bg-opacity-10 text-primary-dark"
                : "hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700"
            }`}
          >
            <FaHome />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link 
            href="/cases"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
              location.startsWith("/cases") && location !== "/cases/new"
                ? "bg-primary-light bg-opacity-10 text-primary-dark"
                : "hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700"
            }`}
          >
            <FaFolder />
            <span className="text-sm font-medium">Cases</span>
          </Link>
          <Link 
            href="/transcripts"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
              location.startsWith("/transcripts")
                ? "bg-primary-light bg-opacity-10 text-primary-dark"
                : "hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700"
            }`}
          >
            <FaFileAlt />
            <span className="text-sm font-medium">Transcripts</span>
          </Link>
          <Link 
            href="/insights"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
              location.startsWith("/insights")
                ? "bg-primary-light bg-opacity-10 text-primary-dark"
                : "hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700"
            }`}
          >
            <FaLightbulb />
            <span className="text-sm font-medium">AI Insights</span>
          </Link>
          <Link 
            href="/contradictions"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
              location.startsWith("/contradictions")
                ? "bg-primary-light bg-opacity-10 text-primary-dark"
                : "hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700"
            }`}
          >
            <FaExclamationTriangle className="text-amber-500" />
            <span className="text-sm font-medium">Contradictions</span>
          </Link>
          <Link 
            href="/settings"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
              location.startsWith("/settings")
                ? "bg-primary-light bg-opacity-10 text-primary-dark"
                : "hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700"
            }`}
          >
            <FaCog />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Recent Cases
          </h3>
          <div className="mt-2 space-y-1">
            {recentCases.map((caseItem) => (
              <Link 
                key={caseItem.id} 
                href={`/cases/${caseItem.id}`}
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-neutral-200 text-neutral-600 hover:text-neutral-700"
              >
                <FaFolder className="text-sm text-neutral-400" />
                <span className="text-sm">{caseItem.title}</span>
              </Link>
            ))}

            {recentCases.length === 0 && (
              <p className="text-sm text-neutral-500 px-3 py-2">
                No recent cases
              </p>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}
