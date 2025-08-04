import { ErrorText,Input } from "@/components";
import {
  AdminCategorySchema,
  IAdminCategorySchema,
} from "@/validation/category.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IoIosSave } from "react-icons/io";
import { RiFolderCloseFill } from "react-icons/ri";

interface IAdminEditCategoryProps {
  categoryId: string;
  categoryName: string;
  close: () => void;
  editCategory: (categoryId: string, categoryName: string) => void;
}

const AdminEditCategory: FC<IAdminEditCategoryProps> = ({
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
  } = useForm<IAdminCategorySchema>({
    resolver: zodResolver(AdminCategorySchema),
    defaultValues: {
      categoryName,
    },
  });

  const handleEditCategory = (data: IAdminCategorySchema) => {
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

export default AdminEditCategory;
