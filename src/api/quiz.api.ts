import {
  axiosGetRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";

import { successPopup } from "@/utils/popup";
import { IQuizSchema } from "@/validation/quiz.validation";

export const addQuiz = async (
  title: string,
  description: string,
  difficulty: "beginner" | "intermediate" | "advance",
  topics: string[]
): Promise<void> => {
  const res = await axiosPostRequest("/admin/quizzes", {
    title,
    description,
    difficulty,
    topics,
  });
  if (!res) return;
  successPopup(res.message);
};

export const editQuiz = async (
  quizId: string,
  title: string,
  description: string,
  difficulty: "beginner" | "intermediate" | "advance",
  topics: string[]
): Promise<void> => {
  const res = await axiosPutRequest(`/admin/quizzes/${quizId}`, {
    title,
    description,
    difficulty,
    topics,
  });
  if (!res) return;
  successPopup(res.message);
};

export const getQuizBasicDetails = async (
  quizId: string
): Promise<IQuizSchema | null> => {
  const res = await axiosGetRequest(`/admin/quizzes/${quizId}`);
  return res?.data;
};
