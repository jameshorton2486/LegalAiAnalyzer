import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft, Info } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

export default function NotFound() {
  const [location] = useLocation();
  const [showDebug, setShowDebug] = useState(false);

  // Check what routes we support
  const supportedRoutes = [
    { path: "/", name: "Dashboard" },
    { path: "/cases/:id", name: "Case View" },
    { path: "/transcripts/:id", name: "Transcript View" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex items-center mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
            <h1 className="text-2xl font-bold text-gray-900">
              404 Page Not Found
            </h1>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              The page{" "}
              <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm">
                {location}
              </span>{" "}
              could not be found.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <h2 className="text-amber-800 font-medium flex items-center gap-1 mb-2">
                <Info className="h-4 w-4" /> Possible causes:
              </h2>
              <ul className="list-disc pl-5 text-sm space-y-1 text-amber-700">
                <li>The URL might be misspelled or incorrect</li>
                <li>
                  The page you're looking for might have been moved or deleted
                </li>
                <li>
                  There could be a missing route in the router configuration
                </li>
                <li>The case or transcript ID might not be valid</li>
              </ul>
            </div>

            {showDebug && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <h2 className="text-gray-800 font-medium mb-2">
                  Available Routes:
                </h2>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {supportedRoutes.map((route) => (
                    <li key={route.path} className="text-gray-700">
                      <span className="font-mono">{route.path}</span> -{" "}
                      {route.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="default"
            className="w-full sm:w-auto flex items-center gap-2"
            asChild
          >
            <Link href="/">
              <Home className="h-4 w-4" /> Go to Dashboard
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>

          <Button
            variant="ghost"
            className="w-full sm:w-auto text-gray-500 mt-2 sm:mt-0 sm:ml-auto"
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? "Hide" : "Debug Info"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
