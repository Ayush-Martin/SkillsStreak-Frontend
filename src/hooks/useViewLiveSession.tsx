import { axiosGetRequest } from "@/config/axios";
import { getSocket } from "@/config/socket";
import { COURSES_API, SocketEvents } from "@/constants";
import { IViewLiveSession } from "@/types/courseType";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const useViewLiveSession = () => {
  const [courseAccess, setCourseAccess] = useState<boolean>(false);
  const [liveSessions, setLiveSessions] = useState<Array<IViewLiveSession>>([]);
  const [liveChats, setLiveChats] = useState<
    {
      userId: string;
      message: string;
      username: string;
      profileImage: string;
    }[]
  >([]);
  const [currentSelectedSession, setCurrentSelectedSession] =
    useState<IViewLiveSession | null>(null);
  const socket = useMemo(() => getSocket(), []);
  const { courseId } = useParams();

  useEffect(() => {
    const joinLiveChat = async () => {
      await axiosGetRequest(
        `${COURSES_API}/${courseId}/liveSessions/${currentSelectedSession?._id}`
      );
    };

    if (currentSelectedSession && currentSelectedSession.status === "live") {
      joinLiveChat();
    }
  }, [currentSelectedSession]);

  useEffect(() => {
    if (socket) {
      socket.on(
        SocketEvents.LIVE_CHAT_MESSAGE_BROADCAST,
        (chat: {
          userId: string;
          message: string;
          username: string;
          profileImage: string;
        }) => {
          console.log("Received live chat message:", chat);
          setLiveChats((prev) => [...prev, chat]);
        }
      );
    }
  }, [socket]);

  useEffect(() => {
    const fetchRecordedSessions = async () => {
      const res = await axiosGetRequest(
        `${COURSES_API}/${courseId}/liveSessions`
      );
      if (!res) return;
      setLiveSessions(res.data);
    };

    const fetchAccess = async () => {
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}/access`);
      setCourseAccess(false);
      if (!res) return;
      setCourseAccess(true);
    };

    fetchAccess();
    fetchRecordedSessions();
  }, []);

  const viewSession = (liveSessionId: string) => {
    setCurrentSelectedSession(
      liveSessions.find((liveSession) => liveSession._id === liveSessionId) ||
        null
    );
  };

  const sendMessage = (message: string) => {
    if (socket && currentSelectedSession) {
      socket.emit(SocketEvents.LIVE_CHAT_MESSAGE_SEND, {
        message,
        liveSessionId: currentSelectedSession._id,
      });
    }
  };

  return {
    courseAccess,
    liveSessions,
    viewSession,
    currentSelectedSession,
    courseId,
    sendMessage,
    liveChats,
  };
};

export default useViewLiveSession;
