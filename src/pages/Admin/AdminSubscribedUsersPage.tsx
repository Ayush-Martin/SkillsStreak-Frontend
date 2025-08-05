import {
  HighlightText,
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
import { getAdminSubscribedUsersApi } from "@/features/admin/api/adminSubscribedUsersApi";
import { changePage } from "@/features/admin/slice/adminSubscribedUsersSlice";
import { usePaginatedData } from "@/hooks";
import { AdminLayout } from "@/layouts";
import { RootReducer } from "@/store";
import { MdOutlineRefresh } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const pageSize = 5;
const AdminSubscribedUsersPage = () => {
  const { subscribedUsers, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.adminSubscribedUsers
  );

  const {
    nextPage,
    previousPage,
    paginatedData,
    search,
    searchHandler,
    refreshHandler,
  } = usePaginatedData({
    data: subscribedUsers,
    currentPage,
    getDataApi: getAdminSubscribedUsersApi,
    changePageApi: changePage,
    size: pageSize,
  });

  return (
    <AdminLayout>
      <SearchBox
        placeholder="search by email"
        search={search}
        searchHandler={searchHandler}
      />

      <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
        <MdOutlineRefresh />
      </button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subscription Plan</TableHead>
            <TableHead>StartDate</TableHead>
            <TableHead>EndDate</TableHead>
            <TableHead>View</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableSkeleton widths={[200, 150, 100, 50]} />
        ) : (
          <TableBody>
            {paginatedData.map((subscription) => (
              <TableRow key={subscription._id}>
                <TableCell>{subscription.user.username}</TableCell>
                <TableCell>
                  <HighlightText
                    search={search}
                    text={subscription.user.email}
                  />
                </TableCell>

                <TableCell>{subscription.subscriptionPlan.title}</TableCell>
                <TableCell>
                  {new Date(subscription.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(subscription.endDate).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <Link
                    to={`/admin/users/${subscription.user._id}`}
                    className="text-sm text-blue-500 underline hover:text-purple-400 transition"
                  >
                    View
                  </Link>
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

export default AdminSubscribedUsersPage;
