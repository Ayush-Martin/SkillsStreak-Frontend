import { FaWallet } from "react-icons/fa6";
import { FC } from "react";
import { Button } from "@/components";

interface IWalletCardProp {
  haveStripeId: boolean;
  balance: number;
  onRedeem: () => void;
  onSetupAccount: () => void;
}

const WalletCard: FC<IWalletCardProp> = ({
  balance,
  haveStripeId,
  onRedeem,
  onSetupAccount,
}) => {
  const canRedeem = haveStripeId && balance > 0;

  return (
    <div className="h-auto w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between items-center transition duration-300 hover:scale-[1.02] hover:shadow-green-400/20">
      {/* Icon */}
      <div className="p-4 rounded-full mb-4 bg-white/10">
        <FaWallet className="text-4xl text-blue-400" />
      </div>

      {/* Main Title */}
      <p className="text-sm text-white/60">Wallet Balance</p>
      <h1 className="text-4xl font-bold mt-2 text-green-400">₹ {balance}</h1>

      {/* Action Button */}
      {haveStripeId ? (
        <Button
          disabled={!canRedeem}
          onClick={onRedeem}
          className={`mt-5 w-full ${
            canRedeem
              ? "bg-gradient-to-br from-green-400/40 to-green-600/50 border border-green-400/30 text-green-100 hover:from-green-500/40 hover:to-green-700/60 hover:border-green-400/60"
              : "bg-white/10 text-white/30 border border-white/10 cursor-not-allowed"
          } transition-all duration-200 backdrop-blur-md shadow-md rounded-xl px-6 py-2 text-base font-semibold`}
        >
          {canRedeem ? "Redeem" : "Not Eligible"}
        </Button>
      ) : (
        <Button
          onClick={onSetupAccount}
          className="mt-5 w-full bg-gradient-to-br from-blue-500/30 to-blue-700/40 border border-blue-400/30 text-blue-100 hover:from-blue-500/50 hover:to-blue-700/60 hover:border-blue-400/50 transition-all duration-200 backdrop-blur-md shadow-md rounded-xl px-6 py-2 text-base font-semibold"
        >
          Setup Stripe Account
        </Button>
      )}
    </div>
  );
};

export default WalletCard;
