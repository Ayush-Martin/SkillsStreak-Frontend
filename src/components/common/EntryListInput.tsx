import { ErrorText, Input } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useMemo } from "react";
import { useForm } from "react-hook-form";
import { IoMdAddCircleOutline } from "react-icons/io";
import { z, ZodType } from "zod";

interface IEntryListInputProps {
  addEntry: (entry: string) => void;
  entryValidationRule: ZodType<string, any>;
}

const EntryListInput: FC<IEntryListInputProps> = ({
  addEntry,
  entryValidationRule,
}) => {
  const schema = useMemo(
    () =>
      z.object({
        entry: entryValidationRule,
      }),
    [entryValidationRule]
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const handleAdd = (data: { entry: string }) => {
    addEntry(data.entry);
    reset();
  };

  return (
    <div className="flex flex-col gap-0 my-3">
      <form className="flex gap-4" onSubmit={handleSubmit(handleAdd)}>
        <Input
          className="bg-transparent border w-60 border-app-border placeholder:text-muted-foreground"
          placeholder="enter text here"
          {...register("entry")}
        />
        <button
          type="submit"
          disabled={!!errors.entry}
          className="text-3xl text-white disabled:text-app-border"
        >
          <IoMdAddCircleOutline />
        </button>
      </form>
      {errors.entry && <ErrorText error={errors.entry.message!} />}
    </div>
  );
};

export default EntryListInput;
