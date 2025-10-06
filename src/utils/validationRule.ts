import { z } from "zod";

const getMinLengthMessage = (field: string, val: number) => {
  return `${field} must be at least ${val} characters long`;
};

const getMaxLengthMessage = (field: string, val: number) => {
  return `${field} must be ${val} characters or less`;
};

const getValidUrlMessage = (field: string) => {
  return `${field} must be a valid URL`;
};

const getAtLeastMessage = (field: string, val: number, type: string) => {
  return `${field} must contain at least ${val} ${type}`;
};

const getMinValueMessage = (field: string, val: number) => {
  return `${field} must be at least ${val}`;
};

const getMaxValueMessage = (field: string, val: number) => {
  return `${field} must be ${val} or less`;
};

export const UserValidationRule = {
  Email: z.string().email("Invalid email"),
  Password: z
    .string()
    .min(8, getMinLengthMessage("Password", 8))
    .max(100, getMaxLengthMessage("Password", 100))
    .regex(/[a-z]/, {
      message: getAtLeastMessage("Password", 1, "lowercase letter"),
    })
    .regex(/[A-Z]/, getAtLeastMessage("Password", 1, "uppercase letter"))
    .regex(/\d/, getAtLeastMessage("Password", 1, "number"))
    .regex(/[\W_]/, getAtLeastMessage("Password", 1, "special character")),
  Username: z
    .string()
    .min(3, getMinLengthMessage("Username", 3))
    .max(20, getMaxLengthMessage("Username", 20))
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  Bio: z.string().max(2000, getMaxLengthMessage("Bio", 2000)),
  Location: z
    .string()
    .min(2, getMinLengthMessage("Location", 2))
    .max(100, getMaxLengthMessage("Location", 100)),
  Position: z
    .string()
    .min(2, getMinLengthMessage("Position", 2))
    .max(100, getMaxLengthMessage("Position", 100)),
  Company: z
    .string()
    .min(2, getMinLengthMessage("Company", 2))
    .max(100, getMaxLengthMessage("Company", 100)),
  Education: z
    .string()
    .min(2, getMinLengthMessage("Education", 2))
    .max(200, getMaxLengthMessage("Education", 200)),
  Skills: z.array(
    z
      .string()
      .min(2, getMinLengthMessage("Skill", 2))
      .max(100, getMaxLengthMessage("Skill", 100))
  ),
  Experiences: z.array(
    z.object({
      id: z.string(),
      company: z
        .string()
        .min(2, getMinLengthMessage("Company", 2))
        .max(100, getMaxLengthMessage("Company", 100)),
      position: z
        .string()
        .min(2, getMinLengthMessage("Position", 2))
        .max(100, getMaxLengthMessage("Position", 100)),
      duration: z
        .string()
        .min(2, getMinLengthMessage("Duration", 2))
        .max(100, getMaxLengthMessage("Duration", 100)),
      description: z.string().max(1000).optional(),
    })
  ),
  SocialLinks: z.object({
    github: z
      .string()
      .url({ message: getValidUrlMessage("GitHub") })
      .optional(),
    linkedin: z
      .string()
      .url({ message: getValidUrlMessage("LinkedIn") })
      .optional(),
    website: z
      .string()
      .url({ message: getValidUrlMessage("website") })
      .optional(),
    instagram: z
      .string()
      .url({ message: getValidUrlMessage("Instagram") })
      .optional(),
    facebook: z
      .string()
      .url({ message: getValidUrlMessage("Facebook") })
      .optional(),
    youtube: z
      .string()
      .url({ message: getValidUrlMessage("YouTube") })
      .optional(),
  }),
} as const;

export const QuestionValidationRule = {
  question: z
    .string()
    .min(10, getMinLengthMessage("question", 10))
    .max(500, getMaxLengthMessage("question", 500)),
  options: z
    .array(
      z.object({
        choice: z
          .string()
          .min(1, getMinLengthMessage("choice", 1))
          .max(300, getMaxLengthMessage("choice", 300)),
        id: z.string(),
      })
    )
    .min(2, getMinLengthMessage("options", 2)),
  answer: z
    .string()
    .min(2, getMinLengthMessage("answer", 2))
    .max(100, getMaxLengthMessage("answer", 100)),
} as const;

export const QuizValidationRule = {
  title: z.string().min(2, getMinLengthMessage("title", 2)),
  description: z.string().min(10, getMinLengthMessage("description", 10)),
  difficulty: z.enum(["beginner", "intermediate", "advance"]),
  topics: z.array(z.string()).min(1, getMinValueMessage("topics", 1)),
} as const;

export const CategoryValidationRule = {
  categoryName: z
    .string()
    .min(2, getMinLengthMessage("categoryName", 2))
    .max(100, getMaxLengthMessage("categoryName", 100)),
};

export const TopicValidationRule = {
  topicName: z
    .string()
    .min(2, getMinLengthMessage("topicName", 2))
    .max(20, getMaxLengthMessage("topicName", 20)),
} as const;

export const SubscriptionPlanValidationRule = {
  title: z
    .string()
    .min(5, getMinLengthMessage("title", 5))
    .max(100, getMaxLengthMessage("title", 100)),
  description: z
    .string()
    .min(10, getMinLengthMessage("description", 10))
    .max(2000, getMaxLengthMessage("description", 2000)),
  price: z.number().min(0, getMinValueMessage("price", 0)),
  duration: z.number().min(1, getMinValueMessage("duration", 1)),
  features: z.array(z.string()).min(1),
} as const;

export const CourseValidationRule = {
  title: z
    .string()
    .min(5, getMinLengthMessage("title", 5))
    .max(100, getMaxLengthMessage("title", 100)),
  description: z
    .string()
    .min(10, getMinLengthMessage("description", 10))
    .max(2000, getMaxLengthMessage("description", 2000)),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, getMinValueMessage("price", 0))
  ),
  skillsCovered: z.array(z.string(), {
    message: "skills covered should be array of strings",
  }),
  requirements: z.array(z.string(), {
    message: "requirements should be array of strings",
  }),
  difficulty: z.enum(["beginner", "intermediate", "advance"]),
  categoryId: z.string(),
  status: z.enum(["approved", "rejected"]),
} as const;

export const LiveSessionValidationRule = {
  title: z
    .string()
    .min(5, getMinLengthMessage("title", 5))
    .max(100, getMaxLengthMessage("title", 100)),
  description: z
    .string()
    .min(10, getMinLengthMessage("description", 10))
    .max(2000, getMaxLengthMessage("description", 2000)),
  date: z.string(),
  time: z.string(),
} as const;

export const LessonValidationRule = {
  title: z
    .string()
    .min(5, getMinLengthMessage("title", 5))
    .max(100, getMaxLengthMessage("title", 100)),
  description: z
    .string()
    .min(10, getMinLengthMessage("description", 10))
    .max(2000, getMaxLengthMessage("description", 2000)),
  type: z.enum(["video", "pdf"]),
  duration: z.coerce.number(),
} as const;

export const AssignmentValidationRule = {
  Title: z
    .string()
    .min(2, getMinLengthMessage("Title", 2))
    .max(100, getMaxLengthMessage("Title", 100)),
  Description: z
    .string()
    .min(2, getMinLengthMessage("Description", 2))
    .max(1000, getMaxLengthMessage("Description", 1000)),
  Task: z
    .string()
    .min(10, getMinLengthMessage("Task", 10))
    .max(10000, getMaxLengthMessage("Task", 10000)),
} as const;

export const AssignmentSubmissionValidationRule = {
  type: z.enum(["text", "image", "pdf"]),
  content: z
    .string()
    .min(10, getMinLengthMessage("Content", 10))
    .max(10000, getMaxLengthMessage("Content", 10000)),
  status: z.enum(["verified", "redo"]),
} as const;
