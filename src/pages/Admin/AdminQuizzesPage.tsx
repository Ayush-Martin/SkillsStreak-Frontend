import {
  Button,
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
import {
  adminQuizListUnListApi,
  getAdminQuizzesApi,
} from "@/features/admin/api/adminQuizApi";
import { changePage } from "@/features/admin/slice/adminQuizSlice";
import { useConfirm, usePaginatedData } from "@/hooks";
import { AdminLayout } from "@/layouts";
import { AppDispatch, RootReducer } from "@/store";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdEdit, MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 5;

const getDifficultyBadgeStyle = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-green-500/20 text-green-400 border-green-500";
    case "intermediate":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500";
    case "advance":
      return "bg-red-500/20 text-red-400 border-red-500";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500";
  }
};

const AdminQuizzesPage = () => {
  const confirm = useConfirm();
  const dispatch: AppDispatch = useDispatch();
  const { quizzes, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.adminQuiz
  );
  const navigate = useNavigate();

  const {
    nextPage,
    paginatedData,
    previousPage,
    search,
    searchHandler,
    refreshHandler,
  } = usePaginatedData({
    data: quizzes,
    currentPage,
    changePageApi: changePage,
    getDataApi: getAdminQuizzesApi,
    size: PAGE_SIZE,
  });

  const listUnlistQuiz = (quizId: string, listed: boolean) => {
    confirm(
      `Are you sure you want to ${listed ? "unlist" : "list"} this category?`,
      () => {
        dispatch(adminQuizListUnListApi(quizId));
      }
    );
  };
  return (
    <AdminLayout>
      <SearchBox
        placeholder="search by quiz title"
        search={search}
        searchHandler={searchHandler}
      />

      <div className="flex justify-center w-full my-5">
        <Button variant={"v1"} onClick={() => navigate("/admin/quizzes/new")}>
          Add Quiz
        </Button>
      </div>

      <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
        <MdOutlineRefresh />
      </button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quiz Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>List/UnList</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableSkeleton widths={[200, 100, 100, 100]} />
        ) : (
          <TableBody>
            {paginatedData.map(({ _id, title, isListed, difficulty }) => (
              <TableRow key={_id}>
                <TableCell>{title}</TableCell>
                <TableCell>
                  <span
                    className={`
                      px-2 py-1 text-sm font-medium rounded-full border 
                      ${getDifficultyBadgeStyle(difficulty)}
                    `}
                  >
                    {difficulty}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    className={`text-3xl ${
                      isListed ? "text-red-500" : "text-app-secondary"
                    }`}
                    onClick={() => listUnlistQuiz(_id, isListed)}
                  >
                    {isListed ? <IoEyeOff /> : <IoEye />}
                  </button>
                </TableCell>
                <TableCell className="text-3xl text-app-accent">
                  <button onClick={() => navigate(`/admin/quizzes/${_id}`)}>
                    <MdEdit />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </AdminLayout>
  );
};

export default AdminQuizzesPage;
