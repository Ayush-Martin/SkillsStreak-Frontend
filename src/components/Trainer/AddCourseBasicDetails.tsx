import { FC, useEffect, useState } from "react";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";

import {
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { axiosGetRequest } from "@/config/axios";
import { ErrorText } from "@/components";
import { LuImageOff, MdEdit } from "@/assets/icons";
import { COURSE_DIFFICULTY } from "@/constants/course";
import { ICourseDifficulty } from "@/types/courseType";
import { addCourseSchemaType } from "@/hooks/useAddCourse";

interface IAddCourseBasicDetailsProps {
  errors: FieldErrors<addCourseSchemaType>;
  register: UseFormRegister<addCourseSchemaType>;
  setValue: UseFormSetValue<addCourseSchemaType>;
  trigger: UseFormTrigger<addCourseSchemaType>;
  previewThumbnail: string | null;
  handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  watch: UseFormWatch<addCourseSchemaType>;
}

const AddCourseBasicDetails: FC<IAddCourseBasicDetailsProps> = ({
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
              <div className="w-[350px] h-[200px] text-7xl border rounded-md border-app-border flex justify-center items-center text-app-border">
                <LuImageOff />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-2 mt-4">
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 text-3xl font-medium text-white border-b-2 border-green-400 cursor-pointer "
            >
              <MdEdit />
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
            <p className="text-white font-playwritehu">Title :</p>
            <Input
              placeholder="title"
              {...register("title")}
              className="bg-transparent border border-app-border placeholder:text-muted-foreground"
              onBlur={() => trigger("title")}
            />
            {errors.title && <ErrorText error={errors.title.message!} />}
          </div>

          <div>
            <p className="text-white font-playwritehu ">Difficulty :</p>
            <Select
              defaultValue={watch("difficulty")}
              onValueChange={(val: ICourseDifficulty) => {
                setValue("difficulty", val);
              }}
            >
              <SelectTrigger className="border border-app-border">
                <SelectValue placeholder="Select a Difficulty type" />
              </SelectTrigger>
              <SelectContent className="bg-app-neutral">
                <SelectGroup>
                  <SelectLabel>Difficulty</SelectLabel>
                  {COURSE_DIFFICULTY.map((difficulty) => (
                    <SelectItem value={difficulty} key={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.difficulty && (
              <ErrorText error={errors.difficulty.message!} />
            )}
          </div>
          <div>
            <p className="text-white font-playwritehu">Category :</p>
            <Select
              defaultValue={watch("categoryId")}
              onValueChange={(val) => {
                setValue("categoryId", val);
              }}
            >
              <SelectTrigger className="border border-app-border">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-app-neutral">
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem value={category._id} key={category._id}>
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
            <p className="text-white font-playwritehu">Price :</p>
            <Input
              {...register("price")}
              className="bg-transparent border border-app-border"
              type="number"
              defaultValue={0}
              onBlur={() => trigger("price")}
            />
            {errors.price && <ErrorText error={errors.price.message!} />}
          </div>
        </div>
        <div></div>
      </div>
      <div>
        <p className="text-white font-playwritehu">Description :</p>
        <Textarea
          {...register("description")}
          className="border border-app-border"
          onBlur={() => trigger("description")}
        ></Textarea>
        {errors.description && (
          <ErrorText error={errors.description.message!} />
        )}
      </div>
    </form>
  );
};

export default AddCourseBasicDetails;
