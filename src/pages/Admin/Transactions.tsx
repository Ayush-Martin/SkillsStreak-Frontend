import { Pagination } from "@/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminTransactionsApi } from "@/features/admin/api/adminTransactionApi";
import { changePage } from "@/features/admin/slice/adminTransactionSlice";
import usePaginatedData from "@/hooks/usePaginatedData";
import AdminLayout from "@/layouts/AdminLayout";
import { AppDispatch, RootReducer } from "@/store";
import { FC } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const Transactions: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { transactions, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.adminTransactions
  );
  const { nextPage, previousPage, paginatedData } = usePaginatedData({
    data: transactions,
    currentPage,
    getDataApi: getAdminTransactionsApi,
    changePageApi: changePage,
  });

  const refreshHandler = () => {
    dispatch(getAdminTransactionsApi({ page: 1 }));
  };

  return (
    <AdminLayout>
      <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
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
                <TableCell>{transaction.payerId.email}</TableCell>
                <TableCell>
                  {transaction.receiverId.role == "admin"
                    ? "Admin"
                    : transaction.receiverId.email}
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
    </AdminLayout>
  );
};

export default Transactions;
