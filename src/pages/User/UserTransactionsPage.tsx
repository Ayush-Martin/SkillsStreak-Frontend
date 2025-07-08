import { useSelector } from "react-redux";
import { FC } from "react";

import { Pagination, UserSidebar } from "@/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { getUserTransactionsApi } from "@/features/user/api/transactionApi";
import { changePage } from "@/features/user/slice/transactionSlice";
import usePaginatedData from "@/hooks/usePaginatedData";
import UserLayout from "@/layouts/UserLayout";
import { RootReducer } from "@/store";
import { MdOutlineRefresh } from "@/assets/icons";
import { TableSkeleton } from "@/components/skeletons";

const pageSize = 10;

const Transactions: FC = () => {
  const { email } = useSelector((state: RootReducer) => state.user);
  const { transactions, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.userTransactions
  );
  const { nextPage, previousPage, paginatedData, refreshHandler } =
    usePaginatedData({
      data: transactions,
      currentPage,
      getDataApi: getUserTransactionsApi,
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
                <TableHead>TransactionId</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>CourseId</TableHead>
              </TableRow>
            </TableHeader>

            {loading ? (
              <TableSkeleton widths={[100, 100, 100, 100, 100, 100]} />
            ) : (
              <TableBody>
                {paginatedData.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction._id}</TableCell>
                    <TableCell>
                      {transaction.payerId
                        ? transaction.payerId.email == email
                          ? "You"
                          : transaction.payerId.role == "admin"
                          ? "Admin"
                          : transaction.payerId.email
                        : "admin"}
                    </TableCell>
                    <TableCell>
                      {transaction.receiverId
                        ? transaction.receiverId.email == email
                          ? "You"
                          : transaction.receiverId.role == "admin"
                          ? "Admin"
                          : transaction.receiverId.email
                        : "admin"}
                    </TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.courseId?.title}</TableCell>
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
        </div>
      </div>
    </UserLayout>
  );
};

export default Transactions;
