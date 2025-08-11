import {
  axiosGetRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";
import { IPreviousQuizSubmission } from "@/types/quizType";
import { successPopup } from "@/utils/popup";

export const getQuizSubmission = async (
  quizId: string
): Promise<IPreviousQuizSubmission | null> => {
  const res = await axiosGetRequest(`/quizzes/${quizId}/submissions`);
  return res?.data;
};

export const submitQuizSubmission = async (
  quizId: string,
  answers: { questionId: string; answer: string }[],
  timeTaken: number
): Promise<IPreviousQuizSubmission | null> => {
  const res = await axiosPostRequest(`/quizzes/${quizId}/submissions`, {
    answers,
    timeTaken,
  });
  if (!res) return null;
  successPopup(res.message);
  return res.data;
};

export const resubmitQuizSubmission = async (
  quizSubmissionId: string,
  quizId: string,
  answers: { questionId: string; answer: string }[],
  timeTaken: number
): Promise<IPreviousQuizSubmission | null> => {
  const res = await axiosPutRequest(
    `/quizzes/${quizId}/submissions/${quizSubmissionId}`,
    {
      answers,
      timeTaken,
    }
  );
  if (!res) return null;
  successPopup(res.message);
  return res.data;
};
