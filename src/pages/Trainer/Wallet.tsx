import { Button } from "@/components/ui/button";
import { axiosGetRequest } from "@/config/axios";
import TrainerLayout from "@/layouts/TrainerLayout";
import { useEffect, useState } from "react";

const Wallet = () => {
  const [wallet, setWallet] = useState({
    balance: 0,
    commission: 0,
    redeemable: 0,
  });

  useEffect(() => {
    const fetchWalletInfo = async () => {
      const res = await axiosGetRequest("/trainer/wallet");
      if (!res) return;
      setWallet(res.data);
      console.log(res);
    };

    fetchWalletInfo();
  }, []);
  return (
    <TrainerLayout>
      <div className="flex justify-center">
        <div className="flex flex-col justify-center rounded-md px-7 py-7 bg-app-border lg:w-[500px] xl:w-[600px] gap-7 items-center">
          <h1 className="text-3xl font-medium text-center">Wallet</h1>
          <div className="w-[300px] bg-app-neutral px-10 py-5 rounded-md text-black">
            <p className="text-lg">
              <span className="font-semibold">Total Balance :</span>{" "}
              {wallet.balance}
            </p>
          </div>
          <div className="w-[300px] bg-app-neutral px-10 py-5 rounded-md text-black">
            <p className="text-lg">
              <span className="font-semibold">Total Commission :</span>{" "}
              {wallet.commission}
            </p>
          </div>
          <div className="w-[300px] bg-app-neutral px-10 py-5 rounded-md text-black">
            <p className="text-lg">
              <span className="font-semibold">Total Redeemable :</span>{" "}
              {wallet.redeemable}
            </p>
          </div>
          <Button variant={"v1"}>Click to redeem</Button>
        </div>
      </div>
    </TrainerLayout>
  );
};

export default Wallet;
