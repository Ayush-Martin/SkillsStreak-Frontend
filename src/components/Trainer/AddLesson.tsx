import { useForm } from "react-hook-form";
import { FC, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Atom } from "react-loading-indicators";

import {
  IoCloseCircle,
  IoMdAddCircleOutline,
  MdAttachFile,
  MdDelete,
} from "@/assets/icons";
import { Button, Input, Textarea } from "@/components/ui";
import { LessonSchema, LessonSchemaType } from "@/pages/Trainer/EditModule";

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
    <div className="flex flex-col py-5 mt-2 gap-7">
      <div className="w-full px-5 py-2 border rounded-md border-app-border">
        <div className="flex justify-end">
          <button className="text-3xl text-app-neutral " onClick={close}>
            <IoCloseCircle />
          </button>
        </div>
        <div className="flex flex-col gap-10 mt-2 lg:flex-row">
          <div>
            <div className="relative flex flex-col justify-center items-center gap-2  lg:w-[400px] h-[200px] border border-app-border">
              {loading ? (
                <Atom
                  color="#F2A104"
                  size="large"
                  text="Loading ..."
                  textColor="#F2A104"
                />
              ) : (
                <>
                  {file && (
                    <p className="flex items-center gap-2 text-white">
                      <span className="text-3xl text-blue-500">
                        <MdAttachFile />
                      </span>
                      {file.name}
                    </p>
                  )}
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center p-2 font-medium rounded-md cursor-pointer text-app-accent backdrop:blur-sm bg-app-primary opacity-70 focus:ring-2 focus:ring-offset-2"
                  >
                    <p className="flex items-center gap-2">
                      <IoMdAddCircleOutline className="text-2xl" />
                      <span className="text-sm text-white font-boldonse">
                        {" "}
                        {file ? "Change" : "Upload"} File
                      </span>
                    </p>
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
          </div>
          <div className="flex flex-col w-full h-full gap-4">
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
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <Button
            variant={"v2"}
            onClick={handleSubmit(addLesson)}
            disabled={loading}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddLesson;
