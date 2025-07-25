import { Pagination } from "@/components";
import DateFilter from "@/components/common/DateFilter";
import DateFilterWithExport from "@/components/common/DateFilterWithExport";
import StatCard from "@/components/common/StatCard";
import { CourseTableSkeleton } from "@/components/skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import appApi, { axiosGetRequest } from "@/config/axios";
import { getAdminRevenueApi } from "@/features/admin/api/adminRevenueApi";
import { changePage } from "@/features/admin/slice/adminRevenueSlice";
import { useEditCourse, usePaginatedData } from "@/hooks";
import { AdminLayout } from "@/layouts";
import { AppDispatch, RootReducer } from "@/store";
import { IFilterType } from "@/types/revenueType";
import { FC, useEffect, useState } from "react";
import { FaCrown, FaMoneyBillWave } from "react-icons/fa6";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

interface IRevenueCard {
  amount: number;
}

const RevenueCard: FC<IRevenueCard> = ({ amount }) => {
  return (
    <StatCard
      icon={<FaMoneyBillWave className="text-yellow-400" />}
      title="Total Revenue"
      value={`₹ ${amount}`}
      color="text-yellow-400"
      hoverShadowColor="hover:shadow-yellow-500/30"
    />
  );
};

interface ICommissionRevenueCard {
  amount: number;
}

const CommissionRevenueCard: FC<ICommissionRevenueCard> = ({ amount }) => {
  return (
    <StatCard
      icon={<HiOutlineCurrencyRupee className="text-emerald-400" />}
      title="Commission Revenue"
      value={`₹ ${amount}`}
      color="text-emerald-400"
      hoverShadowColor="hover:shadow-emerald-500/30"
    />
  );
};

interface ISubscriptionRevenueCard {
  amount: number;
}

const SubscriptionRevenueCard: FC<ISubscriptionRevenueCard> = ({ amount }) => {
  return (
    <StatCard
      icon={<FaCrown className="text-purple-400" />}
      title="Subscription Revenue"
      value={`₹ ${amount}`}
      color="text-purple-400"
      hoverShadowColor="hover:shadow-purple-500/30"
    />
  );
};

const PAGE_SIZE = 3;

const AdminRevenue = () => {
  const dispatch: AppDispatch = useDispatch();
  const { revenue, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.adminRevenue
  );
  const [filterType, setFilterType] = useState<IFilterType>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { paginatedData, nextPage, previousPage, refreshHandler } =
    usePaginatedData({
      data: revenue.transactions,
      currentPage,
      getDataApi: getAdminRevenueApi,
      changePageApi: changePage,
      size: PAGE_SIZE,
      extraData: {
        filterType,
        startDate,
        endDate,
      },
    });

  useEffect(() => {
    if (
      filterType == "custom" &&
      (!startDate || !endDate || new Date(startDate) > new Date(endDate))
    )
      return;
    dispatch(
      getAdminRevenueApi({
        page: 1,
        size: PAGE_SIZE,
        filterType: filterType,
        startDate: startDate,
        endDate: endDate,
      })
    );
  }, [filterType, startDate, endDate]);

  const handleExport = async (exportType: "pdf" | "excel") => {
    try {
      const res = await appApi.get(
        `/admin/revenue/export?filterType=${filterType}&startDate=${startDate}&endDate=${endDate}&exportType=${exportType}`,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([res.data], {
        type:
          exportType === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `admin-revenue-report.${
        exportType === "pdf" ? ".pdf" : "xlsx"
      }`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download PDF:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <RevenueCard amount={revenue.totalRevenue} />
        <CommissionRevenueCard amount={revenue.commissionRevenue} />
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <SubscriptionRevenueCard amount={revenue.subscriptionRevenue} />
        </div>
      </div>
      {/* <DateFilter /> */}
      <DateFilterWithExport
        filterType={filterType}
        startDate={startDate}
        endDate={endDate}
        changeFilterType={setFilterType}
        changeStartDate={setStartDate}
        changeEndDate={setEndDate}
        handleExport={handleExport}
      />
      <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
        <MdOutlineRefresh />
      </button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payer</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <CourseTableSkeleton />
        ) : (
          <TableBody>
            {paginatedData.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction.payer}</TableCell>
                <TableCell>
                  {transaction.type === "subscription" ? "User" : "Trainer"}
                </TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.type}</TableCell>
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

export default AdminRevenue;
