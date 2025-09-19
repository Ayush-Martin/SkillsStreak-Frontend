import {
  AdminQuizSubmissionModal,
  Pagination,
  SearchBox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from "@/components";
import { getAdminQuizSubmissionsApi } from "@/features/admin/api/adminQuizSubmissionApi";
import { changePage } from "@/features/admin/slice/adminQuizSubmissionSlice";
import { usePaginatedData } from "@/hooks";
import { AdminLayout } from "@/layouts";
import { RootReducer } from "@/store";
import { IQuizSubmission } from "@/types/quizType";
import { useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { useSelector } from "react-redux";

const PAGE_SIZE = 5;

const AdminQuizSubmissions = () => {
  const { quizSubmissions, currentPage, loading, totalPages } = useSelector(
    (state: RootReducer) => state.adminQuizSubmissions
  );
  const [selectedQuizSubmission, setSelectedQuizSubmission] =
    useState<IQuizSubmission | null>(null);

  const {
    paginatedData,
    nextPage,
    previousPage,
    refreshHandler,
    search,
    searchHandler,
  } = usePaginatedData({
    data: quizSubmissions,
    currentPage,
    changePageApi: changePage,
    getDataApi: getAdminQuizSubmissionsApi,
    size: PAGE_SIZE,
  });

  return (
    <AdminLayout>
      <SearchBox
        placeholder="search by quiz title"
        search={search}
        searchHandler={searchHandler}
      />

      <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
        <MdOutlineRefresh />
      </button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quiz Title</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Time Taken</TableHead>
            <TableHead>view</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableSkeleton widths={[200, 100, 100, 100]} />
        ) : (
          <TableBody>
            {paginatedData.map((quizSubmission) => (
              <TableRow key={quizSubmission._id}>
                <TableCell>{quizSubmission.quiz.title}</TableCell>
                <TableCell>{quizSubmission.user.email}</TableCell>
                <TableCell>
                  {quizSubmission.score}/{quizSubmission.quiz.questions.length}
                </TableCell>
                <TableCell>
                  {Math.floor(quizSubmission.timeTaken / 60)}m{" "}
                  {quizSubmission.timeTaken % 60}s
                </TableCell>
                <TableCell>
                  <button
                    className="text-blue-500 underline"
                    onClick={() => setSelectedQuizSubmission(quizSubmission)}
                  >
                    view
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      <Pagination
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        previousPage={previousPage}
        nextPage={nextPage}
      />

      {selectedQuizSubmission && (
        <AdminQuizSubmissionModal
          onClose={() => setSelectedQuizSubmission(null)}
          quizSubmission={selectedQuizSubmission}
        />
      )}
    </AdminLayout>
  );
};

export default AdminQuizSubmissions;
