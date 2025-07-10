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
import { X } from "lucide-react";
import { axiosPatchRequest } from "@/config/axios";
import { successPopup } from "@/utils/popup";

const pageSize = 10;

const Transactions: FC = () => {
  const { email } = useSelector((state: RootReducer) => state.user);
  const { transactions, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.userTransactions
  );
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
    const res = await axiosPatchRequest(`/transactions/${transactionId}`);
    if (!res) return;
    successPopup(res.message);
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

interface TransactionDetailsModalProps {
  transaction: ITransaction | null;
  onClose: () => void;
  cancelPurchase: (transactionId: string) => void;
}

const TransactionDetailsModal: FC<TransactionDetailsModalProps> = ({
  transaction,
  onClose,
  cancelPurchase,
}) => {
  const user = useSelector((state: RootReducer) => state.user);
  if (!transaction) return null;

  const {
    _id,
    type,
    amount,
    method,
    status,
    payer,
    receiver,
    course,
    adminCommission,
  } = transaction;

  const handleCancel = () => {
    // TODO: Call cancel API here
    cancelPurchase(_id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg bg-[#111] text-white rounded-2xl shadow-xl border border-white/10 p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Transaction Details
        </h2>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">Transaction ID</span>
            <span className="text-white font-medium text-right truncate max-w-[60%]">
              {_id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Type</span>
            <span className="text-white font-medium">{type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Amount</span>
            <span className="text-white font-medium">₹{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Method</span>
            <span className="text-white font-medium">{method}</span>
          </div>
          {adminCommission && (
            <div className="flex justify-between">
              <span className="text-zinc-400">Admin Commission</span>
              <span className="text-white font-medium">{adminCommission}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-zinc-400">Status</span>
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                status === "completed"
                  ? "bg-green-600"
                  : status === "pending"
                  ? "bg-yellow-500"
                  : status === "canceled"
                  ? "bg-red-600"
                  : "bg-gray-600"
              }`}
            >
              {status}
            </span>
          </div>

          {payer?.email && (
            <div className="flex justify-between">
              <span className="text-zinc-400">Payer</span>
              <span className="text-white font-medium truncate max-w-[60%]">
                {payer.role === "admin" ? "Admin" : payer.email}
              </span>
            </div>
          )}

          {receiver?.email && (
            <div className="flex justify-between">
              <span className="text-zinc-400">Receiver</span>
              <span className="text-white font-medium truncate max-w-[60%]">
                {receiver.role === "admin" ? "Admin" : receiver.email}
              </span>
            </div>
          )}

          {course && (
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm font-medium text-white mb-2">Course</p>
              <div className="flex items-center gap-3">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover border border-white/10"
                />
                <p className="text-base font-medium">{course.title}</p>
              </div>
            </div>
          )}
        </div>

        {status === "on_process" && user._id === payer._id && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition font-medium text-white"
            >
              Cancel Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Transactions;
