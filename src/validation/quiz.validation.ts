import {
  QuestionValidationRule,
  QuizValidationRule,
} from "@/utils/validationRule";
import z from "zod";

export const QuizSchema = z.object({
  title: QuizValidationRule.title,
  description: QuizValidationRule.description,
  difficulty: QuizValidationRule.difficulty,
  topics: QuizValidationRule.topics,
});

export type QuizSchemaType = z.infer<typeof QuizSchema>;

export const QuestionSchema = z.object({
  question: QuestionValidationRule.question,
  options: QuestionValidationRule.options,
  answer: QuestionValidationRule.answer,
});

export type QuestionSchemaType = z.infer<typeof QuestionSchema>;
