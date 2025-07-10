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
    <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
            <span className="text-3xl font-bold text-white">
              {averageRating.toFixed(1)}
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
            {review.userId._id === userId && (
              <div className="flex gap-2">
                <button
                  className="text-blue-400 hover:text-blue-300 transition "
                  onClick={() => setEdit((prev) => !prev)}
                >
                  <MdEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-400 transition"
                  onClick={removeReply}
                >
                  <MdDelete size={20} />
                </button>
              </div>
            )}
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

          {edit ? (
            <EditReviewForm
              initialContent={review.content}
              initialRating={review.rating}
              onSave={(content, rating) => {
                editReview(review._id, rating, content);
                setEdit(false);
              }}
              onCancel={() => setEdit(false)}
            />
          ) : (
            <p className="text-sm text-[#cbd5e1]">{review.content}</p>
          )}

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
