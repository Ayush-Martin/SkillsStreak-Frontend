import {
  Button,
  Card,
  CardContent,
  Input,
  Textarea,
  ProfileImage,
} from "@/components";
import { FC, useContext, useState } from "react";
import { Star, Users } from "lucide-react";
import { Rating } from "@smastrom/react-rating";

import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { MdDelete, MdEdit } from "@/assets/icons";
import { ReviewContext } from "@/context";
import { IReview } from "@/types/reviewType";


interface IReviewProps {
  trainerId: string;
  courseAccess: boolean;
}

interface IReviewCardProps {
  review: IReview;
  userId: string;
  authorId: string;
}

interface ReviewStatsProps {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: { stars: number; count: number; percentage: number }[];
}

const Review: FC<IReviewProps> = ({ trainerId, courseAccess }) => {
  const { reviews } = useContext(ReviewContext)!;
  const { _id } = useSelector((state: RootReducer) => state.user);

  const totalReviews = reviews.length;
  const avgRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews || 0;

  const ratingBreakdown = Array.from({ length: 5 }, (_, i) => {
    const stars = 5 - i;
    const count = reviews.filter((review) => review.rating === stars).length;
    const percentage = (count / totalReviews) * 100 || 0;
    return { stars, count, percentage };
  });

  return (
    <div className="relative text-white">
      <ReviewStats
        averageRating={avgRating}
        totalReviews={totalReviews}
        ratingBreakdown={ratingBreakdown}
      />

      {!!_id &&
        courseAccess &&
        !reviews.find((review) => review.userId._id === _id) && <AddReview />}

      <div className="flex flex-col gap-6">
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            authorId={trainerId}
            review={review}
            userId={_id}
          />
        ))}
      </div>
    </div>
  );
};

const ReviewStats = ({
  averageRating,
  totalReviews,
  ratingBreakdown,
}: ReviewStatsProps) => {
  return (
    <div className="bg-[#10141f] rounded-2xl p-6 mb-6 border border-[#1e2533] shadow-sm">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
            <span className="text-3xl font-semibold text-white tracking-tight">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 transition ${
                  i < Math.floor(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
            <Users className="w-4 h-4" />
            {totalReviews.toLocaleString()} reviews total
          </p>
        </div>

        <div className="space-y-3">
          {ratingBreakdown.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-400 w-6">{stars}★</span>
              <div className="flex-1 h-2 bg-[#1e2533] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-10 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddReview: FC = () => {
  const { addReview } = useContext(ReviewContext)!;
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addReview(content, rating);
    setRating(0);
    setContent("");
  };

  return (
    <Card className="bg-[#10141f] border border-[#1e2533] mb-10 shadow-sm rounded-2xl">
      <CardContent className="p-5">
        <h3 className="text-white font-medium text-lg mb-4">Write a Review</h3>
        <form onSubmit={save} className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Your Rating:</span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 cursor-pointer transition ${
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
            className="bg-[#181e2a] text-white border border-[#1e2533] focus:ring-1 focus:ring-blue-500"
            rows={4}
          />

          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-xl shadow-sm"
          >
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ReviewCard: FC<IReviewCardProps> = ({ review, authorId, userId }) => {
  const { fetchReplies, addReply, deleteReview, editReview } =
    useContext(ReviewContext)!;

  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [reply, setReply] = useState("");

  const submit = () => {
    addReply(review._id, reply);
    setOpen(false);
    setReply("");
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
    <div className="bg-[#1a1f2e] border border-[#2a3441] rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <ProfileImage
            profileImage={review.userId.profileImage}
            size={12}
            textSize="2xl"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {review.userId._id === userId
                    ? "You"
                    : review.userId.username}
                </h3>
                {review.userId._id === authorId && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800">
                    Trainer
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">2 hours ago</p>
            </div>

            {review.userId._id === userId && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEdit((prev) => !prev)}
                  className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-gray-800 transition-colors duration-200"
                  title="Edit Review"
                >
                  <MdEdit size={18} />
                </button>
                <button
                  onClick={removeReply}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors duration-200"
                  title="Delete Review"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <Rating style={{ maxWidth: 100 }} value={review.rating} readOnly />
            <span className="text-sm font-medium text-gray-300">
              {review.rating} out of 5
            </span>
          </div>

          {/* Content */}
          <div className="text-gray-200 leading-relaxed">
            {edit ? (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <EditReviewForm
                  initialContent={review.content}
                  initialRating={review.rating}
                  onSave={(content, rating) => {
                    editReview(review._id, rating, content);
                    setEdit(false);
                  }}
                  onCancel={() => setEdit(false)}
                />
              </div>
            ) : (
              <p className="text-base">{review.content}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-700">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {open ? "Cancel" : "Reply"}
            </button>

            <button
              onClick={getReplies}
              className="inline-flex items-center gap-2 text-sm font-medium text-green-400 hover:text-green-300 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {showReplies
                ? "Hide Replies"
                : `View Replies (${review.replies?.length || 0})`}
            </button>
          </div>

          {/* Reply Form */}
          {open && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="space-y-3">
                <Input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <Button
                    onClick={submit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    disabled={!reply.trim()}
                  >
                    Post Reply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Replies */}
          {showReplies && (
            <div className="mt-6 space-y-4 border-l-2 border-gray-700 pl-6">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
                Replies ({review.replies?.length || 0})
              </h4>

              {review.replies?.map((reply) => (
                <div
                  key={reply._id}
                  className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <ProfileImage
                      profileImage={reply.userId.profileImage}
                      size={10}
                      textSize="lg"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {reply.userId._id === userId
                          ? "You"
                          : reply.userId.username}
                      </p>
                      {reply.userId._id === authorId && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900/30 text-blue-300">
                          Trainer
                        </span>
                      )}
                      <span className="text-xs text-gray-400">1 hour ago</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
interface EditReviewFormProps {
  initialContent: string;
  initialRating: number;
  onSave: (content: string, rating: number) => void;
  onCancel: () => void;
}

const EditReviewForm: FC<EditReviewFormProps> = ({
  initialContent,
  initialRating,
  onSave,
  onCancel,
}) => {
  const [editedContent, setEditedContent] = useState(initialContent);
  const [editedRating, setEditedRating] = useState(initialRating);

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-300 text-sm">Rating:</span>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            onClick={() => setEditedRating(i + 1)}
            className={`w-4 h-4 cursor-pointer ${
              i < editedRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
      </div>

      <Textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="bg-[#181e2a] text-white border border-[#1e2533]"
        rows={3}
      />

      <div className="flex gap-2 mt-3">
        <Button
          onClick={() => onSave(editedContent, editedRating)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Save
        </Button>
        <Button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Review;
