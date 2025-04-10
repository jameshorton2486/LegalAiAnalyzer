
import { Header } from "./Header";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {children}
      </main>
      <footer className="mt-auto py-4 text-center text-sm text-neutral-500">
        <p>Legal Transcript Analyzer • Simplify your deposition analysis</p>
      </footer>
    </div>
  );
}
