import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  ErrorText,
  Input,
} from "@/components";
import {
  ISubscriptionPlanSchema,
  SubscriptionPlanSchema,
} from "@/validation/subscription.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";

interface IAdminSubscriptionPlanModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ISubscriptionPlanSchema, _id?: string) => void;
  _id?: string;
  initialData?: Partial<ISubscriptionPlanSchema>;
  isEdit?: boolean;
}

const AdminSubscriptionPlanModal: FC<IAdminSubscriptionPlanModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEdit,
  _id,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISubscriptionPlanSchema>({
    resolver: zodResolver(SubscriptionPlanSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price ?? 0,
      duration: initialData?.duration ?? 30,
    },
  });

  useEffect(() => {
    reset({
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price ?? 0,
      duration: initialData?.duration ?? 30,
    });
  }, [initialData, reset]);

  const handleFormSubmit = (data: ISubscriptionPlanSchema) => {
    onSubmit(data, _id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0d17] border border-app-border text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? "Edit Subscription Plan" : "Add Subscription Plan"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          <Input
            placeholder="Title"
            {...register("title")}
            className="bg-transparent border border-app-border"
          />
          {errors.title && <ErrorText error={errors.title.message!} />}

          <Input
            placeholder="Description"
            {...register("description")}
            className="bg-transparent border border-app-border"
          />
          {errors.description && (
            <ErrorText error={errors.description.message!} />
          )}

          <Input
            type="number"
            step="0.01"
            placeholder="Price"
            {...register("price", { valueAsNumber: true })}
            className="bg-transparent border border-app-border"
          />
          {errors.price && <ErrorText error={errors.price.message!} />}

          <Input
            type="number"
            placeholder="Duration (in days)"
            {...register("duration", { valueAsNumber: true })}
            className="bg-transparent border border-app-border"
          />
          {errors.duration && <ErrorText error={errors.duration.message!} />}

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-app-secondary text-white"
          >
            {isEdit ? "Update Plan" : "Add Plan"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSubscriptionPlanModal;
