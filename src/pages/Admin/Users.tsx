import { Pagination, SearchBox } from "@/components";
import AdminLayout from "@/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CgUnblock, CgBlock } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootReducer } from "@/store";
import { useEffect, useState, useMemo } from "react";
import {
  adminBlockUnblockUserApi,
  getAdminUsersApi,
} from "@/features/admin/api/adminUserApi";
import { changePage } from "@/features/admin/slice/adminUserSlice";

const Users = () => {
  const { users, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.adminUser
  );
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");

  const pageSize = 1;
  const startIndex = (currentPage - 1) * pageSize;

  useEffect(() => {
    if (!users.length) {
      dispatch(getAdminUsersApi({ page: 1, search }));
    }
  }, [dispatch, search, users.length]);

  const paginatedUsers = useMemo(() => {
    return users.slice(startIndex, startIndex + pageSize);
  }, [users, startIndex, pageSize]);

  const previousPage = () => {
    if (currentPage > 1) dispatch(changePage(currentPage - 1));
  };

  const nextPage = () => {
    if (users.length > startIndex + pageSize) {
      dispatch(changePage(currentPage + 1));
    } else {
      dispatch(getAdminUsersApi({ page: currentPage + 1, search }));
    }
  };

  const searchHandler = (searchInput: string) => {
    setSearch(searchInput);
    dispatch(getAdminUsersApi({ page: 1, search: searchInput }));
  };

  return (
    <AdminLayout>
      <SearchBox
        placeholder="search by email"
        search={search}
        searchHandler={searchHandler}
      />

      <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>User Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Enrolled Courses</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        {paginatedUsers.length === 0 ? (
          <div className="mt-10 mb-10 text-3xl">No users found</div>
        ) : (
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell></TableCell>
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
