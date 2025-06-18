import { Button, Card, CardContent, Input, Textarea } from "@/components/ui";
import { FC, useEffect, useState } from "react";
import { Star, Users, Award } from "lucide-react";
import { Rating } from "@smastrom/react-rating";
import {
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPostRequest,
} from "@/config/axios";
import { COURSES_API } from "@/constants/API";
import { successPopup } from "@/utils/popup";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import ProfileImage from "../ProfileImage";
import { MdDelete, IoIosSave } from "@/assets/icons";

interface IUser {
  _id: string;
  username: string;
  profileImage: string;
}

interface IReply {
  userId: { _id: string; username: string; profileImage: string };
  content: string;
  entityId: string;
  _id: string;
}

interface IReview {
  _id: string;
  courseId: string;
  rating: number;
  content: string;
  userId: IUser;
  replies?: IReply[];
}

interface IReviewProps {
  courseId: string;
  trainerId: string;
}

interface IAddReviewProps {
  addReview: (data: { content: string; rating: number }) => void;
}

interface IReviewCardProps {
  review: IReview;
  userId: string;
  authorId: string;
  addReply: (reviewId: string, content: string) => void;
  fetchReplies: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;
}

interface ReviewStatsProps {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: { stars: number; count: number; percentage: number }[];
}

const ReviewStats = ({
  averageRating,
  totalReviews,
  ratingBreakdown,
}: ReviewStatsProps) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
            <span className="text-3xl font-bold text-white">
              {averageRating}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            Based on {totalReviews.toLocaleString()} reviews
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2">
          {ratingBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-300 w-6">
                {item.stars}★
              </span>
              <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-700 ease-out"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-400 w-12 text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddReview: FC<IAddReviewProps> = ({ addReview }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addReview({ content, rating });
    setRating(0);
    setContent("");
  };

  return (
    // <div className="flex w-full gap-5 py-2 pb-5 mb-10 border-b border-app-border">
    //   <ProfileImage profileImage={profileImage} textSize="2xl" size={10} />

    //   <div className="flex flex-col gap-1">
    //     <Input
    //       id="content"
    //       className="w-full bg-transparent border border-app-border placeholder:text-app"
    //       placeholder="add a review"
    //       value={content}
    //       onChange={(e) => setContent(e.target.value)}
    //     />
    //     <div className="flex gap-2">
    //       <Rating
    //         id="rating"
    //         style={{
    //           maxWidth: 120,
    //           maxHeight: 50,
    //         }}
    //         value={rating}
    //         onChange={setRating}
    //       />
    //       <button className="text-2xl text-app-tertiary" onClick={save}>
    //         <IoIosSave />
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <Card className="bg-gray-800 border-gray-700 mb-10">
      <CardContent className="p-4">
        <h3 className="text-white font-medium mb-3">Add a Review</h3>
        <form onSubmit={save} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm">Rating:</span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 cursor-pointer ${
                  i < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-600"
                }`}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>

          <Textarea
            placeholder="Write your review..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            rows={3}
          />

          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ReviewCard: FC<IReviewCardProps> = ({
  review,
  authorId,
  addReply,
  fetchReplies,
  deleteReview,
  userId,
}) => {
  const [open, setOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [reply, setReply] = useState("");
  const submit = () => {
    addReply(review._id, reply);
    setOpen(false);
  };

  const getReplies = () => {
    if (!review.replies) {
      fetchReplies(review._id);
    }
    setShowReplies((p) => !p);
  };

  const removeReply = () => {
    deleteReview(review._id);
  };

  return (
    <div className="w-full p-5 bg-[#10141f] text-[#e0e6ed] rounded-2xl shadow-md border border-[#1e2533]">
      <div className="flex gap-4">
        <ProfileImage
          profileImage={review.userId.profileImage}
          size={12}
          textSize="2xl"
        />
        <div className="flex flex-col gap-3 w-full">
          <div className="flex justify-between items-start">
            <div className="flex gap-2 items-center">
              <p className="text-[#7dd3fc] font-semibold">
                {review.userId._id === userId ? "You" : review.userId.username}
              </p>
              {review.userId._id === authorId && (
                <span className="text-xs px-2 py-0.5 bg-[#1a1f2d] text-[#f472b6] rounded-full">
                  Author
                </span>
              )}
            </div>
            <button
              className="text-red-500 hover:text-red-400 transition"
              onClick={removeReply}
            >
              <MdDelete size={20} />
            </button>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <Rating
              style={{ maxWidth: 100, maxHeight: 50 }}
              readOnly
              value={review.rating}
            />
            <button
              onClick={() => setOpen((p) => !p)}
              className="text-[#38bdf8] hover:text-[#0ea5e9] transition"
            >
              Reply
            </button>
            <button
              onClick={getReplies}
              className="text-[#22c55e] hover:text-[#16a34a] transition"
            >
              Replies
            </button>
          </div>

          <p className="text-sm text-[#cbd5e1]">{review.content}</p>

          {open && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Write your reply..."
                className="bg-[#181e2a] text-white border border-[#1e2533]"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <Button
                onClick={submit}
                className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white"
              >
                Add
              </Button>
            </div>
          )}
        </div>
      </div>

      {showReplies && (
        <div className="flex flex-col gap-6 pt-4 mt-5 ml-10 border-t border-[#1e2533]">
          {review.replies?.map((reply) => (
            <div key={reply._id} className="flex gap-4">
              <ProfileImage
                profileImage={reply.userId.profileImage}
                size={12}
                textSize="2xl"
              />
              <div className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <p className="text-[#7dd3fc] font-semibold">
                    {reply.userId._id === userId
                      ? "You"
                      : reply.userId.username}
                  </p>
                  {reply.userId._id === authorId && (
                    <span className="text-xs px-2 py-0.5 bg-[#1a1f2d] text-[#f472b6] rounded-full">
                      Author
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#cbd5e1]">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Review: FC<IReviewProps> = ({ courseId, trainerId }) => {
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
  const addReview = async (data: { content: string; rating: number }) => {
    const res = await axiosPostRequest(
      `${COURSES_API}/${courseId}/reviews`,
      data
    );
    if (!res) return;
    setReviews([
      ...reviews,
      { ...res.data, userId: { username, profileImage, _id } },
    ]);
    successPopup(res.message || "added");
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

  return (
    <div className="relative text-white">
      <ReviewStats
        averageRating={4.5}
        totalReviews={100}
        ratingBreakdown={[
          { stars: 5, count: 60, percentage: 60 },
          { stars: 4, count: 30, percentage: 30 },
          { stars: 3, count: 10, percentage: 10 },
        ]}
      />

      {!!_id && <AddReview addReview={addReview} />}

      <div className="flex flex-col gap-6 ">
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            addReply={addReply}
            authorId={trainerId}
            fetchReplies={fetchReplies}
            deleteReview={deleteReview}
            review={review}
            userId={_id}
          />
        ))}
      </div>
    </div>
  );
};

export default Review;
