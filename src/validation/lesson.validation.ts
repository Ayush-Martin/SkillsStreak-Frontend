import {
  LessonTitleValidationRule,
  LessonDescriptionValidationRule,
} from "@/utils/validationRules";
import { z } from "zod";

export const LessonSchema = z.object({
  title: LessonTitleValidationRule,
  description: LessonDescriptionValidationRule,
});

export type ILessonSchema = z.infer<typeof LessonSchema>;
