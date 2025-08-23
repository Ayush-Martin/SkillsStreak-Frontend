import { StatCard } from "@/components";
import { FC } from "react";
import { FaMoneyBillWave, FaCrown } from "react-icons/fa6";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";

interface IRevenueCard {
  amount: number;
}

const RevenueCard: FC<IRevenueCard> = ({ amount }) => {
  return (
    <StatCard
      icon={<FaMoneyBillWave className="text-yellow-400" />}
      title="Total Revenue"
      value={`₹ ${amount.toFixed(2)}`}
      color="text-yellow-400"
      hoverShadowColor="hover:shadow-yellow-500/30"
    />
  );
};

interface ICommissionRevenueCard {
  amount: number;
}

const CommissionRevenueCard: FC<ICommissionRevenueCard> = ({ amount }) => {
  return (
    <StatCard
      icon={<HiOutlineCurrencyRupee className="text-emerald-400" />}
      title="Commission Revenue"
      value={`₹ ${amount.toFixed(2)}`}
      color="text-emerald-400"
      hoverShadowColor="hover:shadow-emerald-500/30"
    />
  );
};

interface ISubscriptionRevenueCard {
  amount: number;
}

const SubscriptionRevenueCard: FC<ISubscriptionRevenueCard> = ({ amount }) => {
  return (
    <StatCard
      icon={<FaCrown className="text-purple-400" />}
      title="Subscription Revenue"
      value={`₹ ${amount.toFixed(2)}`}
      color="text-purple-400"
      hoverShadowColor="hover:shadow-purple-500/30"
    />
  );
};

export { RevenueCard, CommissionRevenueCard, SubscriptionRevenueCard };
