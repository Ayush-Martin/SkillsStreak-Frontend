import { Modal } from "@/components";
import { IQuizSubmission } from "@/types/quizType";
import { Award, Clock, CheckCircle, XCircle } from "lucide-react";

interface IAdminQuizSubmissionModalProps {
  quizSubmission: IQuizSubmission;
  onClose: () => void;
}

const AdminQuizSubmissionModal = ({
  quizSubmission,
  onClose,
}: IAdminQuizSubmissionModalProps) => {
  return (
    <Modal title="Quiz Submission Details" onClose={onClose} heightPx={600}>
      <div className="space-y-10">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 flex flex-wrap gap-8 justify-between">
          <div className="flex items-center gap-3 text-green-400">
            <Award size={22} />
            <span className="font-semibold text-lg">
              Score: {quizSubmission.score} /{" "}
              {quizSubmission.quiz.questions.length}
            </span>
          </div>
          <div className="flex items-center gap-3 text-blue-400">
            <Clock size={22} />
            <span>
              Time Taken: {Math.floor(quizSubmission.timeTaken / 60)}m{" "}
              {quizSubmission.timeTaken % 60}s
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {quizSubmission.quiz.questions.map((q, index) => {
            const submittedAnswer = quizSubmission.answers.find(
              (a) => a.questionId === q._id
            );

            const correctAnswer = q.options.find(
              (o) => o.id === q.answer
            )?.choice;

            const isCorrect = submittedAnswer?.answer === q.answer;

            return (
              <div
                key={q._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4"
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="text-green-500 mt-1" size={20} />
                  ) : (
                    <XCircle className="text-red-500 mt-1" size={20} />
                  )}
                  <span className="font-medium text-lg leading-snug">
                    Q{index + 1}: {q.question}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-lg text-sm ${
                    isCorrect
                      ? "bg-green-900/40 border border-green-700 text-green-300"
                      : "bg-red-900/40 border border-red-700 text-red-300"
                  }`}
                >
                  Submitted Answer:{" "}
                  {q.options.find((o) => o.id === submittedAnswer?.answer)
                    ?.choice || "No answer"}
                </div>

                {!isCorrect && (
                  <div className="p-3 rounded-lg text-sm bg-blue-900/40 border border-blue-700 text-blue-300">
                    Correct Answer: {correctAnswer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default AdminQuizSubmissionModal;
