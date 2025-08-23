import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { VideoPlayer, PdfViewer, Input, Textarea } from "@/components";
import { BiSave, MdDelete, MdEdit } from "@/assets/icons";
import { ILessonSchema, LessonSchema } from "@/validation/lesson.validation";

interface ILessonCardParams {
  id: string;
  path: string;
  title: string;
  description: string;
  type: "video" | "pdf";
  deleteLesson: (id: string) => void;
  updateLessonDetails: (lessonId: string, data: ILessonSchema) => void;
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
  const { register, handleSubmit } = useForm<ILessonSchema>({
    resolver: zodResolver(LessonSchema),
    defaultValues: { title, description },
  });

  const changeLessonDetails = (data: ILessonSchema) => {
    updateLessonDetails(id, data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      updateLessonFile(id, selectedFile);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#0e1118]/90 border border-zinc-700 shadow-xl p-6 space-y-6 transition-transform hover:scale-[1.01] hover:shadow-2xl">
      {/* Delete Button */}
      <div className="flex justify-end">
        <button
          onClick={() => deleteLesson(id)}
          className="p-2 rounded-full text-red-400 hover:text-red-500 hover:bg-red-500/10 transition"
        >
          <MdDelete className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Media Preview */}
        <div className="relative w-full max-w-[400px] rounded-xl overflow-hidden border border-zinc-700 bg-[#161b22] shadow-inner group">
          {type === "video" ? (
            <VideoPlayer title={title} url={path} />
          ) : (
            <div className="h-[220px] overflow-hidden">
              <PdfViewer path={path} />
            </div>
          )}

          {/* File Upload */}
          <div className="absolute top-3 left-3 opacity-90 group-hover:opacity-100 transition">
            <label
              htmlFor={`upload-${id}`}
              className="flex items-center gap-1 px-3 py-1 text-xs rounded-md bg-black/60 hover:bg-black/80 border border-zinc-600 text-white cursor-pointer transition"
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
              className="bg-[#1a1f2e] border border-zinc-700 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Lesson Description</label>
            <Textarea
              {...register("description")}
              placeholder="Enter description"
              className="bg-[#1a1f2e] border border-zinc-700 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white min-h-[100px] transition"
            />
          </div>

          <div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <BiSave className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonCard;
