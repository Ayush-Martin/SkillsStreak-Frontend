import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components";
import { COURSE_DIFFICULTY } from "@/constants";
import { ITopic } from "@/types/topicType";
import { BarChart, Book, FileText, Tags, X } from "lucide-react";
import { FC, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import { IQuizSchema } from "@/validation/quiz.validation";

const labelClass = "text-sm font-medium text-zinc-300 flex items-center gap-2";

interface IQuizBasicDetailProps {
  topics: ITopic[];
  errors: FieldErrors<IQuizSchema>;
  register: UseFormRegister<IQuizSchema>;
  setValue: UseFormSetValue<IQuizSchema>;
  trigger: UseFormTrigger<IQuizSchema>;
  watch: UseFormWatch<IQuizSchema>;
  submit: () => void;
}

const QuizBasicDetail: FC<IQuizBasicDetailProps> = ({
  topics,
  errors,
  register,
  setValue,
  trigger,
  watch,
  submit,
}) => {
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedTopics = watch("topics") || [];

  const toggleTopic = (topicId: string) => {
    const updated = selectedTopics.includes(topicId)
      ? selectedTopics.filter((id: string) => id !== topicId)
      : [...selectedTopics, topicId];

    setValue("topics", updated, { shouldValidate: true });
    trigger("topics");
  };

  const filteredTopics = topics.filter((topic) =>
    topic.topicName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full p-6 md:p-10 text-white space-y-12">
      {/* Title and Difficulty */}
      <div className="flex flex-col md:flex-row gap-10">
        <div className="space-y-1.5 w-full md:w-2/4">
          <label htmlFor="title" className={labelClass}>
            <Book className="w-4 h-4" /> Quiz Title
          </label>
          <Input
            id="title"
            {...register("title")}
            className="bg-[#1c2130] border border-zinc-700 text-white"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5 w-full md:w-2/4">
          <label className={labelClass}>
            <BarChart className="w-4 h-4" /> Difficulty
          </label>
          <Select
            onValueChange={(value) => {
              setValue(
                "difficulty",
                value as "beginner" | "intermediate" | "advance",
                { shouldValidate: true }
              );
              trigger("difficulty");
            }}
            value={watch("difficulty")}
          >
            <SelectTrigger className="bg-[#1c2130] border border-zinc-700 text-white">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-[#131722] text-white border border-zinc-700">
              <SelectGroup>
                {COURSE_DIFFICULTY.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.difficulty && (
            <p className="text-sm text-red-500 mt-1">
              {errors.difficulty.message}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className={labelClass}>
          <FileText className="w-4 h-4" /> Quiz Description
        </label>
        <Textarea
          id="description"
          {...register("description")}
          rows={5}
          className="bg-[#1c2130] border border-zinc-700 text-white"
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Topics */}
      <div className="space-y-3">
        <label className={labelClass}>
          <Tags className="w-4 h-4" /> Topics
        </label>

        <Dialog open={isTopicModalOpen} onOpenChange={setIsTopicModalOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              {selectedTopics.length > 0
                ? "Edit Selected Topics"
                : "Select Topics"}
            </Button>
          </DialogTrigger>

          <DialogContent className="p-0 border-none bg-transparent max-w-xl">
            <div className="bg-[#0c0f1a] border border-white/10 rounded-xl shadow-lg w-full p-6 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                  <Tags className="w-5 h-5 text-yellow-500" />
                  Select Topics
                </h2>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:text-red-500"
                  onClick={() => setIsTopicModalOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <Input
                placeholder="Search topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#141926] border-white/10 text-sm text-white placeholder:text-zinc-400"
              />

              <ScrollArea className="max-h-60 pr-2">
                <div className="space-y-1 mt-2">
                  {filteredTopics.length === 0 ? (
                    <p className="text-sm text-zinc-400">No topics found.</p>
                  ) : (
                    filteredTopics.map((topic) => {
                      const isSelected = selectedTopics.includes(topic._id);
                      return (
                        <div
                          key={topic._id}
                          onClick={() => toggleTopic(topic._id)}
                          className={`flex justify-between items-center px-4 py-2 rounded-md cursor-pointer transition ${
                            isSelected
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "hover:bg-white/5 text-white border border-white/5"
                          }`}
                        >
                          <span>{topic.topicName}</span>
                          {isSelected && (
                            <span className="font-semibold">✓</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>

        {errors.topics && (
          <p className="text-sm text-red-500 mt-1">{errors.topics.message}</p>
        )}

        {selectedTopics.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedTopics.map((id) => {
              const topic = topics.find((t) => t._id === id);
              if (!topic) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 bg-zinc-800 px-3 py-1.5 rounded-md text-sm text-white border border-zinc-600"
                >
                  {topic.topicName}
                  <X
                    className="w-4 h-4 cursor-pointer hover:text-red-500"
                    onClick={() =>
                      setValue(
                        "topics",
                        selectedTopics.filter((tid: string) => tid !== id),
                        { shouldValidate: true }
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex justify-end">
        <Button variant="v2" onClick={submit}>
          Submit Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizBasicDetail;
