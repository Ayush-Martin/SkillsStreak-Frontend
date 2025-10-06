import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Modal, ErrorText } from "@/components";
import { FileText, Image as ImageIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { IAssignmentSubmission } from "@/types/courseType";
import { AssignmentSubmissionValidationRule } from "@/utils/validationRule";

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
  { label: string; accept: string; icon: React.ElementType }
> = {
  text: { label: "Text", accept: "", icon: FileText },
  pdf: { label: "PDF", accept: "application/pdf", icon: Upload },
  image: { label: "Image", accept: "image/*", icon: ImageIcon },
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
  const [loading, setLoading] = useState(false);
  const [textContentError, setTextContentError] = useState("");

  const previewUrl = file ? URL.createObjectURL(file) : null;

  useEffect(() => {
    setType("text");
    setFile(null);
    setTextContent("");
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    if (type === "text") {
      const parsed =
        AssignmentSubmissionValidationRule.content.safeParse(textContent);
      if (!parsed.success) {
        setTextContentError(parsed.error.issues[0].message);
        setLoading(false);
        return;
      }
    }
    await onSubmit(assignment._id, type, file || undefined, textContent);
    setLoading(false);
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
            title="Submitted PDF"
            className="w-full h-80 rounded-lg border border-gray-700 bg-gray-900 shadow-inner"
          />
        );
      case "image":
        return (
          <img
            src={assignment.path}
            alt="Submitted"
            className="w-full max-h-80 object-contain rounded-lg border border-gray-700 bg-gray-900 shadow-inner"
          />
        );
      case "text":
        return (
          <div className="w-full p-4 bg-gray-800 rounded-lg border border-gray-700 text-sm text-white/90 whitespace-pre-wrap shadow-inner">
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
      <div className="mt-4 p-3 rounded-lg border border-gray-700 bg-gray-900 shadow-md">
        <p className="text-sm font-medium text-white/70 mb-2 tracking-wide uppercase">
          Preview
        </p>
        {type === "pdf" ? (
          <iframe
            src={previewUrl as string}
            title="PDF Preview"
            className="w-full h-64 border border-gray-700 rounded-lg shadow-inner"
          />
        ) : (
          <img
            src={previewUrl as string}
            alt="Image Preview"
            className="w-full max-h-64 object-contain border border-gray-700 rounded-lg shadow-inner"
          />
        )}
      </div>
    );
  };

  return (
    <Modal onClose={onClose} title={assignment.title} heightPx={600}>
      <div className="space-y-6">
        {/* Assignment Description */}
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 shadow-inner">
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            {assignment.description}
          </p>
          <p className="text-sm md:text-base text-white mt-2">
            <span className="font-semibold tracking-wide">Task:</span>{" "}
            {assignment.task}
          </p>
        </div>

        {/* Submitted Content */}
        {(assignment.status === "completed" ||
          assignment.status === "verified") && (
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 shadow-md">
            <h4 className="text-sm md:text-base font-semibold text-gray-400 mb-3 tracking-wide uppercase">
              Submitted ({assignment.type})
            </h4>
            {renderSubmitted()}
          </div>
        )}

        {/* Submission Form */}
        {(assignment.status === "pending" || assignment.status === "redo") && (
          <>
            {/* Type Selector */}
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(submissionTypes).map(([key, config]) => {
                const isActive = type === key;
                return (
                  <Button
                    key={key}
                    onClick={() => setType(key as "text" | "pdf" | "image")}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300 hover:scale-105",
                      isActive
                        ? "bg-blue-600 text-white border-blue-500 shadow-lg"
                        : "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                    )}
                  >
                    <config.icon className="w-4 h-4" />
                    {config.label}
                  </Button>
                );
              })}
            </div>

            {/* Input Area */}
            {type === "text" ? (
              <>
                <Textarea
                  placeholder="Write your answer..."
                  className="min-h-[120px] resize-none bg-gray-800 text-white border border-gray-700 rounded-lg p-3 text-sm md:text-base leading-relaxed focus:ring-2 focus:ring-blue-500"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
                {textContentError && <ErrorText error={textContentError} />}
              </>
            ) : (
              <>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                  <Upload className="w-6 h-6 mb-2 text-white/80" />
                  <p className="text-sm md:text-base text-gray-300 text-center">
                    upload {type.toUpperCase()}
                  </p>
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

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <Button
                onClick={
                  assignment.status === "redo" ? handleResubmit : handleSubmit
                }
                disabled={(type !== "text" && !file) || loading}
                className={cn(
                  "px-6 py-2 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105",
                  "bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400"
                )}
              >
                {assignment.status === "redo" ? "Edit Submission" : "Submit"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AssignmentSubmitModal;
