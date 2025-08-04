import { Star, Award, Target, BookOpen } from "lucide-react";
import { FC } from "react";

interface IAdminCourseDifficultyBadge {
  difficulty: "beginner" | "intermediate" | "advanced";
}

const AdminCourseDifficultyBadge: FC<IAdminCourseDifficultyBadge> = ({
  difficulty,
}) => {
  const getDifficultyConfig = () => {
    switch (difficulty) {
      case "beginner":
        return {
          color: "bg-emerald-900/30 text-emerald-400 border-emerald-700",
          icon: <Star className="w-4 h-4" />,
          text: "Beginner",
        };
      case "intermediate":
        return {
          color: "bg-orange-900/30 text-orange-400 border-orange-700",
          icon: <Award className="w-4 h-4" />,
          text: "Intermediate",
        };
      case "advanced":
        return {
          color: "bg-red-900/30 text-red-400 border-red-700",
          icon: <Target className="w-4 h-4" />,
          text: "Advanced",
        };
      default:
        return {
          color: "bg-white/5  text-gray-300 border-white/10",
          icon: <BookOpen className="w-4 h-4" />,
          text: difficulty,
        };
    }
  };
  
  const config = getDifficultyConfig();

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium border ${config.color}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
};

export default AdminCourseDifficultyBadge;
