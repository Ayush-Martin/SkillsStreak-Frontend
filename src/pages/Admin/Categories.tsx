import { ErrorText, Pagination, SearchBox } from "@/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RECORDS_PER_PAGE } from "@/constants/general";
import {
  adminCategoryEditApi,
  adminCategoryListUnListApi,
  getAdminCategoriesApi,
} from "@/features/admin/api/adminCategoryApi";
import { changePage } from "@/features/admin/slice/adminCategorySlice";
import AdminLayout from "@/layouts/AdminLayout";
import { AppDispatch, RootReducer } from "@/store";
import { FC, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosSave } from "react-icons/io";
import { RiFolderCloseFill } from "react-icons/ri";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { CategoryNameValidationRule } from "@/utils/validationRules";

const CategoryEditSchema = z.object({
  categoryName: CategoryNameValidationRule,
});

type CategoryEditSchemaType = z.infer<typeof CategoryEditSchema>;

interface ICategoryEdit {
  categoryId: string;
  categoryName: string;
  close: () => void;
  submit: (data: { categoryId: string; categoryName: string }) => void;
}

const CategoryEdit: FC<ICategoryEdit> = ({
  categoryId,
  categoryName,
  close,
  submit,
}) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    trigger,
  } = useForm<CategoryEditSchemaType>({
    resolver: zodResolver(CategoryEditSchema),
    defaultValues: {
      categoryName,
    },
  });

  return (
    <form
      className="flex-col"
      onSubmit={handleSubmit(({ categoryName }) =>
        submit({ categoryId, categoryName })
      )}
    >
      <div className="flex gap-2">
        <Input
          placeholder="Enter category name"
          {...register("categoryName")}
          className="w-30 bg-app-border"
          onBlur={() => trigger("categoryName")}
        />
        <button type="submit" className="text-xl text-app-secondary">
          <IoIosSave />
        </button>
        <button onClick={close} className="text-xl text-app-tertiary">
          <RiFolderCloseFill />
        </button>
      </div>
      {errors.categoryName && (
        <ErrorText error={errors.categoryName.message!} />
      )}
    </form>
  );
};

const Categories: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>();
  const { categories, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.adminCategory
  );

  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;

  useEffect(() => {
    if (!categories.length) {
      dispatch(getAdminCategoriesApi({ page: 1, search }));
    }
  }, [dispatch, search, categories.length]);

  const paginatedCategories = useMemo(() => {
    return categories.slice(startIndex, startIndex + RECORDS_PER_PAGE);
  }, [categories, startIndex]);

  const previousPage = () => {
    if (currentPage > 1) dispatch(changePage(currentPage - 1));
  };

  const nextPage = () => {
    if (categories.length > startIndex + RECORDS_PER_PAGE) {
      dispatch(changePage(currentPage + 1));
    } else {
      dispatch(getAdminCategoriesApi({ page: currentPage + 1, search }));
    }
  };

  const searchHandler = (searchInput: string) => {
    setSearch(searchInput);
    dispatch(getAdminCategoriesApi({ page: 1, search: searchInput }));
  };

  const refreshHandler = () => {
    dispatch(getAdminCategoriesApi({ page: 1, search }));
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Name</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>List/UnList</TableHead>
          </TableRow>
        </TableHeader>

        {paginatedCategories.length === 0 ? (
          <div className="mt-10 mb-10 text-3xl">No categories found</div>
        ) : (
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  {selected == category._id ? (
                    <CategoryEdit
                      categoryId={category._id}
                      categoryName={category.categoryName}
                      close={() => setSelected(null)}
                      submit={(data) => {
                        dispatch(adminCategoryEditApi(data));
                        setSelected(null);
                      }}
                    />
                  ) : (
                    category.categoryName
                  )}
                </TableCell>
                <TableCell>num</TableCell>
                <TableCell className="text-3xl text-app-accent">
                  <button onClick={() => setSelected(category._id)}>
                    <MdEdit />
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    className={`text-3xl ${
                      category.isListed ? "text-red-500" : "text-app-secondary"
                    }`}
                    onClick={() =>
                      dispatch(adminCategoryListUnListApi(category._id))
                    }
                  >
                    {category.isListed ? <IoEyeOff /> : <IoEye />}
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

export default Categories;
