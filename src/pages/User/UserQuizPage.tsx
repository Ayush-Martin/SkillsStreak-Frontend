import { DivLoading, Footer } from "@/components";
import { useQuiz } from "@/hooks";
import { UserLayout } from "@/layouts";
import { IViewQuiz } from "@/types/quizType";
import {
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Layers,
  ListChecks,
  RotateCcw,
  Play,
} from "lucide-react";
import { useState, useEffect } from "react";

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-600 text-white",
  Medium: "bg-yellow-500 text-black",
  Hard: "bg-red-600 text-white",
};

const UserQuizPage = () => {
  const { previousSubmissions, quiz, submitQuiz, resubmitQuiz } = useQuiz();
  const [showQuizModal, setShowQuizModal] = useState(false);

  const handleStart = () => setShowQuizModal(true);
  const handleReattempt = () => setShowQuizModal(true);

  const handleQuizSubmit = async (
    answers: { questionId: string; answer: string }[],
    timeTaken: number
  ) => {
    if (previousSubmissions) {
      resubmitQuiz(previousSubmissions._id, answers, timeTaken);
    } else {
      submitQuiz(answers, timeTaken);
    }
    setShowQuizModal(false);
  };

  if (!quiz) {
    return (
      <UserLayout>
        <div className="w-full h-[500px] flex items-center justify-center">
          <DivLoading message="Loading quiz..." />
        </div>
        <Footer />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12 text-white">
        {/* Quiz Header */}
        <div className="bg-[#11131d] border border-gray-800 rounded-2xl p-8 space-y-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 shadow-md">
              <Layers size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                difficultyColors[quiz.difficulty] || "bg-gray-600 text-white"
              }`}
            >
              {quiz.difficulty}
            </span>
            <div className="flex items-center gap-2 text-gray-400">
              <ListChecks size={18} />
              <span>{quiz.questions.length} Questions</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quiz.topics.map((t) => (
              <span
                key={t._id}
                className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded-full text-sm"
              >
                {t.topicName}
              </span>
            ))}
          </div>

          <p className="text-gray-300 leading-relaxed">{quiz.description}</p>

          {quiz.questions.length > 0 &&
            (!previousSubmissions ? (
              <button
                onClick={handleStart}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all text-white font-medium flex items-center gap-2 shadow-lg"
              >
                <Play size={18} /> Start Quiz
              </button>
            ) : (
              <button
                onClick={handleReattempt}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-all text-white font-medium flex items-center gap-2 shadow-lg"
              >
                <RotateCcw size={18} /> Reattempt Quiz
              </button>
            ))}
        </div>

        {/* Results */}
        {previousSubmissions && (
          <div className="space-y-10">
            <div className="bg-[#11131d] border border-gray-800 rounded-2xl p-8 flex flex-wrap gap-8 justify-between shadow-md">
              <div className="flex items-center gap-3 text-green-400">
                <Award size={22} />
                <span className="font-semibold text-lg">
                  Score: {previousSubmissions.score} / {quiz.questions.length}
                </span>
              </div>
              <div className="flex items-center gap-3 text-blue-400">
                <Clock size={22} />
                <span>
                  Time Taken: {Math.floor(previousSubmissions.timeTaken / 60)}m{" "}
                  {previousSubmissions.timeTaken % 60}s
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {quiz.questions.map((q, index) => {
                const submittedAnswer = previousSubmissions.answers.find(
                  (a) => a.questionId === q._id
                );
                const correctAnswer = q.options.find(
                  (o) => o.id === q.answer
                )?.choice;
                const isCorrect = submittedAnswer?.answer === q.answer;

                return (
                  <div
                    key={q._id}
                    className={`bg-[#11131d] border border-gray-800 rounded-2xl p-6 space-y-4 shadow-md transition-all hover:shadow-lg`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle
                          className="text-green-500 mt-1"
                          size={20}
                        />
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
                      Your Answer:{" "}
                      {q.options.find((o) => o.id === q.answer)?.choice ||
                        "No answer"}
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
        )}
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <QuizModal
          quiz={quiz}
          onSubmit={handleQuizSubmit}
          onClose={() => setShowQuizModal(false)}
        />
      )}

      <Footer />
    </UserLayout>
  );
};

// Quiz Modal
interface QuizModalProps {
  quiz: IViewQuiz;
  onSubmit: (
    answers: { questionId: string; answer: string }[],
    timeTaken: number
  ) => Promise<void>;
  onClose: () => void;
}

const QuizModal = ({ quiz, onSubmit, onClose }: QuizModalProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeTaken, setTimeTaken] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const allAnswered = Object.keys(answers).length === totalQuestions;
  const currentQuestion = quiz.questions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => setTimeTaken((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleQuizComplete = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, answer]) => ({ questionId, answer })
      );
      await onSubmit(formattedAnswers, timeTaken);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPrevious = () =>
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  const goToNext = () =>
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#1c1f26] border border-gray-700 rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">
              Question {currentQuestionIndex + 1}{" "}
              <span className="text-gray-400 text-sm">/ {totalQuestions}</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-900 text-blue-300 font-medium">
                {quiz.difficulty}
              </span>
              <span className="text-gray-300 text-sm flex items-center gap-1">
                <Clock size={14} /> {Math.floor(timeTaken / 60)}m{" "}
                {timeTaken % 60}s
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-[#222630] border border-gray-700 rounded-xl p-4">
          <p className="text-gray-200 text-base leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt) => {
            const isSelected = answers[currentQuestion._id] === opt.id;
            return (
              <label
                key={opt.id}
                className={`block rounded-lg border p-3 cursor-pointer text-sm transition-all duration-200 ${
                  isSelected
                    ? "bg-blue-700 border-blue-500 text-white shadow-inner animate-pulse"
                    : "bg-[#1f232d] border-gray-700 text-gray-300 hover:bg-[#292e3a]"
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion._id}
                  value={opt.id}
                  checked={isSelected}
                  onChange={() =>
                    handleAnswerChange(currentQuestion._id, opt.id)
                  }
                  className="hidden"
                />
                {opt.choice}
              </label>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-gray-700">
          <button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md disabled:opacity-50 text-sm font-medium text-gray-300 transition"
          >
            ⬅ Previous
          </button>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <button
              onClick={handleQuizComplete}
              disabled={isSubmitting || !allAnswered}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                allAnswered
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit ✅"}
            </button>
          ) : (
            <button
              onClick={goToNext}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white transition"
            >
              Next ➡
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserQuizPage;
