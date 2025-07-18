import { FC } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  HighlightText,
  Pagination,
  ProfileImage,
  SearchBox,
} from "@/components";
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
import { TableSkeleton } from "@/components/skeletons";
import { useConfirm } from "@/hooks/useConfirm";
import { Link } from "react-router-dom";

const pageSize = 5;

const Users: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const confirm = useConfirm();
  const { users, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.adminUser
  );
  const {
    nextPage,
    previousPage,
    paginatedData,
    search,
    searchHandler,
    refreshHandler,
  } = usePaginatedData({
    data: users,
    currentPage,
    getDataApi: getAdminUsersApi,
    changePageApi: changePage,
    size: pageSize,
  });

  const blockUnblockUser = (userId: string, blocked: boolean) => {
    confirm(
      `Are you sure you want to ${blocked ? "block" : "unblock"} this user?`,
      () => {
        dispatch(adminBlockUnblockUserApi(userId));
      }
    );
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
            <TableHead>User</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>View</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableSkeleton widths={[200, 150, 100, 50]} />
        ) : (
          <TableBody>
            {paginatedData.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <ProfileImage
                    profileImage={user.profileImage}
                    size={16}
                    textSize="4xl"
                  />
                </TableCell>
                <TableCell>
                  <HighlightText search={search} text={user.email} />
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <button
                    className={`text-3xl ${
                      user.isBlocked ? "text-app-secondary" : "text-red-500"
                    }`}
                    onClick={() => blockUnblockUser(user._id, user.isBlocked)}
                  >
                    {user.isBlocked ? <CgUnblock /> : <CgBlock />}
                  </button>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/admin/users/${user._id}`}
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

export default Users;
