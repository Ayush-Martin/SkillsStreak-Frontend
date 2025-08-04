import { FaRegClock } from "react-icons/fa";
import { isAfter, isBefore, differenceInDays, format } from "date-fns";
import { FC } from "react";
import { Button,StatCardWithProgress } from "@/components";

interface SubscriptionCardProps {
  startDate?: string;
  endDate?: string;
  onSubscribe?: () => void;
}

const SubscriptionCard: FC<SubscriptionCardProps> = ({
  startDate,
  endDate,
  onSubscribe,
}) => {
  const today = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const formattedStart = start ? format(start, "MMM dd, yyyy") : "-";
  const formattedEnd = end ? format(end, "MMM dd, yyyy") : "-";

  const isActive =
    start && end && isBefore(start, today) && isAfter(end, today);

  const totalDuration = start && end ? differenceInDays(end, start) || 1 : 1;

  const daysLeft = end ? Math.max(0, differenceInDays(end, today)) : 0;

  const progressPercent =
    start && end
      ? Math.min(
          100,
          Math.max(0, ((totalDuration - daysLeft) / totalDuration) * 100)
        )
      : 0;

  const infoItems = [
    { label: "Started:", value: formattedStart },
    { label: "Expires:", value: formattedEnd },
    {
      label: "Days Left:",
      value: isActive
        ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`
        : "Not active",
      className: isActive
        ? daysLeft <= 3
          ? "text-red-400"
          : "text-green-400"
        : "",
    },
  ];

  return (
    <StatCardWithProgress
      icon={<FaRegClock />}
      title={isActive ? "Premium Active" : "No Active Subscription"}
      items={infoItems}
      progressPercent={progressPercent}
      showProgress={!!isActive}
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
