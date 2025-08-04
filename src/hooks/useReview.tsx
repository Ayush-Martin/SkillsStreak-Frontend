import {
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";
import { COURSES_API } from "@/constants";
import { RootReducer } from "@/store";
import { IReview } from "@/types/reviewType";
import { successPopup } from "@/utils/popup";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useReview = (courseId: string) => {
  const [reviews, setReviews] = useState<Array<IReview>>([]);
  const { _id, username, profileImage } = useSelector(
    (state: RootReducer) => state.user
  );

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}/reviews`);
      if (!res) return;
      setReviews(res.data);
    };

    fetchReviews();
  }, []);

  const addReview = async (content: string, rating: number) => {
    const res = await axiosPostRequest(`${COURSES_API}/${courseId}/reviews`, {
      content,
      rating,
    });
    if (!res) return;
    setReviews([
      ...reviews,
      { ...res.data, userId: { username, profileImage, _id } },
    ]);
    successPopup(res.message);
  };

  const deleteReview = async (reviewId: string) => {
    const res = await axiosDeleteRequest(
      `${COURSES_API}/${courseId}/reviews/${reviewId}`
    );
    if (!res) return;
    successPopup(res.message || "deleted");
    setReviews(reviews.filter((review) => review._id !== reviewId));
  };

  const addReply = async (reviewId: string, content: string) => {
    const res = await axiosPostRequest(
      `${COURSES_API}/${courseId}/reviews/${reviewId}/replies`,
      { content }
    );
    if (!res) return;
    successPopup(res.message || "added");
    setReviews(
      reviews.map((review) =>
        review._id == reviewId
          ? {
              ...review,
              replies: [
                ...(review.replies || []),
                { ...res.data, userId: { username, profileImage, _id } },
              ],
            }
          : review
      )
    );
  };

  const fetchReplies = async (reviewId: string) => {
    const res = await axiosGetRequest(
      `${COURSES_API}/${courseId}/reviews/${reviewId}/replies`
    );
    if (!res) return;

    setReviews(
      reviews.map((review) =>
        review._id == reviewId ? { ...review, replies: res.data } : review
      )
    );
  };

  const editReview = async (
    reviewId: string,
    rating: number,
    content: string
  ) => {
    const res = await axiosPutRequest(
      `/courses/${courseId}/reviews/${reviewId}`,
      {
        rating,
        content,
      }
    );

    if (!res) return;
    successPopup(res.message);
    setReviews(
      reviews.map((review) =>
        review._id == reviewId ? { ...review, rating, content } : review
      )
    );
  };

  return {
    reviews,
    addReply,
    addReview,
    deleteReview,
    fetchReplies,
    editReview,
  };
};

export default useReview;
