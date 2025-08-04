import { FC } from "react";
import { useSelector, useDispatch } from "react-redux";

import {AdminLayout} from "@/layouts";
import {
  AiOutlineCheckCircle,
  AiFillCloseCircle,
  MdOutlineRefresh,
} from "@/assets/icons";
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
import { AppDispatch, RootReducer } from "@/store";
import { changePage } from "@/features/admin/slice/adminTrainerRequestSlice";
import {
  AdminChangeTrainerRequestStatus,
  getAdminTrainerRequestsApi,
} from "@/features/admin/api/adminTrainerRequestApi";
import usePaginatedData from "@/hooks/usePaginatedData";
import { Link } from "react-router-dom";

const PAGE_SIZE = 10;

const TrainerRequest: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.adminTrainerRequest
  );

  const { nextPage, paginatedData, previousPage, refreshHandler } =
    usePaginatedData({
      data: users,
      currentPage,
      getDataApi: getAdminTrainerRequestsApi,
      changePageApi: changePage,
      size: PAGE_SIZE,
    });

  return (
    <AdminLayout>
      <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
        <MdOutlineRefresh />
      </button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Rejected Reason</TableHead>
            <TableHead>view</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableSkeleton widths={[200, 150, 100, 50]} />
        ) : (
          <TableBody>
            {paginatedData.map(({ _id, status, userId, rejectedReason }) => (
              <TableRow key={_id}>
                <TableCell>{userId.email}</TableCell>
                <TableCell>{userId.username}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${
                      status === "approved"
                        ? "bg-green-800/30 text-green-400"
                        : status === "rejected"
                        ? "bg-red-800/30 text-red-400"
                        : "bg-yellow-800/30 text-yellow-400"
                    }`}
                  >
                    {status}
                  </span>
                </TableCell>
                <TableCell className="flex gap-3">
                  {status === "pending" ? (
                    <>
                      <button
                        className="text-3xl text-green-500"
                        onClick={() =>
                          dispatch(
                            AdminChangeTrainerRequestStatus({
                              trainerRequestId: _id,
                              status: "approved",
                            })
                          )
                        }
                      >
                        <AiOutlineCheckCircle />
                      </button>
                      <button
                        className="text-3xl text-red-500"
                        onClick={() => {
                          const reason = window.prompt(
                            "Enter rejection reason:"
                          );
                          if (!reason) return;
                          dispatch(
                            AdminChangeTrainerRequestStatus({
                              trainerRequestId: _id,
                              status: "rejected",
                              rejectedReason: reason,
                            })
                          );
                        }}
                      >
                        <AiFillCloseCircle />
                      </button>
                    </>
                  ) : (
                    <h1 className="text-sm text-muted-foreground">No action</h1>
                  )}
                </TableCell>
                <TableCell>{rejectedReason || "-"}</TableCell>
                <TableCell>
                  <Link
                    to={`/admin/users/${userId._id}`}
                    className="text-sm text-blue-500 underline hover:text-purple-400 transition"
                  >
                    View
                  </Link>
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
    </AdminLayout>
  );
};

export default TrainerRequest;
