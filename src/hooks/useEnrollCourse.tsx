import {
  axiosGetRequest,
  axiosPatchRequest,
  axiosPostRequest,
} from "@/config/axios";
import { COURSES_API } from "@/constants";
import { RootReducer } from "@/store";
import { errorPopup, successPopup } from "@/utils/popup";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const STRIPE_PUBLISHABLE_kEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!;

const useEnrollCourse = () => {
  const navigate = useNavigate();
  const [courseAccess, setCourseAccess] = useState<boolean | null>(null);

  const { accessToken } = useSelector((state: RootReducer) => state.user);

  const fetchAccess = async (courseId: string) => {
    const res = await axiosGetRequest(`${COURSES_API}/${courseId}/access`);
    setCourseAccess(false);
    if (!res) return;
    if (res.data) {
      setCourseAccess(true);
    }
  };

  const handleEnroll = async (
    courseId: string,
    method?: "wallet" | "stripe"
  ) => {
    if (!accessToken) {
      errorPopup("You must be logged in to enroll in a course.");
      return;
    }
    const res = await axiosPostRequest(`${COURSES_API}/${courseId}`, {
      method,
    });
    if (!res) return;
    if (!res.data) {
      successPopup(res.message || "enrolled");
      setCourseAccess(true);

      if (method == "wallet") {
        navigate("/payment/success");
      }
      return;
    }

    const stripePromise = loadStripe(STRIPE_PUBLISHABLE_kEY);
    const stripe = await stripePromise;
    if (!stripe) return;
    await stripe.redirectToCheckout({ sessionId: res.data });
  };

  const handleRetryPurchase = async (transactionId: string) => {
    const res = await axiosPatchRequest(`transactions/${transactionId}/retry`);
    if (!res) return;
    const stripePromise = loadStripe(STRIPE_PUBLISHABLE_kEY);
    const stripe = await stripePromise;
    if (!stripe) return;
    await stripe.redirectToCheckout({ sessionId: res.data });
  };

  return { courseAccess, handleEnroll, fetchAccess, handleRetryPurchase };
};

export default useEnrollCourse;
