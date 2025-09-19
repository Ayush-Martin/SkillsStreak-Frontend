import { FC, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  Pagination,
  SearchBox,
  TableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  EditStringField,
  EntryListInput,
} from "@/components";
import { IoEye, IoEyeOff, MdEdit, MdOutlineRefresh } from "@/assets/icons";
import {
  adminCategoryAddApi,
  adminCategoryEditApi,
  adminCategoryListUnListApi,
  getAdminCategoriesApi,
} from "@/features/admin/api/adminCategoryApi";
import { changePage } from "@/features/admin/slice/adminCategorySlice";
import { AdminLayout } from "@/layouts";
import { AppDispatch, RootReducer } from "@/store";
import { usePaginatedData, useConfirm } from "@/hooks";
import { CategoryNameValidationRule } from "@/utils/validationRules";

const PAGE_SIZE = 5;

const Categories: FC = () => {
  const confirm = useConfirm();
  const dispatch: AppDispatch = useDispatch();
  const [selected, setSelected] = useState<string | null>();
  const { categories, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.adminCategory
  );

  const {
    nextPage,
    paginatedData,
    previousPage,
    search,
    searchHandler,
    refreshHandler,
  } = usePaginatedData({
    data: categories,
    currentPage,
    changePageApi: changePage,
    getDataApi: getAdminCategoriesApi,
    size: PAGE_SIZE,
  });

  const addCategory = (categoryName: string) => {
    dispatch(adminCategoryAddApi(categoryName));
  };

  const editCategory = (categoryId: string, categoryName: string) => {
    dispatch(adminCategoryEditApi({ categoryId, categoryName }));
  };

  const listUnListCategory = (categoryId: string, listed: boolean) => {
    confirm(
      `Are you sure you want to ${listed ? "unlist" : "list"} this category?`,
      () => {
        dispatch(adminCategoryListUnListApi(categoryId));
      }
    );
  };

  return (
    <AdminLayout>
      <SearchBox
        placeholder="search by category name"
        search={search}
        searchHandler={searchHandler}
      />

      <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
        <MdOutlineRefresh />
      </button>
      {/* <AdminAddCategory addCategory={addCategory} /> */}
      <EntryListInput
        addEntry={addCategory}
        entryValidationRule={CategoryNameValidationRule}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Name</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>List/UnList</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableSkeleton widths={[200, 100, 100, 100]} />
        ) : (
          <TableBody>
            {paginatedData.map(({ _id, categoryName, isListed }) => (
              <TableRow key={_id}>
                <TableCell>
                  {selected == _id ? (
                    <EditStringField
                      defaultValue={categoryName}
                      placeholder="Enter Category Name"
                      entryValidationRule={CategoryNameValidationRule}
                      save={(categoryName) => editCategory(_id, categoryName)}
                      close={() => setSelected(null)}
                    />
                  ) : (
                    categoryName
                  )}
                </TableCell>
                <TableCell>num</TableCell>
                <TableCell className="text-3xl text-app-accent">
                  <button onClick={() => setSelected(_id)}>
                    <MdEdit />
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    className={`text-3xl ${
                      isListed ? "text-red-500" : "text-app-secondary"
                    }`}
                    onClick={() => listUnListCategory(_id, isListed)}
                  >
                    {isListed ? <IoEyeOff /> : <IoEye />}
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
        loading={loading}
      />
    </AdminLayout>
  );
};

export default Categories;
