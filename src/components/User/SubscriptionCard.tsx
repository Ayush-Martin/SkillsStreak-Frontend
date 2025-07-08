import { FaRegClock } from "react-icons/fa";
import StatCardWithProgress from "@/components/common/StatCardWithProgress";
import { isBefore, differenceInDays, format } from "date-fns";
import { FC } from "react";
import { Button } from "../ui";

interface SubscriptionCardProps {
  startDate?: string;
  endDate?: string;
  active: boolean;
  onSubscribe?: () => void;
}

const SubscriptionCard: FC<SubscriptionCardProps> = ({
  startDate,
  endDate,
  onSubscribe,
  active,
}) => {
  const today = new Date();

  const formattedStart = startDate
    ? format(new Date(startDate), "MMM dd, yyyy")
    : "-";
  const formattedEnd = endDate
    ? format(new Date(endDate), "MMM dd, yyyy")
    : "-";

  const daysLeft =
    active && endDate ? differenceInDays(new Date(endDate), today) : 0;

  const progressPercent =
    startDate && endDate
      ? 100 -
        (differenceInDays(new Date(endDate), today) /
          differenceInDays(new Date(endDate), new Date(startDate))) *
          100
      : 0;

  const infoItems = [
    { label: "Started:", value: formattedStart },
    { label: "Expires:", value: formattedEnd },
    {
      label: "Days Left:",
      value: active
        ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`
        : "Not active",
      className: active
        ? daysLeft <= 3
          ? "text-red-400"
          : "text-green-400"
        : "",
    },
  ];

  return (
    <StatCardWithProgress
      icon={<FaRegClock />}
      title={active ? "Premium Active" : "No Active Subscription"}
      items={infoItems}
      progressPercent={progressPercent}
      showProgress={active}
      fallback={
        <div className="flex justify-center pt-2">
          <Button
            onClick={onSubscribe}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm shadow-lg transition"
          >
            Subscribe Now
          </Button>
        </div>
      }
    />
  );
};

export default SubscriptionCard;
