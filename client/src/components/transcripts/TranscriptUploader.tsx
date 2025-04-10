import { useState, useRef } from "react";
import { FaFileUpload } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { analyzeTranscript } from "@/lib/openai";

export function TranscriptUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      await processFile(selectedFile);
    }
  };

  const processFile = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        setIsAnalyzing(true);
        const content = e.target?.result as string;
        const analysis = await analyzeTranscript(content);

        // Store in localStorage
        const transcripts = JSON.parse(localStorage.getItem('transcripts') || '[]');
        transcripts.push({
          id: Date.now(),
          content,
          analysis,
          fileName: file.name,
          date: new Date().toISOString()
        });
        localStorage.setItem('transcripts', JSON.stringify(transcripts));

        toast({
          title: "Success",
          description: "Transcript analyzed successfully.",
        });
      } catch (error) {
        console.error("Analysis error:", error);
        toast({
          title: "Error",
          description: "Failed to analyze transcript",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
        setFile(null);
      }
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Upload Transcript</h2>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-primary" : "border-gray-300"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".txt,.pdf,.docx"
          onChange={handleFileChange}
        />

        <FaFileUpload className="mx-auto text-gray-400 text-3xl mb-2" />
        <h3 className="text-lg font-medium mb-1">
          {isAnalyzing ? "Analyzing..." : "Drop your transcript file here"}
        </h3>
        <p className="text-gray-600 mb-4">
          Support for .txt, .pdf, .docx files
        </p>

        <Button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
        >
          Browse Files
        </Button>
      </div>
    </div>
  );
}