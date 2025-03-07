import { FC } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Pagination, SearchBox } from "@/components";
import AdminLayout from "@/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { CgUnblock, CgBlock, MdOutlineRefresh } from "@/assets/icons";
import { AppDispatch, RootReducer } from "@/store";
import {
  adminBlockUnblockUserApi,
  getAdminUsersApi,
} from "@/features/admin/api/adminUserApi";
import { changePage } from "@/features/admin/slice/adminUserSlice";
import usePaginatedData from "@/hooks/usePaginatedData";

const Users: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.adminUser
  );
  const { nextPage, previousPage, paginatedData, search, searchHandler } =
    usePaginatedData({
      data: users,
      currentPage,
      getDataApi: getAdminUsersApi,
      changePageApi: changePage,
    });

  const refreshHandler = () => {
    dispatch(getAdminUsersApi({ page: 1, search }));
  };

  return (
    <AdminLayout>
      <SearchBox
        placeholder="search by email"
        search={search}
        searchHandler={searchHandler}
      />

      <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
        <MdOutlineRefresh />
      </button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        {paginatedData.length === 0 ? (
          <div className="mt-10 mb-10 text-3xl">No users found</div>
        ) : (
          <TableBody>
            {paginatedData.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <button
                    className={`text-3xl ${
                      user.isBlocked ? "text-app-secondary" : "text-red-500"
                    }`}
                    onClick={() => dispatch(adminBlockUnblockUserApi(user._id))}
                  >
                    {user.isBlocked ? <CgUnblock /> : <CgBlock />}
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
    </AdminLayout>
  );
};

export default Users;
