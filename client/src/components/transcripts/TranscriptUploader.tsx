import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaFileUpload, FaQuestionCircle } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type TranscriptUploaderProps = {
  caseId: number;
};

export function TranscriptUploader({ caseId }: TranscriptUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Added ref for file input
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !formRef.current) return;

    // Validate file type
    const allowedTypes = ['.txt', '.docx', '.pdf']; // Added .pdf
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      toast({
        title: "Error",
        description: "Only .txt, .docx, and .pdf files are allowed",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('witnessName', 'Unknown Witness');
      formData.append('witnessType', 'Witness');
      formData.append('caseId', caseId.toString());

      console.log('Uploading file:', file.name, 'size:', file.size);

      const response = await fetch(`/api/cases/${caseId}/transcripts`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        throw new Error(errorText || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      if (!result?.id) {
        console.error('Invalid response:', result);
        throw new Error('Server returned invalid response');
      }

      console.log('Upload success:', result);

      // Success!
      queryClient.invalidateQueries({
        queryKey: [`/api/cases/${caseId}/transcripts`],
      });

      toast({
        title: "Success",
        description: "Transcript uploaded successfully.",
      });

      setFile(null);

    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: `Failed to upload transcript: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
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

      <form 
        ref={formRef} 
        onSubmit={handleSubmit} 
        encType="multipart/form-data"
      >
        <input type="hidden" name="caseId" value={caseId} />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".txt,.pdf,.docx"
          onChange={handleFileChange}
        /> {/* Hidden file input */}

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
                  <input type="hidden" name="title" value={file.name} />
                  <input type="hidden" name="witnessName" value="Unknown Witness" />
                </div>
                <div className="flex space-x-3 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFile(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload Transcript"}
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
                  <Button type="button" onClick={handleBrowseClick}> {/* Added onClick */}
                    Browse Files
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}