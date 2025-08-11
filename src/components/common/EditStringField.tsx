import { ErrorText, Input } from "@/components";

import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IoIosSave } from "react-icons/io";
import { RiFolderCloseFill } from "react-icons/ri";
import { z, ZodType } from "zod";

interface IAdminEditCategoryProps {
  defaultValue: string;
  close: () => void;
  save: (value: string) => void;
  placeholder: string;
  entryValidationRule: ZodType<string, any>;
}

const AdminEditCategory: FC<IAdminEditCategoryProps> = ({
  close,
  defaultValue,
  entryValidationRule,
  placeholder,
  save,
}) => {
  const Schema = z.object({
    entry: entryValidationRule,
  });

  type ISchema = z.infer<typeof Schema>;

  const {
    handleSubmit,
    formState: { errors },
    register,
    trigger,
  } = useForm<ISchema>({
    resolver: zodResolver(Schema),
    defaultValues: {
      entry: defaultValue,
    },
  });

  const submit = (data: ISchema) => {
    save(data.entry);
  };

  return (
    <form className="flex-col" onSubmit={handleSubmit(submit)}>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          {...register("entry")}
          className="w-30 bg-app-border"
          onBlur={() => trigger("entry")}
        />
        <button type="submit" className="text-xl text-app-secondary">
          <IoIosSave />
        </button>
        <button onClick={close} className="text-xl text-app-tertiary">
          <RiFolderCloseFill />
        </button>
      </div>
      {errors.entry && <ErrorText error={errors.entry.message!} />}
    </form>
  );
};

export default AdminEditCategory;
