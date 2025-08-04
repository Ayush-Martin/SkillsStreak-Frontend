import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ScrollArea,
  Separator,
} from "@/components";
import { ICourseRecordedSession } from "@/types/courseType";
import { PlayCircle, FileText, CheckCircle2 } from "lucide-react";
import { FC } from "react";

interface ICourseContentsAccordionProps {
  recordedSessions: ICourseRecordedSession;
  completedLessons: string[];
  viewLesson: (lessonId: string) => void;
  selectedLessonId?: string;
}

const CourseContentsAccordion: FC<ICourseContentsAccordionProps> = ({
  recordedSessions,
  completedLessons,
  viewLesson,
  selectedLessonId,
}) => {
  const totalLessons = recordedSessions.modules.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0
  );

  console.log(completedLessons, "completedLessons");

  const completionPercentage = (completedLessons.length / totalLessons) * 100;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-xl h-full">
      <ScrollArea className="h-full w-full pr-2 scroll-smooth">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
            {recordedSessions.title}
          </h2>
          <div className="text-sm text-white/70 mb-2">
            {completedLessons.length}/{totalLessons} lessons completed
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {recordedSessions.modules.map((module) => (
            <AccordionItem
              key={module._id}
              value={module._id}
              className="border-none rounded-xl overflow-hidden bg-white/5 backdrop-blur-lg"
            >
              <AccordionTrigger className="text-white font-medium px-4 py-3 bg-gradient-to-r from-emerald-700/40 via-emerald-600/40 to-emerald-800/40 hover:no-underline">
                {module.title}
              </AccordionTrigger>

              <AccordionContent className="text-white/90 space-y-2 px-4 py-3">
                {module.lessons.map((lesson, idx) => (
                  <div
                    key={lesson._id}
                    onClick={() => viewLesson(lesson._id)}
                    className="cursor-pointer"
                  >
                    <div
                      className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-colors ${
                        selectedLessonId === lesson._id ? "bg-white/10" : ""
                      }`}
                    >
                      {lesson.type === "video" ? (
                        <PlayCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-yellow-400 shrink-0" />
                      )}
                      <span
                        className={`flex-1 ${
                          completedLessons.includes(lesson._id)
                            ? "line-through text-white/60"
                            : ""
                        }`}
                      >
                        {lesson.title}
                      </span>
                      {completedLessons.includes(lesson._id) && (
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      )}
                    </div>
                    {idx < module.lessons.length - 1 && (
                      <Separator className="bg-white/10 my-1" />
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
};

export default CourseContentsAccordion;
