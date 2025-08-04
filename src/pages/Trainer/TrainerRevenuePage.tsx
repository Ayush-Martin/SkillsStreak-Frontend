import {
  Pagination,
  DateFilterWithExport,
  CourseTableSkeleton,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  TrainerRevenueCard,
  TrainerCommissionCard,
  TrainerOnProcessAmountCard,
} from "@/components";
import { changePage } from "@/features/trainer/slice/trainerRevenueSlice";
import { getTrainerRevenueApi } from "@/features/trainer/api/trainerRevenueApi";
import { usePaginatedData } from "@/hooks";
import TrainerLayout from "@/layouts/TrainerLayout";
import { AppDispatch, RootReducer } from "@/store";
import { IFilterType } from "@/types/revenueType";
import { useEffect, useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { exportTrainerRevenue } from "@/api";

const PAGE_SIZE = 4;

const TrainerRevenue = () => {
  const dispatch: AppDispatch = useDispatch();
  const { revenue, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.trainerRevenue
  );
  const [filterType, setFilterType] = useState<IFilterType>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { paginatedData, nextPage, previousPage, refreshHandler } =
    usePaginatedData({
      data: revenue.transactions,
      currentPage,
      getDataApi: getTrainerRevenueApi,
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
      getTrainerRevenueApi({
        page: 1,
        size: PAGE_SIZE,
        filterType: filterType,
        startDate: startDate,
        endDate: endDate,
      })
    );
  }, [filterType, startDate, endDate]);

  const handleExport = async (exportType: "pdf" | "excel") =>
    await exportTrainerRevenue(exportType, filterType, startDate, endDate);

  return (
    <TrainerLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <TrainerRevenueCard amount={revenue.totalRevenue} />
        <TrainerCommissionCard amount={revenue.totalCommission} />
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <TrainerOnProcessAmountCard amount={revenue.onProcessAmount} />
        </div>
      </div>

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
            <TableHead>Amount</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Admin Commission</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <CourseTableSkeleton />
        ) : (
          <TableBody>
            {paginatedData.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction.payer}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.course}</TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>{transaction.adminCommission}</TableCell>
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
    </TrainerLayout>
  );
};

export default TrainerRevenue;
