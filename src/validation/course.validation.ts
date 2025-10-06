import {
  AssignmentSubmissionValidationRule,
  AssignmentValidationRule,
  CourseValidationRule,
  LiveSessionValidationRule,
} from "@/utils/validationRule";
import z from "zod";

export const CourseBasicDetailsSchema = z.object({
  title: CourseValidationRule.title,
  price: CourseValidationRule.price,
  difficulty: CourseValidationRule.difficulty,
  description: CourseValidationRule.description,
  categoryId: CourseValidationRule.categoryId,
  requirements: CourseValidationRule.requirements,
  skillsCovered: CourseValidationRule.skillsCovered,
});

export type CourseBasicDetailsSchemaType = z.infer<
  typeof CourseBasicDetailsSchema
>;

export const CourseLiveSessionSchema = z.object({
  title: LiveSessionValidationRule.title,
  description: LiveSessionValidationRule.description,
  date: LiveSessionValidationRule.date,
  time: LiveSessionValidationRule.time,
});

export type CourseLiveSessionSchemaType = z.infer<
  typeof CourseLiveSessionSchema
>;

export const AssignmentSchema = z.object({
  title: AssignmentValidationRule.Title,
  description: AssignmentValidationRule.Description,
  task: AssignmentValidationRule.Task,
});

export type AssignmentSchemaType = z.infer<typeof AssignmentSchema>;

export const AssignmentSubmissionSchema = z.object({
  type: AssignmentSubmissionValidationRule.type,
  content: AssignmentSubmissionValidationRule.content.optional(),
});

export type AssignmentSubmissionSchemaType = z.infer<
  typeof AssignmentSubmissionSchema
>;
