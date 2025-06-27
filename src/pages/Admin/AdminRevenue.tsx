import StatCard from "@/components/common/StatCard";
import { AdminLayout } from "@/layouts";
import { FaMoneyBillWave, FaWallet } from "react-icons/fa6";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";

const RevenueCard = () => {
  return (
    <StatCard
      icon={<FaMoneyBillWave className="text-yellow-400" />}
      title="Total Revenue"
      value="₹ 45,000"
      color="text-yellow-400"
      hoverShadowColor="hover:shadow-yellow-500/30"
    />
  );
};

const CommissionCard: FC = () => {
  return (
    <StatCard
      icon={<HiOutlineCurrencyRupee className="text-emerald-400" />}
      title="Total Commission"
      value="₹ 12,500"
      color="text-emerald-400"
      hoverShadowColor="hover:shadow-emerald-500/30"
    />
  );
};

const WalletCard = () => {
  return (
    <StatCard
      icon={<FaWallet className="text-blue-400" />}
      title="Wallet Balance"
      value={`₹ ${(1250.75).toFixed(2)}`}
      color="text-blue-400"
      hoverShadowColor="hover:shadow-blue-400/30"
    />
  );
};

const AdminRevenue = () => {
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <RevenueCard />
        <CommissionCard />
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <WalletCard />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRevenue;
