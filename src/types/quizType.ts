export type IQuizDifficulty = "beginner" | "intermediate" | "advance";

export interface IQuiz {
  _id: string;
  title: string;
  description: string;
  difficulty: IQuizDifficulty;
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

export interface IUserQuiz {
  _id: string;
  title: string;
  description: string;
  difficulty: IQuizDifficulty;
  topics: string[];
  totalSubmissions: number;
  userSubmitted: boolean;
}

export interface IViewQuiz {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  topics: { _id: string; topicName: string }[];
  questions: IQuestion[];
}

export interface IPreviousQuizSubmission {
  _id: string;
  score: number;
  timeTaken: number;
  answers: Array<{ questionId: string; answer: string }>;
}

export interface IQuizSubmissionProgress {
  quizzesTaken: number;
  totalQuestions: number;
  totalScore: number;
}

export interface IQuizSubmission {
  _id: string;
  score: number;
  timeTaken: number;
  user: {
    _id: string;
    email: string;
  };
  quiz: {
    _id: string;
    title: string;
    difficulty: IQuizDifficulty;
    questions: Array<{
      _id: string;
      question: string;
      options: Array<{
        _id: string;
        id: string;
        choice: string;
      }>;
      answer: string;
    }>;
  };
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
}
