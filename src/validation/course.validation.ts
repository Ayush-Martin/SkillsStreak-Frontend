import {
  CourseTitleValidationRule,
  CoursePriceValidationRule,
  CourseDifficultyValidationRule,
  CourseDescriptionValidationRule,
  CourseCategoryIdValidationRule,
  CourseRequirementsValidationRule,
  CourseSkillsCoveredValidationRule,
} from "@/utils/validationRules";
import z from "zod";

export const CourseBasicDetailsSchema = z.object({
  title: CourseTitleValidationRule,
  price: CoursePriceValidationRule,
  difficulty: CourseDifficultyValidationRule,
  description: CourseDescriptionValidationRule,
  categoryId: CourseCategoryIdValidationRule,
  requirements: CourseRequirementsValidationRule,
  skillsCovered: CourseSkillsCoveredValidationRule,
});

export type ICourseBasicDetailsSchema = z.infer<
  typeof CourseBasicDetailsSchema
>;

export const CourseLiveSessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

export type ICourseLiveSessionSchema = z.infer<typeof CourseLiveSessionSchema>;
