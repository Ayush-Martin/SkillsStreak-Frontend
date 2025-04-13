import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

import { ErrorText, Pagination, SearchBox } from "@/components";
import {
  IoIosSave,
  RiFolderCloseFill,
  IoEye,
  IoEyeOff,
  MdEdit,
  MdOutlineRefresh,
  IoMdAddCircleOutline,
} from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Input,
} from "@/components/ui";
import {
  adminCategoryAddApi,
  adminCategoryEditApi,
  adminCategoryListUnListApi,
  getAdminCategoriesApi,
} from "@/features/admin/api/adminCategoryApi";
import { changePage } from "@/features/admin/slice/adminCategorySlice";
import AdminLayout from "@/layouts/AdminLayout";
import { AppDispatch, RootReducer } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryNameValidationRule } from "@/utils/validationRules";
import usePaginatedData from "@/hooks/usePaginatedData";
import { TableSkeleton } from "@/components/skeletons";

const PAGE_SIZE = 5;

const CategorySchema = z.object({
  categoryName: CategoryNameValidationRule,
});

type CategorySchemaType = z.infer<typeof CategorySchema>;

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
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(CategorySchema),
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

const AddCategory: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(CategorySchema),
    mode: "onBlur",
  });

  const addCategory = (data: CategorySchemaType) => {
    dispatch(adminCategoryAddApi(data.categoryName));
  };

  return (
    <div className="flex flex-col gap-0 my-3">
      <form className="flex gap-4" onSubmit={handleSubmit(addCategory)}>
        <Input
          className="bg-transparent border w-60 border-app-border placeholder:text-muted-foreground"
          placeholder="enter text here"
          {...register("categoryName")}
        />
        <button
          disabled={!!errors.categoryName}
          className="text-3xl text-white disabled:text-app-border"
        >
          <IoMdAddCircleOutline />
        </button>
      </form>
      {errors.categoryName && (
        <ErrorText error={errors.categoryName.message!} />
      )}
    </div>
  );
};

const Categories: FC = () => {
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
      <AddCategory />
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
        ) : paginatedData.length === 0 ? (
          <div className="mt-10 mb-10 text-3xl">No categories found</div>
        ) : (
          <TableBody>
            {paginatedData.map((category) => (
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
