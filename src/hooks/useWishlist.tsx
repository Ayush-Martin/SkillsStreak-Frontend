import {
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPostRequest,
} from "@/config/axios";
import { IWishList } from "@/types/wishlistType";
import { successPopup } from "@/utils/popup";
import { useState } from "react";

const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Array<IWishList>>([]);

  const fetchWishlist = async () => {
    const res = await axiosGetRequest("/wishlist");
    if (!res) return;
    setWishlist(res.data);
  };

  const removeWishlist = async (wishlistId: string) => {
    const res = await axiosDeleteRequest(`/wishlist/${wishlistId}`);
    if (!res) return;
    successPopup(res.message || "removed");
    setWishlist(wishlist.filter((x) => x._id !== wishlistId));
  };

  const addCourseToWishlist = async (courseId: string) => {
    const res = await axiosPostRequest("/wishlist", { courseId });
    if (!res) return;
    successPopup(res.message);
  };

  const removeCourseFromWishlist = async (courseId: string) => {
    const res = await axiosDeleteRequest(`/wishlist/course/${courseId}`);
    if (!res) return;
    successPopup(res.message);
  };

  const checkCourseAddedToWishlist = async (
    courseId: string
  ): Promise<boolean> => {
    const res = await axiosGetRequest(`/wishlist/course/${courseId}`);
    if (!res) return false;
    return res.data.isAdded;
  };

  return {
    wishlist,
    fetchWishlist,
    removeWishlist,
    addCourseToWishlist,
    removeCourseFromWishlist,
    checkCourseAddedToWishlist,
  };
};

export default useWishlist;
