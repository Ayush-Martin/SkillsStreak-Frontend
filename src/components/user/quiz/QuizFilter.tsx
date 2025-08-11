import { ITopic } from "@/types/topicType";
import { Filter, Check, ChevronUp, ChevronDown, Layers, X } from "lucide-react";
import { FC, useState } from "react";

type DifficultyType = "all" | "beginner" | "intermediate" | "advance";

interface QuizFilterProps {
  allTopics: ITopic[];
  defaultTopics: string[] | "all";
  defaultDifficulty: DifficultyType;
  visibleCount?: number;
  onTopicsChange: (topics: string[] | "all") => void;
  onDifficultyChange: (difficulty: DifficultyType) => void;
}

const QuizFilter: FC<QuizFilterProps> = ({
  allTopics,
  defaultTopics,
  defaultDifficulty,
  onTopicsChange,
  onDifficultyChange,
  visibleCount = 8,
}) => {
  const [expanded, setExpanded] = useState(false);

  const isAllTopics = defaultTopics === "all";
  const selectedTopicIds = isAllTopics ? [] : (defaultTopics as string[]);

  const toggleTopic = (id: string) => {
    if (isAllTopics) {
      onTopicsChange([id]);
    } else {
      const updated = selectedTopicIds.includes(id)
        ? selectedTopicIds.filter((t) => t !== id)
        : [...selectedTopicIds, id];
      onTopicsChange(updated.length === 0 ? "all" : updated);
    }
  };

  const selectAllTopics = () => onTopicsChange("all");

  const selectDifficulty = (diff: DifficultyType) => {
    onDifficultyChange(diff);
  };

  const clearFilters = () => {
    onTopicsChange("all");
    onDifficultyChange("all");
  };

  const visibleTopics = expanded ? allTopics : allTopics.slice(0, visibleCount);
  const difficulties: DifficultyType[] = [
    "all",
    "beginner",
    "intermediate",
    "advance",
  ];

  return (
    <div className="w-full bg-[#0a0d17] py-5 px-4">
      <div className="w-full max-w-7xl mx-auto bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl p-6 space-y-6 shadow-lg">
        {/* Topics */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-300 uppercase tracking-wide">
            <Filter size={16} className="text-blue-400" />
            Topics
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={selectAllTopics}
              className={`px-3 py-1.5 rounded-full border text-sm flex items-center gap-1 transition-all ${
                isAllTopics
                  ? "bg-blue-600 border-blue-500 text-white shadow-sm"
                  : "bg-transparent border-gray-700 text-gray-300 hover:border-blue-400 hover:text-white"
              }`}
            >
              {isAllTopics && <Check size={14} />}
              All
            </button>

            {visibleTopics.map((topic) => (
              <button
                key={topic._id}
                onClick={() => toggleTopic(topic._id)}
                className={`px-3 py-1.5 rounded-full border text-sm flex items-center gap-1 transition-all ${
                  selectedTopicIds.includes(topic._id)
                    ? "bg-blue-600 border-blue-500 text-white shadow-sm"
                    : "bg-transparent border-gray-700 text-gray-300 hover:border-blue-400 hover:text-white"
                }`}
              >
                {selectedTopicIds.includes(topic._id) && <Check size={14} />}
                {topic.topicName}
              </button>
            ))}

            {allTopics.length > visibleCount && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="px-3 py-1.5 rounded-full border border-gray-700 text-gray-300 text-sm hover:border-blue-400 hover:text-white flex items-center gap-1"
              >
                {expanded ? (
                  <>
                    Less <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    More <ChevronDown size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-300 uppercase tracking-wide">
            <Layers size={16} className="text-purple-400" />
            Difficulty
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => selectDifficulty(diff)}
                className={`capitalize px-3 py-1.5 rounded-full border text-sm flex items-center gap-1 transition-all ${
                  defaultDifficulty === diff
                    ? "bg-purple-600 border-purple-500 text-white shadow-sm"
                    : "bg-transparent border-gray-700 text-gray-300 hover:border-purple-400 hover:text-white"
                }`}
              >
                {defaultDifficulty === diff && <Check size={14} />}
                {diff}
              </button>
            ))}

            {/* Clear */}
            <button
              onClick={clearFilters}
              className="ml-auto px-3 py-1.5 rounded-full border border-red-500 text-red-400 text-sm flex items-center gap-1 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <X size={14} />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizFilter;
