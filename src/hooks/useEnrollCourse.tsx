import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import { COURSES_API } from "@/constants";
import { RootReducer } from "@/store";
import { errorPopup, successPopup } from "@/utils/popup";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { useSelector } from "react-redux";

const STRIPE_PUBLISHABLE_kEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!;

const useEnrollCourse = () => {
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

  const handleEnroll = async (courseId: string) => {
    if (!accessToken) {
      errorPopup("You must be logged in to enroll in a course.");
      return;
    }
    const res = await axiosPostRequest(`${COURSES_API}/${courseId}`, {});
    if (!res) return;
    if (!res.data) {
      successPopup(res.message || "enrolled");
      setCourseAccess(true);
    }

    const stripePromise = loadStripe(STRIPE_PUBLISHABLE_kEY);
    const stripe = await stripePromise;
    if (!stripe) return;
    await stripe.redirectToCheckout({ sessionId: res.data });
  };

  return { courseAccess, handleEnroll, fetchAccess };
};

export default useEnrollCourse;
