import { z } from "zod";

export const EmailValidationRule = z.string().email("Invalid email");

export const PasswordValidationRule = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(100, { message: "Password must be 100 characters or less" })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/\d/, { message: "Password must contain at least one number" })
  .regex(/[\W_]/, {
    message: "Password must contain at least one special character",
  });

export const UsernameValidationRule = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(20, { message: "Username must be 20 characters or less" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  });

export const AboutValidationRule = z
  .string()
  .max(20, { message: "About must be 20 characters or less" });

export const AreaOfInterestValidationRule = z.array(z.string());

export const CategoryNameValidationRule = z
  .string()
  .min(3, "category name must have at least 3 characters")
  .max(20, "category name must be within 20 characters");

export const CourseTitleValidationRule = z
  .string()
  .min(3, "course title must have minimum 3 characters")
  .max(20, "course title must be below 20 characters");

export const CoursePriceValidationRule = z.preprocess(
  (val) => Number(val),
  z.number().min(0, "price should be 0 or more")
);

export const CourseSkillsCoveredValidationRule = z.array(z.string(), {
  message: "skills covered should be array of strings",
});

export const CourseRequirementsValidationRule = z.array(z.string(), {
  message: "requirements should be array of strings",
});

export const CourseDifficultyValidationRule = z.enum(
  ["beginner", "intermediate", "advance"],
  { message: "invalid difficulty" }
);

export const CourseDescriptionValidationRule = z
  .string()
  .min(10, "description must have 10 or more character")
  .max(100, "description must be within 100 characters");

export const CourseCategoryIdValidationRule = z.string();
