
import { Link } from "wouter";
import { IoScaleOutline } from "react-icons/io5";

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <IoScaleOutline className="text-primary-600 text-2xl" />
          <span className="font-semibold text-xl text-neutral-800">DepositionAI</span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link href="/transcripts" className="text-neutral-600 hover:text-primary-600 transition-colors">
            Transcripts
          </Link>
          <Link href="/insights" className="text-neutral-600 hover:text-primary-600 transition-colors">
            Insights
          </Link>
          <div className="h-6 w-px bg-neutral-200"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
              <span className="text-sm font-medium">AI</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
