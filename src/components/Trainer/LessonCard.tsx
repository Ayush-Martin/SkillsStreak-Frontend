import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { VideoPlayer, PdfViewer } from "@/components";
import { BiSave, MdDelete, MdEdit } from "@/assets/icons";
import { Input, Textarea } from "@/components/ui";
import {
  LessonSchema,
  LessonSchemaType,
} from "@/pages/Trainer/TrainerEditModulePage";

interface ILessonCardParams {
  id: string;
  path: string;
  title: string;
  description: string;
  type: "video" | "pdf";
  deleteLesson: (id: string) => void;
  updateLessonDetails: (lessonId: string, data: LessonSchemaType) => void;
  updateLessonFile: (lessonId: string, file: File) => void;
}

const LessonCard: FC<ILessonCardParams> = ({
  id,
  deleteLesson,
  path,
  title,
  description,
  type,
  updateLessonDetails,
  updateLessonFile,
}) => {
  const { register, handleSubmit } = useForm<LessonSchemaType>({
    resolver: zodResolver(LessonSchema),
    defaultValues: { title, description },
  });

  const changeLessonDetails = (data: LessonSchemaType) => {
    updateLessonDetails(id, data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      updateLessonFile(id, selectedFile);
    }
  };

  return (
    <div className="w-full rounded-xl border border-zinc-700 bg-[#0e1118] p-6 space-y-6 shadow-md">
      {/* Delete Button */}
      <div className="flex justify-end">
        <button
          onClick={() => deleteLesson(id)}
          className="text-red-500 hover:text-red-600 transition"
        >
          <MdDelete className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Media Preview */}
        <div className="relative w-full max-w-[400px] rounded-lg overflow-hidden border border-zinc-700 bg-[#161b22]">
          {type === "video" ? (
            <VideoPlayer title={title} url={path} />
          ) : (
            <div className="h-[220px] overflow-hidden">
              <PdfViewer path={path} />
            </div>
          )}

          {/* File Upload */}
          <div className="absolute top-3 left-3">
            <label
              htmlFor={`upload-${id}`}
              className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-black/60 hover:bg-black/80 border border-zinc-600 text-white cursor-pointer"
            >
              <MdEdit className="w-4 h-4" />
              Replace
              <input
                id={`upload-${id}`}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="video/*,application/pdf"
              />
            </label>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(changeLessonDetails)}
          className="flex flex-col justify-between w-full gap-6"
        >
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Lesson Title</label>
            <Input
              {...register("title")}
              placeholder="Enter title"
              className="bg-[#1a1f2e] border border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Lesson Description</label>
            <Textarea
              {...register("description")}
              placeholder="Enter description"
              className="bg-[#1a1f2e] border border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white min-h-[100px]"
            />
          </div>

          <div>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-green-600 hover:bg-green-700 text-white transition"
            >
              <BiSave className="w-5 h-5" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonCard;
