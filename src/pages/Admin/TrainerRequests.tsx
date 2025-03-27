import { FC } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Pagination } from "@/components";
import AdminLayout from "@/layouts/AdminLayout";
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
} from "@/components/ui";
import { AppDispatch, RootReducer } from "@/store";
import { changePage } from "@/features/admin/slice/adminTrainerRequestSlice";
import {
  AdminChangeTrainerRequestStatus,
  getAdminTrainerRequestsApi,
} from "@/features/admin/api/adminTrainerRequestApi";
import usePaginatedData from "@/hooks/usePaginatedData";
import { TableSkeleton } from "@/components/skeletons";

const TrainerRequest: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.adminTrainerRequest
  );

  const { nextPage, paginatedData, previousPage } = usePaginatedData({
    data: users,
    currentPage,
    getDataApi: getAdminTrainerRequestsApi,
    changePageApi: changePage,
  });

  const refreshHandler = () => {
    dispatch(getAdminTrainerRequestsApi({ page: 1 }));
  };

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
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableSkeleton widths={[200, 150, 100, 50]} />
        ) : paginatedData.length === 0 ? (
          <div className="mt-10 mb-10 text-3xl">No users found</div>
        ) : (
          <TableBody>
            {paginatedData.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.userId.email}</TableCell>
                <TableCell>{user.userId.username}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell className="flex gap-3">
                  {user.status == "pending" ? (
                    <>
                      <button
                        className="text-3xl text-green-500"
                        onClick={() =>
                          dispatch(
                            AdminChangeTrainerRequestStatus({
                              userId: user.userId._id,
                              status: "approved",
                            })
                          )
                        }
                      >
                        <AiOutlineCheckCircle />
                      </button>
                      <button
                        className="text-3xl text-red-500"
                        onClick={() =>
                          dispatch(
                            AdminChangeTrainerRequestStatus({
                              userId: user.userId._id,
                              status: "rejected",
                            })
                          )
                        }
                      >
                        <AiFillCloseCircle />
                      </button>
                    </>
                  ) : (
                    <h1>No action</h1>
                  )}
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
