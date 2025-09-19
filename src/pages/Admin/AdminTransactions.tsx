import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  TableSkeleton,
  SearchBox,
  TransactionModal,
} from "@/components";
import { getAdminTransactionsApi } from "@/features/admin/api/adminTransactionApi";
import { changePage } from "@/features/admin/slice/adminTransactionSlice";
import usePaginatedData from "@/hooks/usePaginatedData";
import AdminLayout from "@/layouts/AdminLayout";
import { AppDispatch, RootReducer } from "@/store";
import { MdOutlineRefresh } from "@/assets/icons";
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
  const { transactions, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.adminTransactions
  );
  const dispatch: AppDispatch = useDispatch();
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
    getDataApi: getAdminTransactionsApi,
    changePageApi: changePage,
    size: pageSize,
    extraData: {
      type: selectedTransactionType,
      status: selectedTransactionStatus,
    },
  });

  useEffect(() => {
    dispatch(
      getAdminTransactionsApi({
        page: currentPage,
        size: pageSize,
        search,
        type: selectedTransactionType,
        status: selectedTransactionStatus,
      })
    );
  }, [selectedTransactionType, selectedTransactionStatus]);

  return (
    <AdminLayout>
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
            <TableHead>view</TableHead>
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
                  {transaction.payer
                    ? transaction.payer.role == "admin"
                      ? "Admin"
                      : transaction.payer.email
                    : "(wallet)"}
                </TableCell>
                <TableCell>
                  {transaction.receiver
                    ? transaction.receiver.role == "admin"
                      ? "Admin"
                      : transaction.receiver.email
                    : "Admin"}
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>
                  <button
                    onClick={() => setSelectedTransaction(transaction)}
                    className="text-blue-500 underline"
                  >
                    view
                  </button>
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

      {selectedTransaction && (
        <TransactionModal
          open={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          transaction={selectedTransaction}
        />
      )}
    </AdminLayout>
  );
};

export default Transactions;
