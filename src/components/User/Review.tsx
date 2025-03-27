import { Button, Input, Textarea } from "@/components/ui";
import { FC, useEffect, useState } from "react";
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

const AddReview: FC<IAddReviewProps> = ({ addReview }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const { profileImage } = useSelector((state: RootReducer) => state.user);
  const save = () => {
    addReview({ content, rating });
    setRating(0);
    setContent("");
  };

  return (
    <div className="flex w-full gap-5 py-2 pb-5 mb-10 border-b border-app-border">
      <ProfileImage profileImage={profileImage} textSize="2xl" size={10} />

      <div className="flex flex-col gap-1">
        <Input
          id="content"
          className="w-full bg-transparent border border-app-border placeholder:text-app"
          placeholder="add a review"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex gap-2">
          <Rating
            id="rating"
            style={{
              maxWidth: 120,
              maxHeight: 50,
            }}
            value={rating}
            onChange={setRating}
          />
          <button className="text-2xl text-app-tertiary" onClick={save}>
            <IoIosSave />
          </button>
        </div>
      </div>
    </div>
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
    <div>
      <div className="flex w-full gap-4">
        <ProfileImage
          profileImage={review.userId.profileImage}
          size={10}
          textSize="2xl"
        />
        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            <div className="flex gap-1">
              <p className=" text-app-accent">
                {review.userId._id == userId ? "You" : review.userId.username}
              </p>
              {review.userId._id == authorId && <p className="">(Author)</p>}
            </div>
            <button className="text-xl text-red-500" onClick={removeReply}>
              <MdDelete />
            </button>
          </div>
          <div className="flex gap-5">
            <Rating
              style={{
                maxWidth: 100,
                maxHeight: 50,
              }}
              readOnly
              value={review.rating}
            />
            <button onClick={() => setOpen((p) => !p)}>Reply</button>
            <button onClick={getReplies}>Replies</button>
          </div>

          <p className="text-sm">{review.content}</p>
          {open && (
            <div className="flex gap-2">
              <Input
                placeholder="reply"
                className="bg-app-border"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <Button onClick={submit}>Add</Button>
            </div>
          )}
        </div>
      </div>

      {showReplies && (
        <div className="flex flex-col gap-6 pt-4 mt-5 ml-10 border-t border-app-border">
          {review.replies &&
            review.replies.map((reply) => (
              <div className="flex w-full gap-4">
                <ProfileImage
                  profileImage={reply.userId.profileImage}
                  textSize="2xl"
                  size={10}
                />
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1">
                    <p className=" text-app-accent">
                      {reply.userId._id == userId
                        ? "You"
                        : reply.userId.username}
                    </p>
                    {reply.userId._id == authorId && (
                      <p className="">(Author)</p>
                    )}
                  </div>
                  <p>{reply.content}</p>
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
      {!!_id && <AddReview addReview={addReview} />}

      <div className="flex flex-col gap-6 ">
        {reviews.map((review) => (
          <ReviewCard
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
