import { axiosGetRequest } from "@/config/axios";
import { TRAINER_COURSES_API } from "@/constants/API";
import { ICourse } from "@/types/courseType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useEditCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<ICourse | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await axiosGetRequest(`${TRAINER_COURSES_API}/${courseId}`);
      if (!res) return;
      setCourse(res.data);
    };

    fetchCourse();
  }, []);

  return { course, setCourse };
};

export default useEditCourse;
