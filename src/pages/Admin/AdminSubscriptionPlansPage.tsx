import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdEdit, MdOutlineRefresh } from "react-icons/md";
import { IoEye, IoEyeOff } from "react-icons/io5";

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
  AdminSubscriptionPlanModal,
} from "@/components";

import { usePaginatedData, useConfirm } from "@/hooks";
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
import { ISubscriptionPlanSchema } from "@/validation/subscription.validation";
import { ISubscriptionFeature } from "@/types/subscriptionType";
import { getSubscriptionFeatures } from "@/api/subscriptionFeature.api";

const pageSize = 10;

const AdminSubscriptionPlansPage: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const confirm = useConfirm();

  const { currentPage, loading, subscriptionPlans, totalPages } = useSelector(
    (state: RootReducer) => state.adminSubscriptionPlans
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<{
    _id: string;
    plan: ISubscriptionPlanSchema;
  } | null>(null);
  const [subscriptionFeatures, setSubscriptionFeatures] = useState<
    Array<ISubscriptionFeature>
  >([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      const features = await getSubscriptionFeatures();
      if (!features) return;
      setSubscriptionFeatures(features);
    };
    fetchFeatures();
  }, []);

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

  const handleEdit = (_id: string, plan: ISubscriptionPlanSchema) => {
    setEditData({ _id, plan });
    setModalOpen(true);
  };

  const handleSubmitPlan = (data: ISubscriptionPlanSchema, _id?: string) => {
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
                        features: plan.features,
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
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        previousPage={previousPage}
        nextPage={nextPage}
      />

      <AdminSubscriptionPlanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitPlan}
        initialData={editData ? editData.plan : undefined}
        _id={editData ? editData._id : undefined}
        isEdit={!!editData}
        allFeatures={subscriptionFeatures}
      />
    </AdminLayout>
  );
};

export default AdminSubscriptionPlansPage;
