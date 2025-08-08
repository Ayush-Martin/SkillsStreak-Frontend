import {
  addAdminQuestionApi,
  deleteAdminQuestionApi,
  editAdminQuestionApi,
  getAdminQuestions,
} from "@/api/question.api";
import { editQuiz, getQuizBasicDetails } from "@/api/quiz.api";
import { getTopics } from "@/api/topic.api";
import { IQuestion } from "@/types/quizType";
import { ITopic } from "@/types/topicType";
import {
  IQuestionSchema,
  IQuizSchema,
  QuizSchema,
} from "@/validation/quiz.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const useEditQuiz = () => {
  const { quizId } = useParams();

  const [topics, setTopics] = useState<ITopic[]>([]);
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const {
    formState: { errors },
    setValue,
    register,
    watch,
    trigger,
    handleSubmit,
    reset,
  } = useForm<IQuizSchema>({
    resolver: zodResolver(QuizSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics();
      if (!data) return;
      setTopics(data);
    };

    const fetchQuizBasicDetails = async () => {
      const data = await getQuizBasicDetails(quizId!);
      if (!data) return;
      reset(data);
    };

    fetchTopics();
    fetchQuizBasicDetails();
  }, []);

  const fetchQuestions = async () => {
    const questions = await getAdminQuestions(quizId!);
    if (!questions) return;
    setQuestions(questions);
  };

  const addQuestion = async (question: IQuestionSchema) => {
    const addedQuestion = await addAdminQuestionApi(quizId!, question);
    if (!addedQuestion) return;
    setQuestions([...questions, addedQuestion]);
  };

  const editQuestion = async (
    questionId: string,
    question: IQuestionSchema
  ) => {
    const editedQuestion = await editAdminQuestionApi(
      quizId!,
      questionId,
      question
    );
    if (!editedQuestion) return;
    setQuestions(
      questions.map((q) => (q._id === questionId ? editedQuestion : q))
    );
  };

  const deleteQuestion = async (questionId: string) => {
    await deleteAdminQuestionApi(quizId!, questionId);
    setQuestions(questions.filter((q) => q._id !== questionId));
  };

  const editQuizBasicDetails = handleSubmit(async (data) => {
    await editQuiz(
      quizId!,
      data.title,
      data.description,
      data.difficulty,
      data.topics
    );
  });

  return {
    topics,
    errors,
    setValue,
    register,
    watch,
    trigger,
    editQuizBasicDetails,
    questions,
    addQuestion,
    editQuestion,
    deleteQuestion,
    fetchQuestions,
  };
};

export default useEditQuiz;
