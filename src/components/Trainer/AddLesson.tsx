import { IoCloseCircle } from "react-icons/io5";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { LessonSchema, LessonSchemaType } from "@/pages/Trainer/EditModule";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface IAddLessonParams {
  close: () => void;
  submit: (data: LessonSchemaType & { file: File }) => void;
}

const AddLesson: FC<IAddLessonParams> = ({ close, submit }) => {
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
    <div className="flex justify-center">
      <div className="absolute top-0   bg-opacity-30 bg-white rounded-md backdrop-blur-sm  m-auto  w-[370px] ">
        <div className="flex justify-end pt-3 pr-5">
          <button onClick={close} className="text-2xl text-app-accent">
            <IoCloseCircle />
          </button>
        </div>
        <form
          className="flex flex-col gap-2 mx-10 my-3"
          onSubmit={handleSubmit(addLesson)}
        >
          <Input
            placeholder="input"
            {...register("title")}
            className="outline-none text-app-primary bg-app-neutral placeholder:text-app-highlight"
          />
          <Textarea
            {...register("description")}
            placeholder="description"
            className="outline-none text-app-primary bg-app-neutral placeholder:text-app-highlight"
          />
          <Input
            type="file"
            accept="video/*,application/pdf"
            className="bg-app-neutral text-app-primary"
            onChange={handleFileChange}
          />

          <Button>Add</Button>
        </form>
      </div>
    </div>
  );
};

export default AddLesson;
