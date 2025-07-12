import { ITransaction } from "@/features/user/slice/transactionSlice";
import { RootReducer } from "@/store";
import { X } from "lucide-react";
import { FC } from "react";
import { useSelector } from "react-redux";

interface TransactionDetailsModalProps {
  transaction: ITransaction | null;
  onClose: () => void;
  cancelPurchase?: (transactionId: string) => void;
}

const TransactionDetailsModal: FC<TransactionDetailsModalProps> = ({
  transaction,
  onClose,
  cancelPurchase,
}) => {
  const user = useSelector((state: RootReducer) => state.user);
  if (!transaction) return null;

  const {
    _id,
    type,
    amount,
    method,
    status,
    payer,
    receiver,
    course,
    adminCommission,
  } = transaction;

  const handleCancel = () => {
    cancelPurchase?.(_id);
    onClose();
  };

  const statusColor = {
    completed: "bg-green-700",
    pending: "bg-yellow-700",
    canceled: "bg-red-700",
    on_process: "bg-blue-700",
    default: "bg-gray-700",
  };

  const getStatusColor =
    statusColor[status as keyof typeof statusColor] || statusColor.default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-2xl bg-[#0f111a] text-white rounded-2xl shadow-2xl border border-[#2e3440] p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[#1e2433] rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-bold text-center mb-8 text-white border-b border-[#2e3440] pb-4">
          Transaction Details
        </h2>

        <div className="grid gap-5 text-sm">
          <DetailRow label="Transaction ID" value={_id} />
          <DetailRow label="Type" value={type} />
          <DetailRow label="Amount" value={`₹${amount}`} />
          <DetailRow label="Method" value={method} />
          {adminCommission && (
            <DetailRow label="Admin Commission" value={`₹${adminCommission}`} />
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Status</span>
            <span
              className={`px-3 py-1 rounded-lg text-white font-semibold text-sm ${getStatusColor}`}
            >
              {status}
            </span>
          </div>

          {payer?.email && (
            <DetailRow
              label="Payer"
              value={`${payer.role === "admin" ? "Admin" : payer.email}`}
            />
          )}

          {receiver?.email && (
            <DetailRow
              label="Receiver"
              value={`${receiver.role === "admin" ? "Admin" : receiver.email}`}
            />
          )}
        </div>

        {course && (
          <>
            <hr className="my-6 border-[#2e3440]" />
            <p className="text-sm font-semibold text-white mb-2">Course</p>
            <div className="flex items-center gap-4 bg-[#1a1d2b] p-4 rounded-xl border border-[#2c3244]">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-16 h-16 rounded-lg object-cover border border-gray-700"
              />
              <div className="flex-1">
                <p className="text-base font-semibold text-white leading-tight">
                  {course.title}
                </p>
              </div>
            </div>
          </>
        )}

        {status === "on_process" &&
          cancelPurchase &&
          user._id === payer._id && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleCancel}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition font-semibold text-sm shadow-md"
              >
                Cancel Payment
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

const DetailRow: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="grid grid-cols-2 gap-4 items-start">
    <span className="text-gray-400 whitespace-nowrap">{label}</span>
    <span className="text-white font-medium break-all text-right">{value}</span>
  </div>
);

export default TransactionDetailsModal;
