import { FC, useEffect, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  ChartConfig,
  ChartContainer,
} from "@/components/ui";
import {
  RadialBarChart,
  PolarGrid,
  RadialBar,
  PolarRadiusAxis,
  Label,
} from "recharts";
import { axiosGetRequest } from "@/config/axios";
import useSubscription from "@/hooks/useSubscription";
import { successPopup } from "@/utils/popup";

const chartConfig = {
  value: {
    label: "Days Completed",
  },
  daysCompleted: {
    label: "Subscription Progress",
    color: "#4f46e5",
  },
} satisfies ChartConfig;

interface ISubscriptionGraphParams {
  startDate: Date;
  endDate: Date;
}

const SubscriptionGraph: FC<ISubscriptionGraphParams> = ({
  startDate,
  endDate,
}) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  const totalDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysCompleted = Math.ceil(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = Math.max(0, totalDays - daysCompleted);

  const progressAngle = (daysCompleted / totalDays) * 360;

  const chartData = [
    { metric: "daysCompleted", value: daysCompleted, fill: "#4f46e5" },
  ];

  return (
    <Card className="flex flex-col bg-transparent border-0 h-[250px]">
      <div className="flex items-center justify-between px-5 pt-3 pb-0 mb-0">
        <div className="flex flex-col">
          <p className="text-sm text-gray-400">Started</p>
          <p className="text-lg font-semibold text-white">
            {start.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-right text-gray-400">Expires</p>
          <p className="text-lg font-semibold text-right text-white">
            {end.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <CardContent className="flex-1 py-0 pb-0 mt-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={progressAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-gray-700 last:fill-gray-800"
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey="value"
              background={{ fill: "#374151" }}
              cornerRadius={10}
              fill="#4f46e5"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-4xl font-bold fill-white"
                        >
                          {daysRemaining}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="text-sm fill-gray-400"
                        >
                          Days Left
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const SubscriptionCard: FC = () => {
  const [subscription, setSubscription] = useState<{
    startDate: Date;
    endDate: Date;
  } | null>(null);
  const getSubscription = useSubscription();

  const getSubscriptionDetail = async () => {
    const res = await axiosGetRequest("/subscription/detail");
    if (!res || !res.data) return;
    const { startDate, endDate } = res.data;
    console.log(res.data);
    setSubscription({ startDate, endDate });
  };

  useEffect(() => {
    getSubscriptionDetail();
  }, []);

  const handleSubscription = () => {
    getSubscription((message: string | undefined) => {
      successPopup(message || "enrolled");
      getSubscriptionDetail();
    });
  };

  return (
    <div className="overflow-hidden transition-shadow duration-300 transform bg-gray-800 border border-gray-700 shadow-lg rounded-xl hover:shadow-xl w-[350px]">
      <div className="flex items-center justify-between p-4 bg-indigo-600">
        <h2 className="text-xl font-bold text-white">Premium Subscription</h2>
        <span className="text-sm text-indigo-200">
          {subscription
            ? new Date() > subscription.endDate
              ? "expired"
              : "active"
            : "no subscription"}
          {}
        </span>
      </div>
      {subscription ? (
        <SubscriptionGraph
          startDate={subscription.startDate}
          endDate={subscription.endDate}
        />
      ) : (
        <div className=" h-[250px] px-4 flex flex-col py-10 gap-4 justify-center items-center">
          <h1 className="text-2xl font-semibold text-center ">
            You are not subscribed
          </h1>
          <p className="text-center">
            Subscribe now to enjoy premium features like premium chat live class
            etc..
          </p>
          <Button onClick={handleSubscription} className="w-20">
            Subscribe
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;
