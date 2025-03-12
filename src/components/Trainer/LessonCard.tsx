import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { VideoPlayer, PdfViewer } from "@/components";
import { MdDelete } from "@/assets/icons";
import { Button, Input, Textarea } from "@/components/ui";
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
    <div className="w-full px-5 py-2 bg-app-border">
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
          <div className="flex justify-center md:block">
            {type == "video" ? (
              <div className="w-[400px]">
                <VideoPlayer url={path} />
              </div>
            ) : (
              <div className="h-[200px] w-[400px]">
                <PdfViewer path={path} />
              </div>
            )}
          </div>
          <div className="flex mt-3">
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Change
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
        <form
          onSubmit={handleSubmit(changeLessonDetails)}
          className="flex flex-col w-full h-full gap-4"
        >
          <div>
            <h1>Title</h1>
            <Input
              placeholder="input"
              {...register("title")}
              className="shadow outline-none text-app-primary bg-primary text-primary-foreground hover:bg-primary/90 placeholder:text-app-highlight"
            />
          </div>
          <div>
            <h1>Description</h1>
            <Textarea
              {...register("description")}
              placeholder="description"
              className="h-full border-0 shadow outline-none text-app-primary bg-primary text-primary-foreground hover:bg-primary/90 placeholder:text-app-highlight"
            />
          </div>
          <Button className="w-20" variant={"v1"}>
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LessonCard;
