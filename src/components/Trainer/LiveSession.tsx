import { Link, useNavigate } from "react-router-dom";
import { Badge, Button } from "../ui";
import { ICourse, ILiveSession } from "@/types/courseType";
import { FC, useEffect, useState } from "react";
import { axiosGetRequest } from "@/config/axios";
import VideoPlayer from "../common/VideoPlayer";

interface ILiveSessionProps {
  course: ICourse;
}

interface ILiveSessionCard {
  liveSession: ILiveSession;
}

const LiveSessionCard: FC<ILiveSessionCard> = ({ liveSession }) => {
  return (
    <div className="w-full px-5 py-2 border rounded-md border-app-border max-w-[900px] flex flex-col md:flex-row items-center justify-between">
      <div className="md:w-1/2 mt-2">
        <VideoPlayer
          title={liveSession.title}
          url={liveSession.recordedSrc}
          thumbnail={liveSession.thumbnail}
        />
      </div>
      <div className="flex flex-col gap-3 items-center text-center md:w-1/2">
        <h1 className="text-xl border-b-2 border-green-400 text-app-neutral font-winkysans ">
          {liveSession.title}
        </h1>
        <p>{liveSession.description}</p>
        <div className="flex justify-between items-center gap-3">
          {liveSession.isPublic && (
            <Badge className="bg-orange-800 text-sm ">Public</Badge>
          )}
          {liveSession.isLive && (
            <Badge className="bg-blue-800 text-sm">Live</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

const LiveSession: FC<ILiveSessionProps> = ({ course }) => {
  const navigate = useNavigate();
  const [liveSessions, setLiveSessions] = useState<Array<ILiveSession>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLiveSessions = async () => {
      setLoading(true);
      const res = await axiosGetRequest(`/trainer/courses/${course._id}/live`);

      if (!res) return;
      setLiveSessions(res.data);
      setLoading(false);
    };

    fetchLiveSessions();
  }, []);

  console.log(liveSessions);

  return (
    <div className="relative my-10">
      <div className="flex gap-4">
        <Button
          variant={"v1"}
          onClick={() => navigate(`/trainer/courses/${course._id}/live/new`)}
        >
          Go Live
        </Button>
      </div>
      <div className="flex flex-col pt-10 mt-10 border-t gap-7 border-app-highlight">
        {liveSessions.map((liveSession) => (
          <LiveSessionCard liveSession={liveSession} key={liveSession._id} />
        ))}
      </div>
    </div>
  );
};

export default LiveSession;
