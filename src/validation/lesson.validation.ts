import { LessonValidationRule } from "@/utils/validationRule";
import { z } from "zod";

export const LessonSchema = z.object({
  title: LessonValidationRule.title,
  description: LessonValidationRule.description,
});

export type LessonSchemaType = z.infer<typeof LessonSchema>;
