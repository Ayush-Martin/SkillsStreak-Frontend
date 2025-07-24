import { Footer, UserHeader } from "@/components";
import { axiosGetRequest } from "@/config/axios";
import { useSubscription } from "@/hooks";
import { UserLayout } from "@/layouts";
import React, { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";

const UserSubscriptionPage = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    {
      _id: string;
      title: string;
      description?: string;
      price: number;
      duration: number;
    }[]
  >([]);

  const { getSubscribed } = useSubscription();

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await axiosGetRequest("/subscriptionPlans");
      if (!res) return;
      setSubscriptionPlans(res.data);
    };

    fetchPlans();
  }, []);

  const handleSubscribe = (planId: string) => {
    getSubscribed(planId);
  };

  return (
    <main className=" bg-app-primary ">
      <UserHeader />
      <section className="max-w-4xl my-10 mx-auto px-4 py-10">
        <div className="space-y-4">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan._id}
              className="bg-[#111827] border border-app-border rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BadgeCheck size={18} className="text-green-500" />
                  {plan.title}
                </h3>
                {plan.description && (
                  <p className="text-sm text-muted mt-1">{plan.description}</p>
                )}
                <p className="text-sm text-muted mt-1">
                  Duration:{" "}
                  <span className="text-white">{plan.duration} days</span>
                </p>
              </div>
              <div className="flex flex-col sm:items-end">
                <p className="text-lg font-bold text-white mb-2">
                  ₹{plan.price}
                </p>
                <button
                  onClick={() => handleSubscribe(plan._id)}
                  className="bg-blue-600 hover:bg-blue-700 transition-colors text-sm px-4 py-2 rounded-md text-white"
                >
                  Subscribe
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default UserSubscriptionPage;
