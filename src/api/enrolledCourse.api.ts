import { axiosGetRequest } from "@/config/axios";

export const getEnrolledCourseCompletionStatus = async (
  courseId: string
): Promise<{
  totalLessons: number;
  completedLessons: number;
  totalAssignments: number;
  completedAssignments: number;
} | null> => {
  const res = await axiosGetRequest(`/enrolledCourses/${courseId}`);
  return res?.data;
};

export const getEnrolledCourseCertificateDetails = async (
  courseId: string
): Promise<{ courseName: string; trainerName: string } | undefined> => {
  const res = await axiosGetRequest(`/enrolledCourses/${courseId}/certificate`);
  if (!res) return;
  return {
    courseName: res.data.title,
    trainerName: res.data.trainerId.username,
  };
};
