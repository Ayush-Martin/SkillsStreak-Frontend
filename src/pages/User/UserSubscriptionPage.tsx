import { Footer, UserHeader } from "@/components";
import { useSubscription } from "@/hooks";
import { useEffect, useState } from "react";
import { BadgeCheck, Calendar, Crown, Sparkles, Zap } from "lucide-react";
import { ISubscriptionPlans } from "@/types/subscriptionType";
import { getSubscriptionPlans } from "@/api";

const UserSubscriptionPage = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    ISubscriptionPlans[]
  >([]);

  const { getSubscribed } = useSubscription();

  useEffect(() => {
    const fetchPlans = async () => {
      const data = await getSubscriptionPlans();
      if (!data) return;
      setSubscriptionPlans(data);
    };

    fetchPlans();
  }, []);

  const handleSubscribe = (planId: string) => {
    getSubscribed(planId);
  };

  const getPlanIcon = (price: number) => {
    if (price >= 1000) return <Crown className="text-yellow-400" size={20} />;
    if (price >= 500) return <Zap className="text-purple-400" size={20} />;
    return <Sparkles className="text-blue-400" size={20} />;
  };

  return (
    <main className="bg-app-primary ">
      <UserHeader />

      {/* Hero Section */}
      <section className="max-w-6xl min-h-screen mx-auto mt-10 px-4 pt-12 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Unlock premium features and take your experience to the next level
            with our flexible subscription plans
          </p>
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan._id}
              className="relative group transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500/50 rounded-2xl p-8 h-full flex flex-col relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Plan Header */}
                <div className="relative z-10 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    {getPlanIcon(plan.price)}
                    <h3 className="text-xl font-bold text-white">
                      {plan.title}
                    </h3>
                  </div>

                  {plan.description && (
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  )}
                </div>

                {/* Plan Features */}
                <div className="relative z-10 flex-grow mb-6">
                  <div className="flex items-center gap-2 text-gray-300 mb-4">
                    <Calendar size={16} className="text-blue-400" />
                    <span className="text-sm">
                      <span className="font-semibold text-white">
                        {plan.duration}
                      </span>{" "}
                      days access
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-300">
                    <BadgeCheck size={16} className="text-green-400" />
                    <span className="text-sm">Premium features included</span>
                  </div>
                </div>

                {/* Pricing and CTA */}
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl font-bold text-white">
                        ₹{plan.price}
                      </span>
                      <span className="text-gray-400 text-sm">
                        /{plan.duration} days
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      ₹{(plan.price / plan.duration).toFixed(2)} per day
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan._id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                  >
                    Subscribe Now
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {subscriptionPlans.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <Crown className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No subscription plans available
            </h3>
            <p className="text-gray-400">
              Check back later for exciting subscription options!
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default UserSubscriptionPage;
