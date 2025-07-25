import { axiosGetRequest } from "@/config/axios";
import { ICourseData, ICourseDetails } from "@/types/courseType";

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
}: IGetUserCourseParams): Promise<Array<ICourseData> | null> => {
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
): Promise<ICourseDetails | null> => {
  const res = await axiosGetRequest(`/courses/${courseId}`);
  return res?.data;
};
