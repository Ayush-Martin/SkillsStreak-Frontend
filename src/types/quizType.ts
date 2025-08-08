export interface IQuiz {
  _id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advance";
  topic: string[];
}

export interface IQuestion {
  _id: string;
  question: string;
  answer: string;
  options: {
    choice: string;
    id: string;
  }[];
}
