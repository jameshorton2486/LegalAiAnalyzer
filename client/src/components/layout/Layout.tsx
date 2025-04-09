import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 bg-neutral-100">
          {children}
        </main>
      </div>
    </div>
  );
}
