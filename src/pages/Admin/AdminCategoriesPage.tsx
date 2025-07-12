import { FC, use, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ErrorText,
  Pagination,
  SearchBox,
  TableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Input,
} from "@/components";
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
  adminCategoryAddApi,
  adminCategoryEditApi,
  adminCategoryListUnListApi,
  getAdminCategoriesApi,
} from "@/features/admin/api/adminCategoryApi";
import { changePage } from "@/features/admin/slice/adminCategorySlice";
import { AdminLayout } from "@/layouts";
import { AppDispatch, RootReducer } from "@/store";
import { CategoryNameValidationRule } from "@/utils/validationRules";
import { usePaginatedData } from "@/hooks";
import { useConfirm } from "@/hooks/useConfirm";

const PAGE_SIZE = 5;

const CategorySchema = z.object({
  categoryName: CategoryNameValidationRule,
});

type CategorySchemaType = z.infer<typeof CategorySchema>;

interface ICategoryEditProps {
  categoryId: string;
  categoryName: string;
  close: () => void;
  editCategory: (categoryId: string, categoryName: string) => void;
}

interface IAddCategoryProps {
  addCategory: (categoryName: string) => void;
}

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
      <AddCategory addCategory={addCategory} />
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
                    <CategoryEdit
                      categoryId={_id}
                      categoryName={categoryName}
                      close={() => setSelected(null)}
                      editCategory={editCategory}
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
      />
    </AdminLayout>
  );
};

const CategoryEdit: FC<ICategoryEditProps> = ({
  categoryId,
  categoryName,
  close,
  editCategory,
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

  const handleEditCategory = (data: CategorySchemaType) => {
    editCategory(categoryId, data.categoryName);
  };

  return (
    <form className="flex-col" onSubmit={handleSubmit(handleEditCategory)}>
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

const AddCategory: FC<IAddCategoryProps> = ({ addCategory }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(CategorySchema),
    mode: "onBlur",
  });

  const handleAddCategory = (data: CategorySchemaType) => {
    addCategory(data.categoryName);
  };

  return (
    <div className="flex flex-col gap-0 my-3">
      <form className="flex gap-4" onSubmit={handleSubmit(handleAddCategory)}>
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

export default Categories;
