import { axiosPostRequest } from "@/config/axios";

import { successPopup } from "@/utils/popup";

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
