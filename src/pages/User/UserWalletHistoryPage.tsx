import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
  UserSidebar,
} from "@/components";
import { getUserWalletHistoryApi } from "@/features/user/api/walletHistoryApi";
import { changePage } from "@/features/user/slice/walletHistorySlice";
import { usePaginatedData } from "@/hooks";
import { UserLayout } from "@/layouts";
import { RootReducer } from "@/store";
import { MdOutlineRefresh } from "react-icons/md";
import { useSelector } from "react-redux";

const pageSize = 10;

const UserWalletHistoryPage = () => {
  const { currentPage, loading, totalPages, walletHistory } = useSelector(
    (state: RootReducer) => state.walletHistory
  );

  const { nextPage, previousPage, paginatedData, refreshHandler } =
    usePaginatedData({
      data: walletHistory,
      currentPage,
      getDataApi: getUserWalletHistoryApi,
      changePageApi: changePage,
      size: pageSize,
    });

  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full px-5 mt-10 ml-0 text-white sm:px-10 lg:px-20 md:ml-64 h-80 md:mt-0">
          <button
            className="mt-10 text-3xl text-blue-600"
            onClick={refreshHandler}
          >
            <MdOutlineRefresh />
          </button>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>

            {loading ? (
              <TableSkeleton widths={[100, 100, 100, 100, 100, 100]} />
            ) : (
              <TableBody>
                {paginatedData.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>
                      {new Date(transaction.createdAt).toDateString()}
                    </TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${
                          transaction.type === "credit"
                            ? "bg-green-800/30 text-green-400"
                            : "bg-red-800/30 text-red-400"
                        }`}
                      >
                        {transaction.type}
                      </span>
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
        </div>
      </div>
    </UserLayout>
  );
};

export default UserWalletHistoryPage;
