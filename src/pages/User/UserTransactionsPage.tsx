import { useDispatch, useSelector } from "react-redux";
import { FC, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  UserSidebar,
  TableSkeleton,
  TransactionModal,
  SearchBox,
} from "@/components";
import { getUserTransactionsApi } from "@/features/user/api/transactionApi";
import { changePage } from "@/features/user/slice/transactionSlice";
import usePaginatedData from "@/hooks/usePaginatedData";
import UserLayout from "@/layouts/UserLayout";
import { AppDispatch, RootReducer } from "@/store";
import { MdOutlineRefresh } from "@/assets/icons";
import { axiosPatchRequest } from "@/config/axios";
import { successPopup } from "@/utils/popup";
import { useConfirm } from "@/hooks";
import {
  ITransaction,
  ITransactionStatus,
  ITransactionType,
} from "@/types/transactionType";
import Filter from "@/components/common/Filter";

const pageSize = 10;
const transactionTypes: ITransactionType[] = [
  "subscription",
  "commission",
  "course_purchase",
  "wallet_redeem",
];
const transactionStatuses: ITransactionStatus[] = [
  "pending",
  "completed",
  "failed",
];

const Transactions: FC = () => {
  const { email } = useSelector((state: RootReducer) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const { transactions, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.userTransactions
  );
  const confirm = useConfirm();
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    ITransactionType | "all"
  >("all");
  const [selectedTransactionStatus, setSelectedTransactionStatus] = useState<
    ITransactionStatus | "all"
  >("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const {
    nextPage,
    previousPage,
    paginatedData,
    refreshHandler,
    search,
    searchHandler,
  } = usePaginatedData({
    data: transactions,
    currentPage,
    getDataApi: getUserTransactionsApi,
    changePageApi: changePage,
    size: pageSize,
    extraData: {
      type: selectedTransactionType,
      status: selectedTransactionStatus,
    },
  });

  useEffect(() => {
    dispatch(
      getUserTransactionsApi({
        page: currentPage,
        size: pageSize,
        search,
        type: selectedTransactionType,
        status: selectedTransactionStatus,
      })
    );
  }, [selectedTransactionType, selectedTransactionStatus]);

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
        <UserSidebar />
        <div className="w-full px-5 mt-10 ml-0 text-white sm:px-10 lg:px-20 md:ml-64 h-80 md:mt-0 py-5">
          <SearchBox
            search={search}
            placeholder="search by email"
            searchHandler={searchHandler}
          />
          <div className="mt-4">
            <Filter
              filters={[
                {
                  label: "Transaction Type",
                  default: { value: "all", placeholder: "All" },
                  values: transactionTypes.map((type) => ({
                    value: type,
                    placeholder: type,
                  })),
                  selectedValue: selectedTransactionType,
                  changeSelectedValue: setSelectedTransactionType,
                },
                {
                  label: "Transaction Status",
                  default: { value: "all", placeholder: "All" },
                  values: transactionStatuses.map((status) => ({
                    value: status,
                    placeholder: status,
                  })),
                  selectedValue: selectedTransactionStatus,
                  changeSelectedValue: setSelectedTransactionStatus,
                },
              ]}
              clearFilters={() => {
                setSelectedTransactionType("all");
                setSelectedTransactionStatus("all");
              }}
            />
          </div>
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
      {selectedTransaction && (
        <TransactionModal
          open={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          transaction={selectedTransaction}
          onCancel={() => cancelPurchase(selectedTransaction._id)}
        />
      )}
    </UserLayout>
  );
};

export default Transactions;
