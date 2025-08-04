import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import { TRAINER_COURSES_API } from "@/constants";
import { errorPopup, successPopup } from "@/utils/popup";
import {
  CourseBasicDetailsSchema,
  ICourseBasicDetailsSchema,
} from "@/validation/course.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const useNewAddCourse = () => {
  const [categories, setCategories] = useState<
    {
      categoryName: string;
      _id: string;
    }[]
  >([]);

  const navigate = useNavigate();

  const {
    formState: { errors },
    setValue,
    register,
    watch,
    trigger,
    handleSubmit,
  } = useForm<ICourseBasicDetailsSchema>({
    resolver: zodResolver(CourseBasicDetailsSchema),
    mode: "onChange",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axiosGetRequest("/categories");
      if (!res) return;
      setCategories(res.data);
    };

    fetchCategories();
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(selectedFile.type)) {
        errorPopup(" JPG and , PNG files are allowed");
        return;
      }
      setThumbnail(selectedFile);
      setPreviewThumbnail(URL.createObjectURL(selectedFile));
    }
  };

  const onSave = handleSubmit(async (data) => {
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
    categories,
    onSave,
    errors,
    register,
    watch,
    trigger,
    setValue,
    previewThumbnail,
    handleThumbnailChange,
  };
};

export default useNewAddCourse;
