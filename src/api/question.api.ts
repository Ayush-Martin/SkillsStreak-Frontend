import {
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";
import { IQuestion } from "@/types/quizType";
import { successPopup } from "@/utils/popup";
import { QuestionSchemaType } from "@/validation/quiz.validation";

export const getAdminQuestions = async (
  quizId: string
): Promise<IQuestion[] | null> => {
  const res = await axiosGetRequest(`/admin/quizzes/${quizId}/questions`);
  return res?.data;
};

export const addAdminQuestionApi = async (
  quizId: string,
  question: QuestionSchemaType
): Promise<IQuestion | null> => {
  const res = await axiosPostRequest(
    `/admin/quizzes/${quizId}/questions`,
    question
  );
  if (!res) return null;
  successPopup(res.message);
  return res.data;
};

export const editAdminQuestionApi = async (
  quizId: string,
  questionId: string,
  question: QuestionSchemaType
): Promise<IQuestion | null> => {
  const res = await axiosPutRequest(
    `/admin/quizzes/${quizId}/questions/${questionId}`,
    question
  );
  if (!res) return null;
  successPopup(res.message);
  return res.data;
};

export const deleteAdminQuestionApi = async (
  quizId: string,
  questionId: string
): Promise<void> => {
  const res = await axiosDeleteRequest(
    `/admin/quizzes/${quizId}/questions/${questionId}`
  );
  if (!res) return;
  successPopup(res.message);
};
