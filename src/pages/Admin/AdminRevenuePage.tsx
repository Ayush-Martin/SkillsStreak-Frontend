import { exportAdminRevenue } from "@/api/revenue.api";
import {
  CommissionRevenueCard,
  Pagination,
  RevenueCard,
  SubscriptionRevenueCard,
  CourseTableSkeleton,
  DateFilterWithExport,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";

import { getAdminRevenueApi } from "@/features/admin/api/adminRevenueApi";
import { changePage } from "@/features/admin/slice/adminRevenueSlice";
import { usePaginatedData } from "@/hooks";
import { AdminLayout } from "@/layouts";
import { AppDispatch, RootReducer } from "@/store";
import { IFilterType } from "@/types/revenueType";
import { useEffect, useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

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

  const handleExport = async (exportType: "pdf" | "excel") =>
    exportAdminRevenue(exportType, filterType, startDate, endDate);

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
