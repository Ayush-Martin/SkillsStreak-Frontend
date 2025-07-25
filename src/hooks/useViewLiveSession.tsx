import { axiosGetRequest } from "@/config/axios";
import { COURSES_API } from "@/constants";
import { IViewLiveSession } from "@/types/courseType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useViewLiveSession = () => {
  const [courseAccess, setCourseAccess] = useState<boolean>(false);
  const [liveSessions, setLiveSessions] = useState<Array<IViewLiveSession>>([]);
  const [currentSelectedSession, setCurrentSelectedSession] =
    useState<IViewLiveSession | null>(null);

  const { courseId } = useParams();

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

  return { courseAccess, liveSessions, viewSession, currentSelectedSession };
};

export default useViewLiveSession;
