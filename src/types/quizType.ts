export interface IQuiz {
  _id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advance";
  topic: string[];
}
