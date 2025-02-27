import { addCourseSchemaType } from "@/hooks/useAddCourse";
import { FC, useEffect, useState } from "react";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { axiosGetRequest } from "@/config/axios";
import ErrorText from "../ErrorText";
import { MdHideImage } from "react-icons/md";

interface ICourseBasicDetailsProps {
  errors: FieldErrors<addCourseSchemaType>;
  register: UseFormRegister<addCourseSchemaType>;
  setValue: UseFormSetValue<addCourseSchemaType>;
  trigger: UseFormTrigger<addCourseSchemaType>;
  previewThumbnail: string | null;
  handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  watch: UseFormWatch<addCourseSchemaType>;
}

const CourseBasicDetails: FC<ICourseBasicDetailsProps> = ({
  errors,
  register,
  setValue,
  trigger,
  previewThumbnail,
  handleThumbnailChange,
  watch,
}) => {
  const [categories, setCategories] = useState<
    Array<{ categoryName: string; _id: string }>
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axiosGetRequest("/categories");
      if (!res) return;
      setCategories(res.data);
    };

    fetchCategories();
  }, []);

  return (
    <form className="my-10 ">
      <div className="items-center gap-2 mb-2 lg:flex">
        <div className=" lg:w-1/2 h-[240px] mb-10 lg:mb-0 flex flex-col items-center justify-center">
          <div className="w-[350px] ">
            {previewThumbnail ? (
              <img
                src={previewThumbnail}
                className="object-contain w-[350px] h-[200px]"
              />
            ) : (
              <div className="w-[350px] h-[200px] text-9xl bg-app-border flex justify-center items-center text-app-accent">
                <MdHideImage />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-2 mt-4">
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Change
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                onChange={handleThumbnailChange}
                accept="image/*"
              />
            </label>
            {!previewThumbnail && <ErrorText error="no image provided" />}
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:px-4 lg:w-1/2">
          <div className="">
            <p className="text-app-accent">Title</p>
            <Input
              placeholder="title"
              {...register("title")}
              className="bg-app-border"
              onBlur={() => trigger("title")}
            />
            {errors.title && <ErrorText error={errors.title.message!} />}
          </div>

          <div>
            <p className="text-app-accent">Difficulty</p>
            <Select
              defaultValue={watch("difficulty")}
              onValueChange={(val: "beginner" | "intermediate" | "advance") => {
                console.log(val);
                setValue("difficulty", val);
              }}
            >
              <SelectTrigger className="border-0 bg-app-border">
                <SelectValue placeholder="Select a Difficulty type" />
              </SelectTrigger>
              <SelectContent className="bg-app-neutral">
                <SelectGroup>
                  <SelectLabel>Difficulty</SelectLabel>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advance">Advance</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.difficulty && (
              <ErrorText error={errors.difficulty.message!} />
            )}
          </div>
          <div>
            <p className="text-app-accent">Category</p>
            <Select
              defaultValue={watch("categoryId")}
              onValueChange={(val) => {
                setValue("categoryId", val);
              }}
            >
              <SelectTrigger className="border-0 bg-app-border">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-app-neutral">
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem value={category._id}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <ErrorText error={errors.categoryId.message!} />
            )}
          </div>
          <div>
            <p className="text-app-accent">Price</p>
            <Input
              {...register("price")}
              className="bg-app-border"
              type="number"
              onBlur={() => trigger("price")}
            />
            {errors.price && <ErrorText error={errors.price.message!} />}
          </div>
        </div>
        <div></div>
      </div>
      <div>
        <p className="text-app-accent">Description</p>
        <Textarea
          {...register("description")}
          className="border-0 bg-app-border"
          onBlur={() => trigger("description")}
        ></Textarea>
        {errors.description && (
          <ErrorText error={errors.description.message!} />
        )}
      </div>
    </form>
  );
};

export default CourseBasicDetails;
