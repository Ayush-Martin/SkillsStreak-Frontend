import { Button, ErrorText, Input } from "@/components";
import {
  ISubscriptionPlanSchema,
  SubscriptionPlanSchema,
} from "@/validation/subscription.validation";
import { ISubscriptionFeature } from "@/types/subscriptionType";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

interface IAdminSubscriptionPlanModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ISubscriptionPlanSchema, _id?: string) => void;
  _id?: string;
  initialData?: Partial<ISubscriptionPlanSchema>;
  isEdit?: boolean;
  allFeatures?: ISubscriptionFeature[];
}

const AdminSubscriptionPlanModal: FC<IAdminSubscriptionPlanModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEdit,
  _id,
  allFeatures = [],
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    initialData?.features || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ISubscriptionPlanSchema>({
    resolver: zodResolver(SubscriptionPlanSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      duration: 30,
      features: [],
    },
  });

  // Load form data when modal opens
  useEffect(() => {
    if (open) {
      reset({
        title: initialData?.title || "",
        description: initialData?.description || "",
        price: initialData?.price ?? 0,
        duration: initialData?.duration ?? 30,
        features: initialData?.features ?? [],
      });
      setSelectedFeatures(initialData?.features ?? []);
    }
  }, [open, initialData, reset]);

  const toggleFeature = (featureId: string) => {
    const updated = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter((id) => id !== featureId)
      : [...selectedFeatures, featureId];

    setSelectedFeatures(updated);
    setValue("features", updated, { shouldValidate: true });
  };

  const handleFormSubmit = (data: ISubscriptionPlanSchema) => {
    data.features = selectedFeatures;
    onSubmit(data, _id);
    onClose();
  };

  if (!open) return null; // mimic QuestionModal conditional rendering

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-[#0c0f1a] border border-white/10 rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {isEdit ? "Edit Subscription Plan" : "Add Subscription Plan"}
          </h2>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Title</label>
            <Input
              placeholder="Title"
              {...register("title")}
              className="bg-[#141926] border-white/10 text-white"
            />
            {errors.title && <ErrorText error={errors.title.message!} />}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">
              Description
            </label>
            <Input
              placeholder="Description"
              {...register("description")}
              className="bg-[#141926] border-white/10 text-white"
            />
            {errors.description && (
              <ErrorText error={errors.description.message!} />
            )}
          </div>

          {/* Price */}
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">
              Price (USD)
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="Price"
              {...register("price", { valueAsNumber: true })}
              className="bg-[#141926] border-white/10 text-white"
            />
            {errors.price && <ErrorText error={errors.price.message!} />}
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">
              Duration (days)
            </label>
            <Input
              type="number"
              placeholder="Duration"
              {...register("duration", { valueAsNumber: true })}
              className="bg-[#141926] border-white/10 text-white"
            />
            {errors.duration && <ErrorText error={errors.duration.message!} />}
          </div>

          {/* Features */}
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">
              Select Features
            </label>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border border-white/10 p-3 rounded">
              {allFeatures.length === 0 && (
                <p className="text-sm text-gray-400">No features available</p>
              )}
              {allFeatures.map((f) => (
                <label
                  key={f.id}
                  className="flex items-center gap-2 p-1 hover:bg-gray-800 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(f.id)}
                    onChange={() => toggleFeature(f.id)}
                    className="w-4 h-4 accent-violet-500"
                  />
                  <p className="font-medium">{f.title}</p>
                </label>
              ))}
            </div>
            {errors.features && <ErrorText error={errors.features.message!} />}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isEdit ? "Update Plan" : "Add Plan"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminSubscriptionPlanModal;
