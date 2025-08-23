import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  ErrorText,
} from "@/components";
import {
  ImageIcon,
  UploadCloud,
  Plus,
  Trash2,
  Book,
  FileText,
  BarChart,
  Tag,
  ListChecks,
  ListTodo,
  Save,
} from "lucide-react";
import { COURSE_DIFFICULTY } from "@/constants";
import { ICourseDifficulty } from "@/types/courseType";
import { FC, useState } from "react";
import { ICourseBasicDetailsSchema } from "@/validation/course.validation";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";

const labelClass = "text-sm font-medium text-zinc-300 flex items-center gap-2";

interface ICourseBasicDetailsProps {
  errors: FieldErrors<ICourseBasicDetailsSchema>;
  register: UseFormRegister<ICourseBasicDetailsSchema>;
  setValue: UseFormSetValue<ICourseBasicDetailsSchema>;
  trigger: UseFormTrigger<ICourseBasicDetailsSchema>;
  previewThumbnail: string | null;
  handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  watch: UseFormWatch<ICourseBasicDetailsSchema>;
  submit: () => void;
  categories: Array<{ _id: string; categoryName: string }>;
}

const CourseBasicDetails: FC<ICourseBasicDetailsProps> = ({
  errors,
  register,
  setValue,
  trigger,
  previewThumbnail,
  handleThumbnailChange,
  watch,
  submit,
  categories,
}) => {
  const [newSkill, setNewSkill] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  const skills = watch("skillsCovered") || [];
  const requirements = watch("requirements") || [];

  const addSkill = async () => {
    if (newSkill.trim()) {
      const updated = [...skills, newSkill.trim()];
      setValue("skillsCovered", updated);
      await trigger("skillsCovered");
      setNewSkill("");
    }
  };

  const addRequirement = async () => {
    if (newRequirement.trim()) {
      const updated = [...requirements, newRequirement.trim()];
      setValue("requirements", updated);
      await trigger("requirements");
      setNewRequirement("");
    }
  };

  const removeSkill = async (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    setValue("skillsCovered", updated);
    await trigger("skillsCovered");
  };

  const removeRequirement = async (index: number) => {
    const updated = requirements.filter((_, i) => i !== index);
    setValue("requirements", updated);
    await trigger("requirements");
  };

  return (
    <div className="w-full p-6 md:p-10 text-white space-y-12">
      {/* Thumbnail & Info */}
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-2/5 space-y-4">
          <label className={labelClass}>
            <ImageIcon className="w-4 h-4" /> Course Thumbnail
          </label>
          <div className="relative h-[200px] w-full rounded-md border border-dashed border-zinc-600 flex items-center justify-center bg-[#131722] hover:border-zinc-400 transition-colors">
            {previewThumbnail ? (
              <img
                src={previewThumbnail}
                alt="thumbnail"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <ImageIcon className="w-10 h-10 text-zinc-500" />
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-2 mt-4">
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 text-3xl font-medium text-white border-b-2 border-green-400 cursor-pointer "
            >
              <UploadCloud />
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

        <div className="w-full md:w-3/5 space-y-6">
          <div className="space-y-1.5">
            <label htmlFor="title" className={labelClass}>
              <Book className="w-4 h-4" /> Course Title
            </label>
            <Input
              id="title"
              {...register("title")}
              className="bg-[#1c2130] border border-zinc-700 text-white"
            />
            {errors.title?.message && (
              <ErrorText error={errors.title.message} />
            )}
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <BarChart className="w-4 h-4" /> Difficulty
            </label>
            <Select
              value={watch("difficulty")}
              onValueChange={(val) =>
                setValue("difficulty", val as ICourseDifficulty)
              }
            >
              <SelectTrigger className="bg-[#1c2130] border border-zinc-700 text-white">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-[#131722] text-white border border-zinc-700">
                <SelectGroup>
                  {COURSE_DIFFICULTY.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.difficulty?.message && (
              <ErrorText error={errors.difficulty.message} />
            )}
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              <Tag className="w-4 h-4" /> Category
            </label>
            <Select
              value={watch("categoryId")}
              onValueChange={(val) => setValue("categoryId", val)}
            >
              <SelectTrigger className="bg-[#1c2130] border border-zinc-700 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#131722] text-white border border-zinc-700">
                <SelectGroup>
                  {categories.map(({ _id, categoryName }) => (
                    <SelectItem key={_id} value={_id}>
                      {categoryName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.categoryId?.message && (
              <ErrorText error={errors.categoryId.message} />
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="price" className={labelClass}>
              ₹ Price
            </label>
            <Input
              id="price"
              type="number"
              {...register("price")}
              className="bg-[#1c2130] border border-zinc-700 text-white"
            />
            {errors.price?.message && (
              <ErrorText error={errors.price.message} />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className={labelClass}>
          <FileText className="w-4 h-4" /> Course Description
        </label>
        <Textarea
          id="description"
          rows={5}
          {...register("description")}
          className="bg-[#1c2130] border border-zinc-700 text-white"
        />
        {errors.description?.message && (
          <ErrorText error={errors.description.message} />
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 space-y-4">
          <label className={labelClass}>
            <ListChecks className="w-4 h-4" /> Skills Covered
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              className="bg-[#1c2130] border border-zinc-700 text-white flex-1"
            />
            <Button type="button" variant="secondary" onClick={addSkill}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {skills.map((skill, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-[#131722] px-3 py-2 rounded-md"
              >
                <span className="text-sm text-white">{skill}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-transparent"
                  onClick={() => removeSkill(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
          {errors.skillsCovered?.message && (
            <ErrorText error={errors.skillsCovered.message} />
          )}
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <label className={labelClass}>
            <ListTodo className="w-4 h-4" /> Requirements
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter a requirement"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRequirement()}
              className="bg-[#1c2130] border border-zinc-700 text-white flex-1"
            />
            <Button type="button" variant="secondary" onClick={addRequirement}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {requirements.map((req, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-[#131722] px-3 py-2 rounded-md"
              >
                <span className="text-sm text-white">{req}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-transparent"
                  onClick={() => removeRequirement(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
          {errors.requirements?.message && (
            <ErrorText error={errors.requirements.message} />
          )}
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <Button
          size="lg"
          onClick={submit}
          className="flex gap-2 items-center text-white bg-indigo-600 hover:bg-indigo-500"
        >
          <Save className="w-5 h-5" /> Save Course
        </Button>
      </div>
    </div>
  );
};

export default CourseBasicDetails;
