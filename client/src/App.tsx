import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import CaseView from "@/pages/CaseView";
import TranscriptView from "@/pages/TranscriptView";
import TranscriptList from "@/pages/TranscriptList";
import Insights from "@/pages/Insights";
import Contradictions from "@/pages/Contradictions";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/cases/:id" component={CaseView} />
      <Route path="/transcripts" component={TranscriptList} />
      <Route path="/transcripts/:id" component={TranscriptView} />
      <Route path="/insights" component={Insights} />
      <Route path="/contradictions/:caseId?" component={Contradictions} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
