import { Button, ScrollArea } from "@/components";
import { ILiveSession } from "@/types/courseType";
import { CalendarDays, Clock3, Video } from "lucide-react";
import { FC } from "react";

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "live":
      return (
        <span className="text-red-400 font-semibold animate-pulse text-sm">
          ● Live Now
        </span>
      );
    case "upcoming":
      return (
        <span className="text-yellow-400 font-medium text-sm">Upcoming</span>
      );
    case "completed":
      return (
        <span className="text-green-400 font-medium text-sm">Completed</span>
      );
    default:
      return null;
  }
};

interface ILiveSessionsAccordionProps {
  sessions: ILiveSession[];
  viewSession: (id: string) => void;
}

const LiveSessionsAccordion: FC<ILiveSessionsAccordionProps> = ({
  sessions,
  viewSession,
}) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-xl h-full">
      <ScrollArea className="h-full w-full pr-2 scroll-smooth">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
            Live Sessions
          </h2>
          <p className="text-white/60 text-sm">
            Track all your upcoming and completed live sessions here.
          </p>
        </div>

        <div className="space-y-5">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="border border-white/10 rounded-xl p-4 bg-white/5 backdrop-blur-md shadow-md cursor-pointer hover:border-white/20"
              onClick={() => viewSession(session._id)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text">
                  {session.title}
                </h3>
                {getStatusBadge(session.status)}
              </div>

              <div className="flex items-center gap-4 text-sm text-white/80 mt-2">
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock3 className="w-4 h-4" />
                  <span>{session.time}</span>
                </div>
              </div>

              <div className="mt-4">
                {session.status === "live" && (
                  <Button variant="destructive" className="w-full">
                    Join Now
                  </Button>
                )}
                {session.status === "upcoming" && (
                  <Button
                    variant="outline"
                    className="w-full text-yellow-400 border-yellow-400 hover:bg-yellow-500/10"
                  >
                    View Details
                  </Button>
                )}
                {session.status === "completed" && (
                  <Button
                    variant="secondary"
                    className="w-full flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Watch Recording
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LiveSessionsAccordion;
