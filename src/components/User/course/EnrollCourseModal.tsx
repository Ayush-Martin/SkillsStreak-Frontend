import { Button } from "@/components/ui";
import { X, Wallet, CreditCard } from "lucide-react";
import { FC } from "react";

interface IEnrollCourseModalProps {
  title: string;
  amount: number;
  thumbnail: string;
  close: () => void;
  walletCheckout: () => void;
  stripeCheckout: () => void;
}

const EnrollCourseModal: FC<IEnrollCourseModalProps> = ({
  title,
  amount,
  thumbnail,
  close,
  walletCheckout,
  stripeCheckout,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60 p-4 animate-in fade-in duration-300">
      <div className="relative bg-gradient-to-br from-zinc-900 to-gray-900 text-white w-full max-w-lg rounded-3xl shadow-2xl p-8 space-y-8 border border-white/10 animate-in slide-in-from-bottom-4 duration-500">
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors duration-200 group"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Thumbnail Image */}
        <div className="w-full h-52 overflow-hidden rounded-2xl ring-1 ring-white/10">
          <img
            src={thumbnail}
            alt="Course Thumbnail"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Course Info */}
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold leading-tight">{title}</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-purple-400">
              ₹{amount}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={walletCheckout}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Wallet className="w-5 h-5" />
            Pay with Wallet
          </Button>
          <Button
            onClick={stripeCheckout}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <CreditCard className="w-5 h-5" />
            Pay with Card
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnrollCourseModal;
