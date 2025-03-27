import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  Button,
} from "@/components/ui";
import {
  axiosGetRequest,
  axiosPatchRequest,
  axiosPutRequest,
} from "@/config/axios";
import { ErrorText } from "@/components";
import { ICourse, ICourseDifficulty } from "@/types/courseType";
import { TRAINER_COURSES_API } from "@/constants/API";
import { successPopup } from "@/utils/popup";
import {
  CourseCategoryIdValidationRule,
  CourseDescriptionValidationRule,
  CourseDifficultyValidationRule,
  CoursePriceValidationRule,
  CourseTitleValidationRule,
} from "@/utils/validationRules";
import { zodResolver } from "@hookform/resolvers/zod";
import { COURSE_DIFFICULTY } from "@/constants/course";
import { MdEdit } from "@/assets/icons";

interface ICourseBasicDetailsProps {
  course: ICourse;
  setCourse: (course: ICourse) => void;
}

const courseBasicDetailsSchema = z.object({
  title: CourseTitleValidationRule,
  difficulty: CourseDifficultyValidationRule,
  categoryId: CourseCategoryIdValidationRule,
  price: CoursePriceValidationRule,
  description: CourseDescriptionValidationRule,
});

type courseBasicDetailsSchemaType = z.infer<typeof courseBasicDetailsSchema>;

const CourseBasicDetails: FC<ICourseBasicDetailsProps> = ({
  course,
  setCourse,
}) => {
  const [categories, setCategories] = useState<
    Array<{ categoryName: string; _id: string }>
  >([]);
  const [thumbnail, setThumbnail] = useState(course.thumbnail);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axiosGetRequest("/categories");
      if (!res) return;
      setCategories(res.data);
    };

    fetchCategories();
  }, []);

  const {
    register,
    trigger,
    watch,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<courseBasicDetailsSchemaType>({
    resolver: zodResolver(courseBasicDetailsSchema),
    defaultValues: course,
  });

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const formData = new FormData();

      formData.append("image", selectedFile);

      const res = await axiosPatchRequest(
        `${TRAINER_COURSES_API}/${course._id}/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!res) return;
      setThumbnail(res.data);
      successPopup(res.message || "Thumbnail changed");
      setCourse({ ...course, thumbnail });
    }
  };

  const submit = async (data: courseBasicDetailsSchemaType) => {
    const res = await axiosPutRequest(
      `${TRAINER_COURSES_API}/${course._id}/basicDetails`,
      data
    );

    if (!res) return;
    successPopup(res.message!);
    setCourse({ ...course, ...data, thumbnail });
  };

  return (
    <form className="my-10 " onSubmit={handleSubmit(submit)}>
      <div className="items-center gap-2 mb-2 lg:flex">
        <div className=" lg:w-1/2 h-[240px] mb-10 lg:mb-0 flex flex-col items-center justify-center">
          <div className="w-[350px]">
            <img
              src={thumbnail}
              className="object-contain w-[350px] h-[200px]"
            />
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
      </div>
      <Button variant={"v3"} className="mt-2">
        Save
      </Button>
    </form>
  );
};

export default CourseBasicDetails;
