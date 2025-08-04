import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Textarea
} from "@/components";
import { FileText, Image as ImageIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { IAssignmentSubmission } from "@/types/courseType";

interface AssignmentSubmitModalProps {
  onClose: () => void;
  onSubmit: (
    assignmentId: string,
    type: "pdf" | "text" | "image",
    file?: File,
    textContent?: string
  ) => void;
  redoAssignment: (
    assignmentId: string,
    assignmentSubmissionId: string,
    type: "pdf" | "text" | "image",
    file?: File,
    textContent?: string
  ) => void;
  assignment: IAssignmentSubmission;
}

const submissionTypes: Record<
  "text" | "pdf" | "image",
  {
    label: string;
    accept: string;
    icon: React.ElementType;
  }
> = {
  text: {
    label: "Text",
    accept: "",
    icon: FileText,
  },
  pdf: {
    label: "PDF",
    accept: "application/pdf",
    icon: Upload,
  },
  image: {
    label: "Image",
    accept: "image/*",
    icon: ImageIcon,
  },
};

const AssignmentSubmitModal: React.FC<AssignmentSubmitModalProps> = ({
  onClose,
  onSubmit,
  assignment,
  redoAssignment,
}) => {
  const [type, setType] = useState<"text" | "pdf" | "image">("text");
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState<string>("");

  const previewUrl = file ? URL.createObjectURL(file) : null;

  useEffect(() => {
    setType("text");
    setFile(null);
    setTextContent("");
  }, []);

  const handleSubmit = () => {
    onSubmit(assignment._id, type, file || undefined, textContent);
  };

  const handleResubmit = () => {
    redoAssignment(
      assignment._id,
      assignment.assignmentSubmissionId!,
      type,
      file || undefined,
      textContent
    );
  };

  const renderSubmitted = () => {
    switch (assignment.type) {
      case "pdf":
        return (
          <iframe
            src={assignment.path}
            className="w-full h-80 rounded border border-[#3a3a3a] bg-[#1e1e1e]"
            title="Submitted PDF"
          />
        );
      case "image":
        return (
          <img
            src={assignment.path}
            alt="Submitted"
            className="w-full max-h-80 object-contain rounded border border-[#3a3a3a] bg-[#1e1e1e]"
          />
        );
      case "text":
        return (
          <div className="w-full p-4 bg-[#2a2a2a] rounded border border-[#3a3a3a] text-sm text-white/90 whitespace-pre-wrap">
            {assignment.content || assignment.path}
          </div>
        );
      default:
        return null;
    }
  };

  const renderPreview = () => {
    if (!file || type === "text") return null;

    return (
      <div className="mt-4 p-3 rounded-lg border border-[#3a3a3a] bg-[#1e1e1e]">
        <p className="text-sm font-semibold text-white/80 mb-2">Preview</p>
        {type === "pdf" ? (
          <iframe
            src={previewUrl as string}
            title="PDF Preview"
            className="w-full h-64 border border-[#2a2a2a] rounded"
          />
        ) : (
          <img
            src={previewUrl as string}
            alt="Image Preview"
            className="w-full max-h-64 object-contain border border-[#2a2a2a] rounded"
          />
        )}
      </div>
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1e1e1e] border border-[#2a2a2a] text-white p-6 rounded-xl shadow-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2 text-white">
            {assignment.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-white/70">{assignment.description}</p>
            <p className="text-sm text-white/90 mt-2">
              <span className="font-semibold">Task:</span> {assignment.task}
            </p>
          </div>

          {(assignment.status === "completed" ||
            assignment.status === "verified") && (
            <div className="bg-[#2a2a2a] p-4 rounded-lg border border-[#3a3a3a]">
              <h4 className="text-sm font-semibold mb-3 text-white/80">
                Submitted ({assignment.type})
              </h4>
              {renderSubmitted()}
            </div>
          )}

          {(assignment.status === "pending" ||
            assignment.status === "redo") && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(submissionTypes).map(([key, config]) => {
                  const isActive = type === key;
                  return (
                    <Button
                      key={key}
                      onClick={() => setType(key as "text" | "pdf" | "image")}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border transition-all",
                        isActive
                          ? "bg-gray-100 text-black border-gray-300"
                          : "bg-[#2a2a2a] border-[#3a3a3a] text-white hover:bg-[#333]"
                      )}
                    >
                      <config.icon className="w-4 h-4" />
                      {config.label}
                    </Button>
                  );
                })}
              </div>

              {type === "text" ? (
                <Textarea
                  placeholder="Write your answer..."
                  className="min-h-[120px] resize-none bg-[#2a2a2a] text-white border border-[#3a3a3a] focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
              ) : (
                <>
                  <label className="flex items-center justify-center w-full h-36 border-2 border-dashed border-[#3a3a3a] rounded-lg bg-[#2a2a2a] hover:bg-[#333] cursor-pointer transition">
                    <div className="text-center">
                      <Upload className="w-6 h-6 mx-auto mb-1 text-white/80" />
                      <p className="text-sm text-white/70">
                        Click or drag to upload {type.toUpperCase()}
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept={submissionTypes[type].accept}
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {renderPreview()}
                </>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={
                    assignment.status === "redo" ? handleResubmit : handleSubmit
                  }
                  disabled={type !== "text" && !file}
                  className="bg-gray-100 text-black px-6 py-2 rounded-md hover:bg-gray-300"
                >
                  {assignment.status === "redo" ? "Edit Submission" : "Submit"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentSubmitModal;
