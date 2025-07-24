import {
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPatchRequest,
  axiosPostRequest,
} from "@/config/axios";
import { IDiscussion, IReply } from "@/types/courseType";
import { successPopup } from "@/utils/popup";
import { useEffect, useState } from "react";

const useDiscussion = (refId: string, refType: "lesson" | "liveSession") => {
  const [discussions, setDiscussions] = useState<IDiscussion[]>([]);

  useEffect(() => {
    const fetchDiscussions = async () => {
      if (!refId || !refType) return;
      const res = await axiosGetRequest(
        `discussions?refId=${refId}&refType=${refType}`
      );
      if (!res) return;
      console.log("discussions", res.data);
      setDiscussions(res.data);
    };

    fetchDiscussions();
  }, [refId, refType]);

  const addDiscussion = async (content: string) => {
    const res = await axiosPostRequest(`/discussions`, {
      refId,
      refType,
      content,
    });
    if (!res) return;
    successPopup(res.message);
    setDiscussions([...discussions, res.data]);
  };

  const deleteDiscussion = async (discussionId: string) => {
    const res = await axiosDeleteRequest(`/discussions/${discussionId}`);
    if (!res) return;
    successPopup(res.message || "deleted");
    setDiscussions(discussions.filter((x) => x._id !== discussionId));
  };

  const editDiscussion = async (discussionId: string, content: string) => {
    const res = await axiosPatchRequest(`/discussions/${discussionId}`, {
      content,
    });
    if (!res) return;
    successPopup(res.message);
    setDiscussions(
      discussions.map((discussion) =>
        discussion._id == discussionId ? { ...discussion, content } : discussion
      )
    );
  };

  const addReply = async (discussionId: string, content: string) => {
    const res = await axiosPostRequest(`/discussions/${discussionId}`, {
      content,
    });
    if (!res) return;
    successPopup(res.message || "added");
  };

  const fetchReplies = async (
    discussionId: string,
    setReplies: (replies: IReply[]) => void
  ) => {
    const res = await axiosGetRequest(`/discussions/${discussionId}`);
    if (!res) return;
    setReplies(res.data);
  };

  return {
    discussions,
    addDiscussion,
    deleteDiscussion,
    editDiscussion,
    addReply,
    fetchReplies,
  };
};

export default useDiscussion;
