import { getQuizSubmissionsProgress } from "@/api/quizSubmission.api";
import { getTopics } from "@/api/topic.api";
import {
  Footer,
  SearchBox,
  QuizFilter,
  TotalQuizzesTakenCard,
  AverageScoreCard,
  Pagination,
  DivLoading,
} from "@/components";
import QuizCard from "@/components/user/quiz/QuizCard";
import { getQuizzesApi } from "@/features/user/api/quizzesApi";
import { changePage } from "@/features/user/slice/quizzesSlice";
import { usePaginatedData } from "@/hooks";
import { UserLayout } from "@/layouts";
import { AppDispatch, RootReducer } from "@/store";
import { IQuizDifficulty, IQuizSubmissionProgress } from "@/types/quizType";
import { ITopic } from "@/types/topicType";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PAGE_SIZE = 4;

const UserQuizzesPage = () => {
  const { currentPage, quizzes, totalPages, loading } = useSelector(
    (state: RootReducer) => state.quizzes
  );
  const dispatch: AppDispatch = useDispatch();
  const [quizSubmissionProgress, setQuizSubmissionProgress] =
    useState<IQuizSubmissionProgress>({
      quizzesTaken: 0,
      totalQuestions: 0,
      totalScore: 0,
    });
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<"all" | string[]>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    IQuizDifficulty | "all"
  >("all");

  const { nextPage, paginatedData, previousPage, search, searchHandler } =
    usePaginatedData({
      size: PAGE_SIZE,
      getDataApi: getQuizzesApi,
      changePageApi: changePage,
      currentPage,
      extraData: { topics: selectedTopics, difficulty: selectedDifficulty },
      data: quizzes,
    });

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics();
      if (!data) return;
      setTopics(data);
    };

    const fetchProgress = async () => {
      const data = await getQuizSubmissionsProgress();
      if (!data) return;
      setQuizSubmissionProgress(data);
    };

    fetchTopics();
    fetchProgress();
  }, []);

  useEffect(() => {
    dispatch(
      getQuizzesApi({
        page: 1,
        search,
        size: PAGE_SIZE,
        topics: selectedTopics,
        difficulty: selectedDifficulty,
      })
    );
  }, [selectedTopics, selectedDifficulty]);

  return (
    <UserLayout>
      <section className="flex gap-2 w-full flex-col  lg:flex-row px-3 py-5">
        <div className="flex flex-col  sm:flex-row w-full lg:w-1/4  lg:flex-col gap-2 px-3 py-5">
          <div className="w-full sm:w-1/2 lg:w-full">
            <TotalQuizzesTakenCard
              totalQuizzes={quizSubmissionProgress?.quizzesTaken}
            />
          </div>
          <div className="w-full sm:w-1/2 lg:w-full">
            <AverageScoreCard
              averageScore={
                (quizSubmissionProgress?.totalScore /
                  quizSubmissionProgress?.totalQuestions) *
                  100 || 0
              }
            />
          </div>
        </div>
        <div className="lg:w-3/4 pb-5">
          <div className="mt-5 px-7">
            <SearchBox
              placeholder="search by course title"
              search={search}
              searchHandler={searchHandler}
            />
          </div>
          <div className="flex justify-center gap-2 px-8 mt-5 sm:px-0">
            <QuizFilter
              allTopics={topics}
              defaultTopics={selectedTopics}
              onTopicsChange={setSelectedTopics}
              defaultDifficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
            />
          </div>
          {loading ? (
            <DivLoading message="Loading quizzes..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-4">
              {paginatedData.map((quiz) => (
                <QuizCard key={quiz._id} topics={topics} quiz={quiz} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            previousPage={previousPage}
            nextPage={nextPage}
          />
        </div>
      </section>

      <Footer />
    </UserLayout>
  );
};

export default UserQuizzesPage;
