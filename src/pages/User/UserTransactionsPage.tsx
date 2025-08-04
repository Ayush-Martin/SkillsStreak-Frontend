import { useSelector } from "react-redux";
import { FC, useState } from "react";

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
import {
  changePage,
  ITransaction,
} from "@/features/user/slice/transactionSlice";
import usePaginatedData from "@/hooks/usePaginatedData";
import UserLayout from "@/layouts/UserLayout";
import { RootReducer } from "@/store";
import { MdOutlineRefresh } from "@/assets/icons";
import { TableSkeleton } from "@/components/skeletons";
import { axiosPatchRequest } from "@/config/axios";
import { successPopup } from "@/utils/popup";
import TransactionDetailsModal from "@/components/common/TransactionDetailsModal";
import { useConfirm } from "@/hooks";

const pageSize = 10;

const Transactions: FC = () => {
  const { email } = useSelector((state: RootReducer) => state.user);
  const { transactions, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.userTransactions
  );
  const confirm = useConfirm();
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const { nextPage, previousPage, paginatedData, refreshHandler } =
    usePaginatedData({
      data: transactions,
      currentPage,
      getDataApi: getUserTransactionsApi,
      changePageApi: changePage,
      size: pageSize,
    });

  const cancelPurchase = async (transactionId: string) => {
    confirm("Are you sure you want to cancel this transaction?", async () => {
      const res = await axiosPatchRequest(`/transactions/${transactionId}`);
      if (!res) return;
      successPopup(res.message);
    });
  };

  return (
    <UserLayout>
      <div className="relative flex">
        {selectedTransaction && (
          <TransactionDetailsModal
            cancelPurchase={cancelPurchase}
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        )}
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
                <TableHead></TableHead>
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
                      {transaction.payer
                        ? transaction.payer.email == email
                          ? "You"
                          : transaction.payer.role == "admin"
                          ? "Admin"
                          : transaction.payer.email
                        : "admin"}
                    </TableCell>
                    <TableCell>
                      {transaction.receiver
                        ? transaction.receiver.email == email
                          ? "You"
                          : transaction.receiver.role == "admin"
                          ? "Admin"
                          : transaction.receiver.email
                        : "admin"}
                    </TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="text-blue-400 underline hover:text-blue-300"
                      >
                        View More
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
        </div>
      </div>
    </UserLayout>
  );
};

export default Transactions;
