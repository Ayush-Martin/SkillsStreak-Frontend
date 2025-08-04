import { FC } from "react";
import { useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  TableSkeleton
} from "@/components";
import { getAdminTransactionsApi } from "@/features/admin/api/adminTransactionApi";
import { changePage } from "@/features/admin/slice/adminTransactionSlice";
import usePaginatedData from "@/hooks/usePaginatedData";
import AdminLayout from "@/layouts/AdminLayout";
import { RootReducer } from "@/store";
import { MdOutlineRefresh } from "@/assets/icons";

const pageSize = 10;

const Transactions: FC = () => {
  const { transactions, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.adminTransactions
  );
  const { nextPage, previousPage, paginatedData, refreshHandler } =
    usePaginatedData({
      data: transactions,
      currentPage,
      getDataApi: getAdminTransactionsApi,
      changePageApi: changePage,
      size: pageSize,
    });

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

        {loading ? (
          <TableSkeleton widths={[200, 100, 100, 100, 100, 100]} />
        ) : (
          <TableBody>
            {paginatedData.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction._id}</TableCell>
                <TableCell>
                  {transaction.payerId
                    ? transaction.payerId.role == "admin"
                      ? "Admin"
                      : transaction.payerId.email
                    : "(wallet)"}
                </TableCell>
                <TableCell>
                  {transaction.receiverId
                    ? transaction.receiverId.role == "admin"
                      ? "Admin"
                      : transaction.receiverId.email
                    : "Admin"}
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
    </AdminLayout>
  );
};

export default Transactions;
