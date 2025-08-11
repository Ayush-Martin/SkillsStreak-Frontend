import { FC } from "react";
import { FaChalkboardTeacher, FaUsers, FaChartLine } from "react-icons/fa";

interface ITotalQuizzesTakenCardProps {
  totalQuizzes: number;
}

const TotalQuizzesTakenCard: FC<ITotalQuizzesTakenCardProps> = ({
  totalQuizzes,
}) => {
  return (
    <div className="flex items-center gap-5 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-800/10 border border-purple-500/20 shadow-md hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 min-h-[130px] w-full">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-500/20 border border-purple-400/30">
        <FaUsers className="text-purple-400 text-3xl" />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-base text-gray-300 font-medium">
          Total Quizzes Taken
        </h3>
        <p className="text-4xl font-bold text-white leading-tight">
          {totalQuizzes}
        </p>
      </div>
    </div>
  );
};

interface ISubmissionRankCardProps {
  rank: number;
}

const SubmissionRankCard: FC<ISubmissionRankCardProps> = ({ rank }) => {
  return (
    <div className="flex items-center gap-5 p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-800/10 border border-indigo-500/20 shadow-md hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 min-h-[130px] w-full">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-400/30">
        <FaChalkboardTeacher className="text-indigo-400 text-3xl" />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-base text-gray-300 font-medium">Your Rank</h3>
        <p className="text-4xl font-bold text-white leading-tight">#{rank}</p>
      </div>
    </div>
  );
};

interface IAverageScoreCardProps {
  averageScore: number;
}

const AverageScoreCard: FC<IAverageScoreCardProps> = ({ averageScore }) => {
  return (
    <div className="flex items-center gap-5 p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-800/10 border border-green-500/20 shadow-md hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 min-h-[130px] w-full">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500/20 border border-green-400/30">
        <FaChartLine className="text-green-400 text-3xl" />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-base text-gray-300 font-medium">Average Score</h3>
        <p className="text-4xl font-bold text-white leading-tight">
          {averageScore}%
        </p>
      </div>
    </div>
  );
};

export { TotalQuizzesTakenCard, SubmissionRankCard, AverageScoreCard };
