import { axiosGetRequest, axiosPatchRequest } from "@/config/axios";
import { ITrainerModule } from "@/types/courseType";
import { successPopup } from "@/utils/popup";

export const getTrainerModule = async (
  courseId: string,
  moduleId: string
): Promise<ITrainerModule | null> => {
  const res = await axiosGetRequest(
    `/trainer/courses/${courseId}/modules/${moduleId}`
  );
  return res?.data;
};

export const updateTrainerModuleTitle = async (
  courseId: string,
  moduleId: string,
  title: string
): Promise<ITrainerModule | undefined> => {
  const res = await axiosPatchRequest(
    `/trainer/courses/${courseId}/modules/${moduleId}`,
    {
      title,
    }
  );
  if (!res) return;
  successPopup(res.message);
  return res.data;
};
