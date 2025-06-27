import { Pagination } from "@/components";
import StatCard from "@/components/common/StatCard";
import { TableSkeleton } from "@/components/skeletons";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui";
import { changePage } from "@/features/admin/slice/adminUserSlice";
import { getUserTransactionsApi } from "@/features/user/api/transactionApi";
import { usePaginatedData } from "@/hooks";
import TrainerLayout from "@/layouts/TrainerLayout";
import { RootReducer } from "@/store";
import { FC } from "react";
import { FaMoneyBillWave, FaWallet } from "react-icons/fa6";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { MdOutlineRefresh } from "react-icons/md";
import { useSelector } from "react-redux";

const RevenueCard = () => {
  return (
    <StatCard
      icon={<FaMoneyBillWave className="text-yellow-400" />}
      title="Total Revenue"
      value="₹ 45,000"
      color="text-yellow-400"
      hoverShadowColor="hover:shadow-yellow-500/30"
    />
  );
};

const CommissionCard: FC = () => {
  return (
    <StatCard
      icon={<HiOutlineCurrencyRupee className="text-emerald-400" />}
      title="Total Commission"
      value="₹ 12,500"
      color="text-emerald-400"
      hoverShadowColor="hover:shadow-emerald-500/30"
    />
  );
};

const pageSize = 4;

const Wallet = () => {
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
    <TrainerLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        <RevenueCard />
        <CommissionCard />
      </div>
      <div className="w-full">
        <button
          className="mt-5 text-3xl text-blue-600"
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
    </TrainerLayout>
  );
};

export default Wallet;
