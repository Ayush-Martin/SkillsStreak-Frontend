import { StatCard } from "@/components/common";
import { FC } from "react";
import { FaMoneyBillWave } from "react-icons/fa6";

interface IRevenueCard {
  amount: number;
}

export const TrainerRevenueCard: FC<IRevenueCard> = ({ amount }) => {
  return (
    <StatCard
      icon={<FaMoneyBillWave className="text-yellow-400" />}
      title="Total Revenue"
      value={`₹ ${amount}`}
      color="text-yellow-400"
      hoverShadowColor="hover:shadow-yellow-500/30"
    />
  );
};

export const TrainerCommissionCard: FC<IRevenueCard> = ({ amount }) => {
  return (
    <StatCard
      icon={<FaMoneyBillWave className="text-blue-400" />}
      title="Total Commission"
      value={`₹ ${amount}`}
      color="text-blue-400"
      hoverShadowColor="hover:shadow-blue-500/30"
    />
  );
};

export const TrainerOnProcessAmountCard: FC<IRevenueCard> = ({ amount }) => {
  return (
    <StatCard
      icon={<FaMoneyBillWave className="text-green-400" />}
      title="On Process Amount"
      value={`₹ ${amount}`}
      color="text-green-400"
      hoverShadowColor="hover:shadow-green-500/30"
    />
  );
};


