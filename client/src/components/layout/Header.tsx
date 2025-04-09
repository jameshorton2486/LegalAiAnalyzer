import { Link } from "wouter";
import { IoScaleOutline } from "react-icons/io5";

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-300 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <IoScaleOutline className="text-primary-dark text-2xl" />
            <h1 className="text-xl font-semibold text-neutral-700">DepositionAI</h1>
          </a>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="flex items-center space-x-1 text-neutral-600 hover:text-primary-dark">
              <span className="text-sm font-medium">Cases</span>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center space-x-1 text-neutral-600 hover:text-primary-dark">
              <span className="text-sm font-medium">Recent</span>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>
          </div>
          <div className="h-6 w-px bg-neutral-300"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-dark flex items-center justify-center text-white">
              <span className="text-sm font-medium">JD</span>
            </div>
            <span className="text-sm font-medium hidden sm:inline">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
