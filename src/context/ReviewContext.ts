import { IReview } from "@/types/reviewType";
import { createContext } from "react";

interface IReviewContext {
  reviews: Array<IReview>;
  addReview: (content: string, rating: number) => void;
  deleteReview: (reviewId: string) => void;
  addReply: (reviewId: string, content: string) => void;
  fetchReplies: (reviewId: string) => void;
  editReview: (reviewId: string, rating: number, content: string) => void;
}

const ReviewContext = createContext<IReviewContext | undefined>(undefined);

export default ReviewContext;
