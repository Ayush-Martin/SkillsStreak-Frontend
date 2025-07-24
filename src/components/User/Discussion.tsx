import React, { FC, useState } from "react";
import { IDiscussion, IReply } from "@/types/courseType";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Trash, Edit3, Send, MessageCircleReply, Star } from "lucide-react";
import { ProfileImage } from "../common";

interface IDiscussionsProps {
  discussions: IDiscussion[];
  addDiscussion: (content: string) => void;
  deleteDiscussion: (discussionId: string) => void;
  editDiscussion: (discussionId: string, content: string) => void;
  addReply: (discussionId: string, content: string) => void;
  fetchReplies: (
    discussionId: string,
    setReplies: (replies: IReply[]) => void
  ) => void;
  trainerId: string;
}

const Discussions: FC<IDiscussionsProps> = ({
  discussions,
  addDiscussion,
  deleteDiscussion,
  editDiscussion,
  addReply,
  fetchReplies,
  trainerId,
}) => {
  const [newDiscussion, setNewDiscussion] = useState("");

  return (
    <div className="mt-10 space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-md">
        <Textarea
          placeholder="Start a new discussion or leave a review..."
          value={newDiscussion}
          onChange={(e) => setNewDiscussion(e.target.value)}
          className="mb-4 bg-black/40 text-white border-white/10"
        />
        <Button
          onClick={() => {
            if (newDiscussion.trim()) {
              addDiscussion(newDiscussion.trim());
              setNewDiscussion("");
            }
          }}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white px-6 py-2 rounded-lg"
        >
          <Send className="w-4 h-4 mr-2" />
          Post
        </Button>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <DiscussionItem
            key={discussion._id}
            discussion={discussion}
            deleteDiscussion={deleteDiscussion}
            editDiscussion={editDiscussion}
            addReply={addReply}
            fetchReplies={fetchReplies}
            trainerId={trainerId}
          />
        ))}
      </div>
    </div>
  );
};

interface IDiscussionItemProps {
  discussion: IDiscussion;
  deleteDiscussion: (discussionId: string) => void;
  editDiscussion: (discussionId: string, content: string) => void;
  addReply: (discussionId: string, content: string) => void;
  fetchReplies: (
    discussionId: string,
    setReplies: (replies: IReply[]) => void
  ) => void;
  trainerId: string;
}

const DiscussionItem: FC<IDiscussionItemProps> = ({
  discussion,
  deleteDiscussion,
  editDiscussion,
  addReply,
  fetchReplies,
  trainerId,
}) => {
  const [replies, setReplies] = useState<IReply[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(discussion.content);
  const [replyText, setReplyText] = useState("");

  const handleToggleReplies = () => {
    if (!showReplies) fetchReplies(discussion._id, setReplies);
    setShowReplies(!showReplies);
  };

  const isTrainer = discussion.userId._id === trainerId;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-md">
      <div className="flex items-start gap-4">
        <ProfileImage
          profileImage={discussion.userId.profileImage}
          size={16}
          textSize="3xl"
        />
        <div className="flex-1 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white/90">
                {discussion.userId.username}
              </span>
              {isTrainer && (
                <span className="text-xs text-emerald-400 bg-emerald-800/30 px-2 py-0.5 rounded-full">
                  Trainer
                </span>
              )}
            </div>
          </div>

          {editing ? (
            <>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="bg-black/40 border-white/10 text-white mt-2"
              />
              <div className="mt-2 space-x-2">
                <Button
                  size="sm"
                  onClick={() => {
                    editDiscussion(discussion._id, editContent);
                    setEditing(false);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditing(false);
                    setEditContent(discussion.content);
                  }}
                  className="text-white/70 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <p className="mt-2 text-white/90 whitespace-pre-wrap">
              {discussion.content}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-yellow-400 hover:text-yellow-300"
              onClick={() => setEditing(true)}
            >
              <Edit3 className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300"
              onClick={() => deleteDiscussion(discussion._id)}
            >
              <Trash className="w-4 h-4 mr-1" /> Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-400 hover:text-emerald-300"
              onClick={handleToggleReplies}
            >
              <MessageCircleReply className="w-4 h-4 mr-1" />
              {showReplies ? "Hide Replies" : "View Replies"}
            </Button>
          </div>
        </div>
      </div>

      {showReplies && (
        <div className="mt-5 space-y-4 border-t border-white/10 pt-4 pl-14">
          {replies.map((reply) => (
            <div
              key={reply._id}
              className="flex gap-3 items-start bg-black/40 border border-white/10 rounded-lg px-4 py-3"
            >
              <ProfileImage
                profileImage={reply.userId.profileImage}
                size={16}
                textSize="3xl"
              />
              <div>
                <p className="text-sm font-semibold text-white/80">
                  {reply.userId.username}
                  {reply.userId._id === trainerId && (
                    <span className="ml-2 text-xs text-emerald-400 bg-emerald-800/30 px-2 py-0.5 rounded-full">
                      Trainer
                    </span>
                  )}
                </p>
                <p className="text-white/90 whitespace-pre-wrap">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}

          <div className="flex gap-2 items-start">
            <Textarea
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="bg-black/40 border-white/10 text-white"
            />
            <Button
              onClick={() => {
                if (replyText.trim()) {
                  addReply(discussion._id, replyText);
                  setReplyText("");
                  fetchReplies(discussion._id, setReplies);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white mt-1"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussions;
