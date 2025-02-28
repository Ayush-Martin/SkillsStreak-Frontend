import { axiosGetRequest } from "@/config/axios";
import { COURSES_API } from "@/constants/API";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export interface ICourse {
  _id: string;
  title: string;
  price: number;
  skillsCovered: Array<string>;
  requirements: Array<string>;
  difficulty: "beginner" | "intermediate" | "advance";
  thumbnail: string;
  description: string;
  categoryId: string;
}

const useEditCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<ICourse | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}`);
      console.log("res", res);
      if (!res) return;
      setCourse(res.data);
    };
    console.log("dfdfd");
    fetchCourse();
  }, []);

  console.log(course);

  return { course,setCourse };
};

export default useEditCourse;
