import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { VideoPlayer, PdfViewer } from "@/components";
import { BiSave, MdDelete, MdEdit } from "@/assets/icons";
import { Input, Textarea } from "@/components/ui";
import { LessonSchema, LessonSchemaType } from "@/pages/Trainer/EditModule";

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

  const changeLessonDetails = async (data: LessonSchemaType) => {
    await updateLessonDetails(id, data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      updateLessonFile(id, selectedFile);
    }
  };

  return (
    <div className="w-full px-5 py-2 border rounded-md border-app-border">
      <div className="flex justify-end">
        <button
          className="text-2xl text-red-500"
          onClick={() => deleteLesson(id)}
        >
          <MdDelete />
        </button>
      </div>
      <div className="flex flex-col gap-10 mt-2 lg:flex-row">
        <div>
          <div className="relative flex justify-center md:block">
            {type == "video" ? (
              <div className="w-[400px]">
                <VideoPlayer url={path} />
              </div>
            ) : (
              <div className="h-[200px] w-[400px]">
                <PdfViewer path={path} />
              </div>
            )}

            <div className="absolute flex top-2 left-2 ">
              <label
                htmlFor="file-upload"
                className="inline-flex items-center p-2 text-lg font-medium border rounded-md cursor-pointer text-app-accent backdrop:blur-sm border-app-border bg-app-primary opacity-70 focus:ring-2 focus:ring-offset-2"
              >
                <MdEdit />
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(changeLessonDetails)}
          className="flex flex-col w-full h-full gap-4"
        >
          <div className="px-2 border-s border-app-accent">
            <h1 className="mb-1 text-lg font-tektur">Title :</h1>
            <Input
              placeholder="input"
              {...register("title")}
              className="bg-transparent border shadow outline-none border-app-border text-primary-foreground hover:bg-primary/90 placeholder:text-app-highlight"
            />
          </div>
          <div className="px-2 border-s border-app-accent">
            <h1 className="mb-1 text-lg font-tektur ">Description :</h1>
            <Textarea
              {...register("description")}
              placeholder="description"
              className="h-full bg-transparent shadow outline-none hover:bg-primary/90 border-app-border placeholder:text-app-highlight"
            />
          </div>
          <button className="flex items-center w-20 gap-2 px-3 py-1 border rounded-full border-app-tertiary">
            <BiSave className="text-3xl" />
            save
          </button>
        </form>
      </div>
    </div>
  );
};

export default LessonCard;
