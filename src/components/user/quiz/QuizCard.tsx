import { IUserQuiz } from "@/types/quizType";
import { ITopic } from "@/types/topicType";
import { CheckCircle, Layers, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface QuizCardProps {
  quiz: IUserQuiz & { totalSubmissions: number };
  topics: ITopic[];
}

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-600 text-white",
  Medium: "bg-yellow-500 text-white",
  Hard: "bg-red-600 text-white",
};

const QuizCard = ({ quiz, topics }: QuizCardProps) => {
  return (
    <Link
      to={`/user/quizzes/${quiz._id}`}
      className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-5 p-4 md:p-5 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-500 transition w-full max-w-3xl mx-auto cursor-pointer"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-lg bg-blue-600 text-white">
        <Layers size={24} className="md:size-7" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Title & completed badge */}
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base md:text-lg font-semibold text-white truncate">
            {quiz.title}
          </h2>
          {quiz.userSubmitted && (
            <span className="flex items-center gap-1 text-green-400 text-xs md:text-sm">
              <CheckCircle size={14} className="md:size-4" />
              Completed
            </span>
          )}
        </div>

        {/* Difficulty & total submissions */}
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full text-xs md:text-sm font-medium ${
              difficultyColors[quiz.difficulty] || "bg-gray-600 text-white"
            }`}
          >
            {quiz.difficulty}
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-xs md:text-sm">
            <Users size={14} /> {quiz.totalSubmissions} submissions
          </span>
        </div>

        {/* Topics */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {quiz.topics.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 md:px-3 md:py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded-full text-xs md:text-sm"
            >
              {topics.find((topic) => topic._id === t)?.topicName}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default QuizCard;
