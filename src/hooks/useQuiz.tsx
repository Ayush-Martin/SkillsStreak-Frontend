import { getUserQuiz } from "@/api/quiz.api";
import {
  getQuizSubmission,
  resubmitQuizSubmission,
  submitQuizSubmission,
} from "@/api/quizSubmission.api";
import { IPreviousQuizSubmission, IViewQuiz } from "@/types/quizType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<IViewQuiz | null>(null);
  const [previousSubmissions, setPreviousSubmissions] =
    useState<IPreviousQuizSubmission | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const quiz = await getUserQuiz(quizId!);
      if (!quiz) return;
      setQuiz(quiz);
    };

    const fetchPreviousSubmissions = async () => {
      const previousSubmissions = await getQuizSubmission(quizId!);
      if (!previousSubmissions) return;
      setPreviousSubmissions(previousSubmissions);
    };

    fetchQuiz();
    fetchPreviousSubmissions();
  }, []);

  const submitQuiz = async (
    answers: { questionId: string; answer: string }[],
    timeTaken: number
  ) => {
    const quizSubmission = await submitQuizSubmission(
      quizId!,
      answers,
      timeTaken
    );
    if (!quizSubmission) return;
    setPreviousSubmissions(quizSubmission);
  };

  const resubmitQuiz = async (
    quizSubmissionId: string,
    answers: { questionId: string; answer: string }[],
    timeTaken: number
  ) => {
    const quizSubmission = await resubmitQuizSubmission(
      quizSubmissionId,
      quizId!,
      answers,
      timeTaken
    );
    if (!quizSubmission) return;
    setPreviousSubmissions(quizSubmission);
  };

  return { quiz, previousSubmissions, submitQuiz, resubmitQuiz };
};

export default useQuiz;
