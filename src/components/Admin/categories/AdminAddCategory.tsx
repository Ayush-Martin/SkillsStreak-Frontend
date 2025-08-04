import { ErrorText } from "@/components/common";
import { Input } from "@/components/ui";
import {
  AdminCategorySchema,
  IAdminCategorySchema,
} from "@/validation/category.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IoMdAddCircleOutline } from "react-icons/io";

interface IAdminAddCategoryProps {
  addCategory: (categoryName: string) => void;
}
const AdminAddCategory: FC<IAdminAddCategoryProps> = ({ addCategory }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IAdminCategorySchema>({
    resolver: zodResolver(AdminCategorySchema),
    mode: "onBlur",
  });

  const handleAddCategory = (data: IAdminCategorySchema) => {
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

export default AdminAddCategory;
