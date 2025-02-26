import { Pagination } from "@/components";
import AdminLayout from "@/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdOutlineRefresh } from "react-icons/md";
import { AiOutlineCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootReducer } from "@/store";
import { FC, useEffect, useMemo } from "react";
import { changePage } from "@/features/admin/slice/adminTrainerRequetsSlice";
import {
  AdminChangeTrainerRequestStatus,
  getAdminTrainerRequestsApi,
} from "@/features/admin/api/adminTrainerRequestApi";
import { RECORDS_PER_PAGE } from "@/constants/general";

const TrainerRequest: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.adminTrainerRequest
  );

  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;

  useEffect(() => {
    if (!users.length) {
      dispatch(getAdminTrainerRequestsApi({ page: 1 }));
    }
  }, [dispatch, users.length]);

  const paginatedUsers = useMemo(() => {
    return users.slice(startIndex, startIndex + RECORDS_PER_PAGE);
  }, [users, startIndex]);

  const previousPage = () => {
    if (currentPage > 1) dispatch(changePage(currentPage - 1));
  };

  const nextPage = () => {
    if (users.length > startIndex + RECORDS_PER_PAGE) {
      dispatch(changePage(currentPage + 1));
    } else {
      dispatch(getAdminTrainerRequestsApi({ page: currentPage + 1 }));
    }
  };

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

        {paginatedUsers.length === 0 ? (
          <div className="mt-10 mb-10 text-3xl">No users found</div>
        ) : (
          <TableBody>
            {paginatedUsers.map((user) => (
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
