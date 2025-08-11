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

export const QuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z
    .array(
      z.object({
        id: z.string(),
        choice: z.string().min(1, "Option cannot be empty"),
      })
    )
    .min(2, "At least two options are required"),
  answer: z.string().min(1, "Please select a correct answer"),
});

export type IQuizSchema = z.infer<typeof QuizSchema>;

export type IQuestionSchema = z.infer<typeof QuestionSchema>;
