import { ITransaction } from "@/types/transactionType";
import { FC } from "react";
import Modal from "./Modal";
import { Badge } from "../ui/badge";
import {
  CreditCard,
  Wallet,
  User,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Receipt,
  Package,
} from "lucide-react";
import { BiRupee } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { Button } from "../ui";

interface ITransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction: ITransaction;
  onCancel?: () => void;
}

const TransactionModal: FC<ITransactionModalProps> = ({
  open,
  onClose,
  transaction,
  onCancel,
}) => {
  const { _id, role } = useSelector((state: RootReducer) => state.user);
  if (!open) return null;

  return (
    <Modal onClose={onClose} title="Transaction Details" heightPx={600}>
      <div className="space-y-6 font-sans">
        {/* Amount + Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#111425] p-3 sm:p-4 md:p-5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 sm:gap-3">
            <BiRupee className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
            <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {transaction.amount.toFixed(2)}
            </span>
          </div>
          <Badge
            className={`mt-2 sm:mt-0 flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-xl tracking-wide ${
              transaction.status === "completed"
                ? "bg-green-500/20 text-green-400 border border-green-400/30"
                : transaction.status === "pending"
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
                : "bg-red-500/20 text-red-400 border border-red-400/30"
            }`}
          >
            {transaction.status === "completed" ? (
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : transaction.status === "pending" ? (
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            {transaction.status.toUpperCase()}
          </Badge>
        </div>

        {/* Payer / Receiver */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-[#111425] p-3 sm:p-4 rounded-2xl border border-white/10">
            <h3 className="text-xs sm:text-xs md:text-sm tracking-wider text-gray-400 uppercase mb-2 flex items-center gap-2">
              <User className="w-4 h-4" /> Payer
            </h3>
            <p className="text-white font-semibold text-sm ">
              {!transaction.payer
                ? "Admin"
                : transaction.payer._id === _id
                ? "You"
                : transaction.payer.email}
            </p>
          </div>
          <div className="bg-[#111425] p-3 sm:p-4 rounded-2xl border border-white/10">
            <h3 className="text-xs sm:text-xs md:text-sm tracking-wider text-gray-400 uppercase mb-2 flex items-center gap-2">
              <User className="w-4 h-4" /> Receiver
            </h3>
            <p className="text-white font-semibold text-sm ">
              {!transaction.receiver
                ? "Admin"
                : transaction.receiver._id === _id
                ? "You"
                : transaction.receiver.email}
            </p>
          </div>
        </div>

        {/* Course */}
        {transaction.course && (
          <div className="bg-[#111425] p-3 sm:p-4 rounded-2xl border border-white/10">
            <h3 className="text-xs sm:text-xs md:text-sm tracking-wider text-gray-400 uppercase mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Course
            </h3>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src={transaction.course.thumbnail}
                alt={transaction.course.title}
                className="w-full max-h-48 sm:max-h-64 object-cover"
              />
            </div>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-white font-semibold text-base sm:text-lg line-clamp-1">
                {transaction.course.title}
              </p>
              <Link
                to={`${role === "admin" ? "/admin/courses" : "/courses"}/${
                  transaction.course._id
                }`}
                className="text-sm sm:text-base font-medium text-blue-400 hover:underline"
              >
                View Course →
              </Link>
            </div>
          </div>
        )}

        {/* Subscription */}
        {transaction.subscription && (
          <div className="bg-[#111425] p-3 sm:p-4 rounded-2xl border border-white/10">
            <h3 className="text-xs sm:text-xs md:text-sm tracking-wider text-gray-400 uppercase mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" /> Subscription
            </h3>
            <p className="text-white font-semibold text-sm sm:text-base">
              {transaction.subscription.title}
            </p>
          </div>
        )}

        {/* Method + Commission + Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-[#111425] p-3 sm:p-4 rounded-2xl border border-white/10">
            <h3 className="text-xs sm:text-xs md:text-sm tracking-wider text-gray-400 uppercase mb-2 flex items-center gap-2">
              <Receipt className="w-4 h-4" /> Type
            </h3>
            <p className="text-white font-semibold capitalize text-sm sm:text-base">
              {transaction.type}
            </p>
          </div>

          {transaction.method && (
            <div className="bg-[#111425] p-3 sm:p-4 rounded-2xl border border-white/10">
              <h3 className="text-xs sm:text-xs md:text-sm tracking-wider text-gray-400 uppercase mb-2 flex items-center gap-2">
                {transaction.method === "stripe" ? (
                  <CreditCard className="w-4 h-4" />
                ) : (
                  <Wallet className="w-4 h-4" />
                )}
                Method
              </h3>
              <p className="text-white font-semibold capitalize text-sm sm:text-base">
                {transaction.method}
              </p>
            </div>
          )}

          {transaction.adminCommission && (
            <div className="bg-[#111425] p-3 sm:p-4 rounded-2xl border border-white/10">
              <h3 className="text-xs sm:text-xs md:text-sm tracking-wider text-gray-400 uppercase mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Commission
              </h3>
              <p className="text-white font-semibold text-sm sm:text-base">
                ₹{transaction.adminCommission.toFixed(2)}
              </p>
            </div>
          )}

          <div className="bg-[#111425] p-3 sm:p-4 rounded-2xl border border-white/10">
            <h3 className="text-xs sm:text-xs md:text-sm tracking-wider text-gray-400 uppercase mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" /> Date
            </h3>
            <p className="text-white font-semibold text-sm sm:text-base">
              {new Date(transaction.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      {transaction.status === "on_process" &&
        transaction.type === "course_purchase" &&
        _id === transaction.payer?._id && (
          <div className="flex justify-end mt-6">
            <Button
              onClick={onCancel}
              variant="destructive"
              className="text-sm sm:text-base px-4 sm:px-6 py-2 rounded-lg"
            >
              Cancel Transaction
            </Button>
          </div>
        )}
    </Modal>
  );
};

export default TransactionModal;
