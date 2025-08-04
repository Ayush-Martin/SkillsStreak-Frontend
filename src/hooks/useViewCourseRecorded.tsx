import { axiosGetRequest, axiosPatchRequest } from "@/config/axios";
import { COURSES_API } from "@/constants";
import { ICourseRecordedSession } from "@/types/courseType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useViewCourseRecorded = () => {
  const [courseAccess, setCourseAccess] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [currentSelectedLesson, setCurrentSelectedLesson] = useState<{
    title: string;
    _id: string;
    description: string;
    type: "video" | "pdf";
    path: string;
  } | null>(null);
  const [recordedSessions, setRecordedSessions] =
    useState<ICourseRecordedSession>({
      title: "",
      trainerId: "",
      modules: [],
    });

  const { courseId } = useParams();

  useEffect(() => {
    const fetchRecordedSessions = async () => {
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}`);
      if (!res) return;
      setRecordedSessions(res.data);
    };

    const fetchCompletedLessons = async () => {
      const res = await axiosGetRequest(
        `/enrolledCourses/${courseId}/recorded`
      );
      if (!res) return;
      setCompletedLessons(res.data.completedLessons);
    };
    const fetchAccess = async () => {
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}/access`);
      setCourseAccess(false);
      if (!res) return;
      setCourseAccess(true);
      fetchCompletedLessons();
    };

    fetchAccess();
    fetchRecordedSessions();
  }, []);

  const viewLesson = async (lessonId: string) => {
    const res = await axiosGetRequest(
      `/enrolledCourses/${courseId}/lessons/${lessonId}`
    );
    if (!res) return;
    setCurrentSelectedLesson(res.data);
  };

  const completeUnCompleteLesson = async (lessonId: string) => {
    const res = await axiosPatchRequest(
      `/enrolledCourses/${courseId}/lessons/${lessonId}`
    );
    if (!res) return;
    const updatedCompletedLessons = completedLessons.includes(lessonId)
      ? completedLessons.filter((id) => id !== lessonId)
      : [...completedLessons, lessonId];
    setCompletedLessons(updatedCompletedLessons);
  };

  return {
    courseAccess,
    recordedSessions,
    currentSelectedLesson,
    setCurrentSelectedLesson,
    viewLesson,
    completedLessons,
    courseId,
    completeUnCompleteLesson,
  };
};

export default useViewCourseRecorded;
