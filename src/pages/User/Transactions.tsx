import { useSelector, useDispatch } from "react-redux";
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
import { AppDispatch, RootReducer } from "@/store";
import { MdOutlineRefresh } from "@/assets/icons";

const Transactions: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { email } = useSelector((state: RootReducer) => state.user);
  const { transactions, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.userTransactions
  );
  const { nextPage, previousPage, paginatedData } = usePaginatedData({
    data: transactions,
    currentPage,
    getDataApi: getUserTransactionsApi,
    changePageApi: changePage,
  });

  const refreshHandler = () => {
    dispatch(getUserTransactionsApi({ page: 1 }));
  };

  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-10 ml-0 text-white md:ml-64 h-80 md:mt-0">
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

            <TableBody>
              {!paginatedData.length ? (
                <h1 className="mt-3 text-2xl">No Courses</h1>
              ) : (
                paginatedData.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.transactionId}</TableCell>
                    <TableCell>
                      {transaction.payerId.email == email
                        ? "You"
                        : transaction.payerId.email}
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
                ))
              )}
            </TableBody>
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
