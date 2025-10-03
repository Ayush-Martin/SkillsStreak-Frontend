import {
  axiosDeleteRequest,
  axiosPatchRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";
import { ITrainerLesson } from "@/types/courseType";
import { compressVideo } from "@/utils/compression";
import { successPopup } from "@/utils/popup";
import { getVideoDuration } from "@/utils/video";
import { ILessonSchema } from "@/validation/lesson.validation";

export const addTrainerLesson = async (
  courseId: string,
  moduleId: string,
  data: ILessonSchema & { file: File }
): Promise<ITrainerLesson | undefined> => {
  const { description, title } = data;
  let { file } = data;
  const type = file.type.startsWith("video") ? "video" : "pdf";
  let duration: number;

  if (type === "video") {
    file = await compressVideo(file);
    duration = await getVideoDuration(file);
  } else {
    duration = 60;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("file", file);
  formData.append("type", type);
  formData.append("duration", Math.round(duration).toString());
  const res = await axiosPostRequest(
    `/trainer/courses/${courseId}/modules/${moduleId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  if (!res) return;
  successPopup(res.message);
  return res.data;
};

export const deleteTrainerLesson = async (
  courseId: string,
  moduleId: string,
  lessonId: string
) => {
  const res = await axiosDeleteRequest(
    `trainer/courses/${courseId}/modules/${moduleId}/${lessonId}`
  );
  if (!res) return;
  successPopup(res.message);
};

export const editTrainerLesson = async (
  courseId: string,
  moduleId: string,
  lessonId: string,
  data: ILessonSchema
): Promise<ITrainerLesson | undefined> => {
  const res = await axiosPutRequest(
    `/trainer/courses/${courseId}/modules/${moduleId}/${lessonId}`,
    data
  );

  if (!res) return;
  successPopup(res.message || "edited");
  return res.data;
};

export const editTrainerLessonFile = async (
  courseId: string,
  moduleId: string,
  lessonId: string,
  file: File
): Promise<ITrainerLesson | undefined> => {
  const formData = new FormData();
  const type = file.type.startsWith("video") ? "video" : "pdf";
  if (type === "video") file = await compressVideo(file);

  formData.append("file", file);
  const res = await axiosPatchRequest(
    `/trainer/courses/${courseId}/modules/${moduleId}/${lessonId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (!res) return;
  successPopup(res.message);
  return res.data;
};
