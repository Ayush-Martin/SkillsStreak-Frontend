import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosPostRequest } from "@/config/axios";
import { MdEdit } from "@/assets/icons";
import { Button, Input, Textarea } from "../ui";
import { ThreeDot } from "react-loading-indicators";
import ErrorText from "../common/ErrorText";

const StreamSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type StreamSchemaType = z.infer<typeof StreamSchema>;

interface INewStreamProps {
  startStream: (token: string, roomId: string) => void;
  courseId?: string;
}

const NewStream: FC<INewStreamProps> = ({ startStream, courseId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StreamSchemaType>({
    resolver: zodResolver(StreamSchema),
    mode: "onBlur",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setThumbnail(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const createNewStream = async (data: StreamSchemaType) => {
    if (!thumbnail) return;
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("thumbnail", thumbnail);
    formData.append("isPublic", data.public ? "true" : "false");
    setIsLoading(true);
    const res = await axiosPostRequest(
      `/trainer/courses/${courseId}/live`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (!res) return;
    setIsLoading(false);
    startStream(res.data.token, res.data.stream.roomId);
  };

  return (
    <div className="w-full px-5 py-2 border rounded-md border-app-border">
      <h1 className="my-5 text-3xl text-center">Live Stream</h1>
      <div className="flex flex-col gap-10 mt-2 lg:flex-row">
        <div>
          <div className="relative flex justify-center md:block">
            {previewUrl ? (
              <img
                className="w-[400px] h-[200px] object-cover"
                src={previewUrl}
              />
            ) : (
              <div className="w-[400px] h-[200px] bg-green-500"></div>
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
          onSubmit={handleSubmit(createNewStream)}
          className="flex flex-col w-full h-full gap-4"
        >
          <div className="px-2 border-s border-app-accent">
            <h1 className="mb-1 text-lg font-tektur">Title :</h1>
            <Input
              placeholder="input"
              {...register("title")}
              className="bg-transparent border shadow outline-none border-app-border text-primary-foreground hover:bg-primary/90 placeholder:text-app-highlight"
            />
            {errors.title && <ErrorText error={errors.title.message!} />}
          </div>
          <div className="px-2 border-s border-app-accent">
            <h1 className="mb-1 text-lg font-tektur ">Description :</h1>
            <Textarea
              {...register("description")}
              placeholder="description"
              className="h-full bg-transparent shadow outline-none hover:bg-primary/90 border-app-border placeholder:text-app-highlight"
            />
            {errors.description && (
              <ErrorText error={errors.description.message!} />
            )}
          </div>
          <Button variant={"v2"} disabled={isLoading}>
            {isLoading ? <ThreeDot color={"#ffffff"} /> : "Start Stream"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewStream;
