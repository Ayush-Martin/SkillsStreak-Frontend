import { addQuiz } from "@/api/quiz.api";
import { getTopics } from "@/api/topic.api";
import { ITopic } from "@/types/topicType";
import { QuizSchemaType, QuizSchema } from "@/validation/quiz.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const useAddQuiz = () => {
  const [topics, setTopics] = useState<ITopic[]>([]);

  const navigate = useNavigate();

  const {
    formState: { errors },
    setValue,
    register,
    watch,
    trigger,
    handleSubmit,
  } = useForm<QuizSchemaType>({
    resolver: zodResolver(QuizSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics();
      if (!data) return;
      setTopics(data);
    };
    fetchTopics();
  }, []);

  const onSave = handleSubmit(async (data) => {
    await addQuiz(data.title, data.description, data.difficulty, data.topics);
    navigate("/admin/quizzes");
  });

  return { setValue, register, watch, trigger, errors, topics, onSave };
};

export default useAddQuiz;
