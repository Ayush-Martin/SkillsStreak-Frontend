import { axiosGetRequest } from "@/config/axios";
import {
  IAdminCourseDetail,
  ITop5Courses,
  IUserCourseData,
  IUserCourseDetails,
} from "@/types/courseType";

interface IGetUserCourseParams {
  page: number;
  search: string;
  category: string;
  difficulty: string;
  price: string;
  size: number;
  sort: string;
}

export const getUserCourses = async ({
  page,
  search,
  category,
  difficulty,
  price,
  size,
  sort,
}: IGetUserCourseParams): Promise<Array<IUserCourseData> | null> => {
  const params = new URLSearchParams({
    page: page.toString(),
    search,
    category,
    difficulty,
    price,
    size: size.toString(),
    sort,
  });

  const res = await axiosGetRequest(`/courses?${params.toString()}`);
  return res?.data?.courses;
};

export const getUserCourse = async (
  courseId: string
): Promise<IUserCourseDetails | null> => {
  const res = await axiosGetRequest(`/courses/${courseId}`);
  return res?.data;
};

export const getAdminCourse = async (
  courseId: string
): Promise<IAdminCourseDetail | null> => {
  const res = await axiosGetRequest(`/admin/courses/${courseId}`);
  return res?.data;
};

export const getAdminCoursesCount = async (): Promise<number | null> => {
  const res = await axiosGetRequest("/admin/courses/count");
  return res?.data;
};

export const getAdminTop5Courses = async (): Promise<ITop5Courses | null> => {
  const res = await axiosGetRequest("/admin/courses/top5");
  return res?.data;
};

export const getTrainerCoursesCount = async (): Promise<number | null> => {
  const res = await axiosGetRequest("/trainer/courses/count");
  return res?.data;
};

export const getTrainerTop5Courses = async (): Promise<ITop5Courses | null> => {
  const res = await axiosGetRequest("/trainer/courses/top5");
  return res?.data;
};

export const getOverallCourseProgress = async (): Promise<{
  enrolledCourses: number;
  coursesCompleted: number;
} | null> => {
  const res = await axiosGetRequest("/enrolledCourses/progress");
  return res?.data;
};

export const getTrainerCoursesList = async (): Promise<Array<{
  _id: string;
  title: string;
}> | null> => {
  const res = await axiosGetRequest("/trainer/courses/list");
  return res?.data;
};
