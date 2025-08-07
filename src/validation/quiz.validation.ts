import {
  QuizTitleValidationRule,
  QuizTopicDescriptionValidationRule,
  QuizDifficultyValidationRule,
  QuizTopicsValidationRule,
} from "@/utils/validationRules";
import z from "zod";

export const QuizSchema = z.object({
  title: QuizTitleValidationRule,
  description: QuizTopicDescriptionValidationRule,
  difficulty: QuizDifficultyValidationRule,
  topics: QuizTopicsValidationRule,
});

export type IQuizSchema = z.infer<typeof QuizSchema>;
