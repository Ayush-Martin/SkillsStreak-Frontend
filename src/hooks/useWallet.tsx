import { axiosGetRequest, axiosPatchRequest } from "@/config/axios";
import { RootReducer } from "@/store";
import { successPopup } from "@/utils/popup";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useRedeem = () => {
  const [wallet, setWallet] = useState<{
    balance: number;
  }>({ balance: 0 });

  const { stripeAccountId } = useSelector((state: RootReducer) => state.user);
  const haveStripeId = !!stripeAccountId;

  const getWalletDetails = async () => {
    const res = await axiosGetRequest("/wallet");
    if (!res) return;
    setWallet(res.data);
  };

  useEffect(() => {
    getWalletDetails();
  }, []);

  const setupStripeAccount = async () => {
    const res = await axiosPatchRequest("/wallet/account");
    if (!res) return;
    window.location.href = res.data;
  };

  const handleRedeem = async () => {
    const res = await axiosPatchRequest("/wallet");
    if (!res) return;
    successPopup(res.message || "redeemed");
    await getWalletDetails();
  };

  return {
    wallet,
    haveStripeId,
    setupStripeAccount,
    handleRedeem,
  };
};

export default useRedeem;
