import {
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";
import { IAiChatMessage } from "@/types/chatType";
import { INotebook } from "@/types/notebookType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useViewCourse = () => {
  const { courseId } = useParams();

  const [aiChats, setAiChats] = useState<{
    chats: IAiChatMessage[];
    loading: boolean;
  }>({
    chats: [],
    loading: false,
  });
  const [notebooks, setNotebooks] = useState<INotebook[]>([]);

  const fetchWelcomeAiChat = async () => {
    setAiChats({ ...aiChats, loading: true });
    const message =
      "Greet the user and explain that you’re here to help them understand the course content, answer questions, and support their learning journey. Be concise, friendly, and helpful in your tone.";

    const res = await axiosPostRequest(`/courses/${courseId}/aiChat`, {
      message,
      history: [],
    });

    if (!res) return;
    setAiChats({
      chats: [
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text: res.data }] },
      ],
      loading: false,
    });
  };

  const sendAiChatMessage = async (message: string) => {
    setAiChats((p) => {
      return { ...p, loading: true };
    });
    const newUserMessage: IAiChatMessage = {
      role: "user",
      parts: [{ text: message }],
    };
    const updatedChats = [...aiChats.chats, newUserMessage];
    setAiChats((p) => {
      return { ...p, chats: updatedChats };
    });

    const res = await axiosPostRequest(`/courses/${courseId}/aiChat`, {
      message,
      history: aiChats.chats,
    });

    if (!res) return;
    setAiChats({
      chats: [...updatedChats, { role: "model", parts: [{ text: res.data }] }],
      loading: false,
    });
  };

  const fetchNotebooks = async () => {
    const res = await axiosGetRequest(`/enrolledCourses/${courseId}/notebooks`);
    if (!res) return;
    setNotebooks(res.data);
  };

  const addNotebook = async (title: string) => {
    const res = await axiosPostRequest(
      `/enrolledCourses/${courseId}/notebooks`,
      {
        title,
      }
    );
    if (!res) return;

    setNotebooks([...notebooks, res.data]);
  };

  const deleteNotebook = async (notebookId: string) => {
    const res = await axiosDeleteRequest(
      `/enrolledCourses/${courseId}/notebooks/${notebookId}`
    );
    if (!res) return;

    setNotebooks(notebooks.filter((notebook) => notebook._id !== notebookId));
  };

  const updateNotebook = async (
    notebookId: string,
    title: string,
    notes: string[]
  ) => {
    const res = await axiosPutRequest(
      `/enrolledCourses/${courseId}/notebooks/${notebookId}`,
      {
        title,
        notes,
      }
    );
    if (!res) return;
    setNotebooks(
      notebooks.map((notebook) =>
        notebook._id !== notebookId ? notebook : res.data
      )
    );
  };

  useEffect(() => {
    fetchWelcomeAiChat();
  }, []);

  return {
    aiChats,
    fetchWelcomeAiChat,
    sendAiChatMessage,
    notebooks,
    fetchNotebooks,
    addNotebook,
    deleteNotebook,
    updateNotebook,
  };
};

export default useViewCourse;
