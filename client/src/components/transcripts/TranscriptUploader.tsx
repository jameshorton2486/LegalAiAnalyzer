import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FaFileUpload, FaQuestionCircle } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type TranscriptUploaderProps = {
  caseId: number;
};

export function TranscriptUploader({ caseId }: TranscriptUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest(
        "POST",
        `/api/cases/${caseId}/transcripts`,
        { body: formData, headers: {} }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/cases/${caseId}/transcripts`],
      });
      toast({
        title: "Success",
        description: "Transcript uploaded successfully.",
      });
      setFile(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to upload transcript: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("witnessName", "Unknown Witness");

    uploadMutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">
          Upload Transcript
        </h2>
        <Button variant="ghost" size="sm" className="text-primary-dark hover:text-primary-light flex items-center">
          <FaQuestionCircle className="mr-1 h-4 w-4" />
          Help
        </Button>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging
            ? "border-primary bg-primary-light bg-opacity-5"
            : "border-neutral-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mx-auto max-w-md">
          {file ? (
            <>
              <div className="mb-4 p-3 bg-neutral-100 rounded-md">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-neutral-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex space-x-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setFile(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={uploadMutation.isPending}
                >
                  {uploadMutation.isPending
                    ? "Uploading..."
                    : "Upload Transcript"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <FaFileUpload className="mx-auto text-neutral-400 text-3xl mb-2" />
              <h3 className="text-lg font-medium text-neutral-700 mb-1">
                Drop your transcript file here
              </h3>
              <p className="text-neutral-600 mb-4">
                Support for .txt, .pdf, .docx files. Max file size: 50MB
              </p>

              <div className="flex justify-center">
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Browse Files
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".txt,.pdf,.docx"
                      onChange={handleFileChange}
                    />
                  </label>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
