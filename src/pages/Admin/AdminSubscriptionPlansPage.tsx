import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdEdit, MdOutlineRefresh } from "react-icons/md";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Pagination,
  SearchBox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
  ErrorText,
} from "@/components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { usePaginatedData } from "@/hooks";
import { useConfirm } from "@/hooks/useConfirm";
import { AppDispatch, RootReducer } from "@/store";
import { AdminLayout } from "@/layouts";
import {
  adminSubscriptionPlanAddApi,
  adminSubscriptionPlanEditApi,
  adminSubscriptionPlanListUnListApi,
  getAdminSubscriptionPlansApi,
} from "@/features/admin/api/adminSubscriptionPlanApi";
import { changePage } from "@/features/admin/slice/adminSubscriptionPlanSlice";
import { IoMdAddCircleOutline } from "react-icons/io";

const pageSize = 10;

const PlanSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  duration: z.number().min(1),
});

type PlanSchemaType = z.infer<typeof PlanSchema>;

const AdminSubscriptionPlansPage: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const confirm = useConfirm();

  const { currentPage, loading, subscriptionPlans, totalPages } = useSelector(
    (state: RootReducer) => state.adminSubscriptionPlans
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<{
    _id: string;
    plan: PlanSchemaType;
  } | null>(null);

  const {
    nextPage,
    paginatedData,
    previousPage,
    refreshHandler,
    search,
    searchHandler,
  } = usePaginatedData({
    data: subscriptionPlans,
    currentPage,
    changePageApi: changePage,
    getDataApi: getAdminSubscriptionPlansApi,
    size: pageSize,
  });

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (_id: string, plan: PlanSchemaType) => {
    setEditData({ _id, plan });
    setModalOpen(true);
  };

  const handleSubmitPlan = (data: PlanSchemaType, _id?: string) => {
    if (_id) {
      dispatch(
        adminSubscriptionPlanEditApi({ subscriptionPlanId: _id, ...data })
      );
    } else {
      dispatch(adminSubscriptionPlanAddApi(data));
    }
  };

  const toggleListStatus = (planId: string, listed: boolean) => {
    confirm(
      `Are you sure you want to ${listed ? "unlist" : "list"} this plan?`,
      () => {
        dispatch(adminSubscriptionPlanListUnListApi(planId));
      }
    );
  };

  return (
    <AdminLayout>
      <SearchBox
        placeholder="Search by plan title"
        search={search}
        searchHandler={searchHandler}
      />

      <div className="flex items-center justify-between my-6">
        <button className="text-3xl text-blue-500" onClick={refreshHandler}>
          <MdOutlineRefresh />
        </button>
        <button className="text-3xl text-white" onClick={handleAdd}>
          <IoMdAddCircleOutline />
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>List/Unlist</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableSkeleton widths={[200, 100, 100, 100, 50, 50]} />
        ) : (
          <TableBody>
            {paginatedData.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell>{plan.title}</TableCell>
                <TableCell>₹{plan.price}</TableCell>
                <TableCell>{plan.duration} days</TableCell>
                <TableCell className="text-2xl text-app-accent">
                  <button
                    onClick={() =>
                      handleEdit(plan._id, {
                        title: plan.title,
                        description: plan.description,
                        price: plan.price,
                        duration: plan.duration,
                      })
                    }
                  >
                    <MdEdit />
                  </button>
                </TableCell>
                <TableCell className="text-2xl">
                  <button
                    onClick={() => toggleListStatus(plan._id, plan.isListed)}
                    className={
                      plan.isListed ? "text-red-500" : "text-green-400"
                    }
                  >
                    {plan.isListed ? <IoEyeOff /> : <IoEye />}
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

      <PlanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitPlan}
        initialData={editData ? editData.plan : undefined}
        _id={editData ? editData._id : undefined}
        isEdit={!!editData}
      />
    </AdminLayout>
  );
};

interface PlanModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PlanSchemaType, _id?: string) => void;
  _id?: string;
  initialData?: Partial<PlanSchemaType>;
  isEdit?: boolean;
}

const PlanModal: FC<PlanModalProps> = ({
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
  } = useForm<PlanSchemaType>({
    resolver: zodResolver(PlanSchema),
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

  const handleFormSubmit = (data: PlanSchemaType) => {
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

export default AdminSubscriptionPlansPage;
