import { useForm } from "react-hook-form";
import { FC, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Atom } from "react-loading-indicators";

import {
  IoCloseCircle,
  IoMdAddCircleOutline,
  MdAttachFile,
} from "@/assets/icons";
import { Button, Input, Textarea } from "@/components";
import { LessonSchemaType, LessonSchema } from "@/validation/lesson.validation";

interface IAddLessonParams {
  close: () => void;
  submit: (data: LessonSchemaType & { file: File }) => void;
  loading: boolean;
}

const AddLesson: FC<IAddLessonParams> = ({ close, submit, loading }) => {
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit } = useForm<LessonSchemaType>({
    resolver: zodResolver(LessonSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const addLesson = (lesson: LessonSchemaType) => {
    if (!file) return;
    submit({ ...lesson, file });
  };

  return (
    <div className="flex flex-col gap-6 p-6 rounded-xl border border-app-border bg-[#0d111c] shadow-xl w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Add New Lesson</h2>
        <button
          onClick={close}
          className="text-3xl text-app-neutral hover:text-red-500 transition"
        >
          <IoCloseCircle />
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* File Upload Box */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 rounded-lg border border-app-border bg-[#111827] min-h-[200px]">
          {loading ? (
            <Atom
              color="#F2A104"
              size="large"
              text="Uploading..."
              textColor="#F2A104"
            />
          ) : (
            <>
              {file && (
                <div className="flex items-center gap-2 text-sm text-white break-all">
                  <MdAttachFile className="text-xl text-blue-500" />
                  {file.name}
                </div>
              )}

              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md cursor-pointer bg-app-accent/20 text-app-accent hover:bg-app-accent/30 transition"
              >
                <IoMdAddCircleOutline className="text-lg" />
                {file ? "Change File" : "Upload File"}
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=""
                />
              </label>
            </>
          )}
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-white">
              Title
            </label>
            <Input
              placeholder="Lesson title"
              {...register("title")}
              className="bg-transparent border border-app-border focus:ring-1 focus:ring-app-accent placeholder:text-app-highlight text-white"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-white">
              Description
            </label>
            <Textarea
              {...register("description")}
              placeholder="Lesson description"
              className="min-h-[120px] resize-none bg-transparent border border-app-border focus:ring-1 focus:ring-app-accent placeholder:text-app-highlight text-white"
            />
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="flex justify-end">
        <Button
          variant={"v2"}
          onClick={handleSubmit(addLesson)}
          disabled={loading || !file}
        >
          Add Lesson
        </Button>
      </div>
    </div>
  );
};

export default AddLesson;
