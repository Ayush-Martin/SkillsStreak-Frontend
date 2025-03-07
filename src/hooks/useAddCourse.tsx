import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { errorPopup, successPopup } from "@/utils/popup";
import { axiosPostRequest } from "@/config/axios";
import { TRAINER_COURSES_API } from "@/constants/API";
import { useNavigate } from "react-router-dom";
import {
  CourseCategoryIdValidationRule,
  CourseDescriptionValidationRule,
  CourseDifficultyValidationRule,
  CoursePriceValidationRule,
  CourseRequirementsValidationRule,
  CourseSkillsCoveredValidationRule,
  CourseTitleValidationRule,
} from "@/utils/validationRules";

const addCourseSchema = z.object({
  title: CourseTitleValidationRule,
  price: CoursePriceValidationRule,
  difficulty: CourseDifficultyValidationRule,
  description: CourseDescriptionValidationRule,
  categoryId: CourseCategoryIdValidationRule,
  requirements: CourseRequirementsValidationRule,
  skillsCovered: CourseSkillsCoveredValidationRule,
});

export type addCourseSchemaType = z.infer<typeof addCourseSchema>;

const useAddCourse = () => {
  const {
    formState: { errors },
    setValue,
    register,
    watch,
    trigger,
    handleSubmit,
  } = useForm<addCourseSchemaType>({
    resolver: zodResolver(addCourseSchema),
  });
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setThumbnail(selectedFile);
      setPreviewThumbnail(URL.createObjectURL(selectedFile));
    }
  };

  const publishCourse = handleSubmit(async (data) => {
    if (!thumbnail || !previewThumbnail) {
      errorPopup("please upload thumbnail");
      return;
    }

    const {
      categoryId,
      description,
      difficulty,
      price,
      requirements,
      skillsCovered,
      title,
    } = data;

    const formData = new FormData();

    formData.append("image", thumbnail);
    formData.append("categoryId", categoryId);
    formData.append("description", description);
    formData.append("difficulty", difficulty);
    formData.append("price", JSON.stringify(price));
    formData.append("requirements", JSON.stringify(requirements));
    formData.append("skillsCovered", JSON.stringify(skillsCovered));
    formData.append("title", title);

    const res = await axiosPostRequest(TRAINER_COURSES_API, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!res) return;

    successPopup(res.message || "course added");
    navigate("/trainer/courses");
  });

  return {
    addCourseSchema,
    errors,
    register,
    setValue,
    trigger,
    watch,
    publishCourse,
    thumbnail,
    previewThumbnail,
    handleThumbnailChange,
  };
};

export default useAddCourse;
