import { FC, useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Pencil,
  Trash2,
  Video,
  X,
  Eye,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, ErrorText } from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CourseLiveSessionSchema,
  ICourseLiveSessionSchema,
} from "@/validation/course.validation";
import { ILiveSession } from "@/types/courseType";

interface ILiveSessionModalProps {
  defaultValues?: ICourseLiveSessionSchema;
  onSubmit: (data: ICourseLiveSessionSchema) => void;
  onClose: () => void;
}

interface ICourseLiveSessionProps {
  sessions: ILiveSession[];
  fetchSessions: () => void;
  scheduleSession: (data: ICourseLiveSessionSchema) => void;
  editSession: (id: string, data: ICourseLiveSessionSchema) => void;
  deleteSession: (id: string) => void;
  viewSession: (id: string) => void;
}

const CourseLiveSession: FC<ICourseLiveSessionProps> = ({
  sessions,
  fetchSessions,
  scheduleSession,
  editSession,
  deleteSession,
  viewSession,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ILiveSession | null>(
    null
  );

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreate = () => {
    setEditingSession(null);
    setModalOpen(true);
  };

  const handleEdit = (session: ILiveSession) => {
    setEditingSession(session);
    setModalOpen(true);
  };

  const handleSubmit = (data: ICourseLiveSessionSchema) => {
    if (editingSession) {
      editSession(editingSession._id, data);
    } else {
      scheduleSession(data);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteSession(id);
  };

  return (
    <div className="text-white space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreate} className="px-6 py-2 text-white">
          <PlusCircle className="mr-2 w-5 h-5" /> Schedule Live Session
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div
            key={session._id}
            className="bg-[#131722] border border-white/10 p-5 rounded-xl"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{session.title}</h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="v1"
                  onClick={() => handleEdit(session)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(session._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-zinc-300 mb-2">{session.description}</p>

            <div className="text-sm text-zinc-400 mb-2 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-violet-500" />
              {session.date}
              <Clock className="w-4 h-4 ml-4 text-violet-500" />
              {session.time}
            </div>

            <p className="text-sm text-zinc-400 mb-3">
              Status:{" "}
              <span
                className={`capitalize font-medium ${
                  session.status === "live"
                    ? "text-green-400"
                    : session.status === "upcoming"
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
              >
                {session.status}
              </span>
            </p>

            {session.status === "upcoming" ? (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => viewSession(session._id)}
              >
                <Video className="w-4 h-4 mr-2" /> Go Live
              </Button>
            ) : session.status === "completed" ? (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => viewSession(session._id)}
              >
                <Eye className="w-4 h-4 mr-2" /> View Session
              </Button>
            ) : null}
          </div>
        ))}
      </div>

      {modalOpen && (
        <LiveSessionModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          defaultValues={
            editingSession
              ? {
                  title: editingSession.title,
                  description: editingSession.description,
                  date: editingSession.date,
                  time: editingSession.time,
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

const LiveSessionModal: FC<ILiveSessionModalProps> = ({
  defaultValues,
  onSubmit,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICourseLiveSessionSchema>({
    resolver: zodResolver(CourseLiveSessionSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      date: "",
      time: "",
    },
  });

  useEffect(() => {
    reset(
      defaultValues || {
        title: "",
        description: "",
        date: "",
        time: "",
      }
    );
  }, [defaultValues, reset]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#0c0f1a] border border-white/10 rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Video className="w-5 h-5 text-violet-500" />
            {defaultValues ? "Edit Session" : "Schedule Session"}
          </h2>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Title</label>
            <Input
              {...register("title")}
              className="bg-[#141926] border-white/10 text-white"
            />
            {errors.title?.message && (
              <ErrorText error={errors.title.message} />
            )}
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-1 block">
              Description
            </label>
            <Input
              {...register("description")}
              className="bg-[#141926] border-white/10 text-white"
            />
            {errors.description?.message && (
              <ErrorText error={errors.description.message} />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Date</label>
              <Input
                type="date"
                {...register("date")}
                className="bg-[#141926] border-white/10 text-white"
              />
              {errors.date?.message && (
                <ErrorText error={errors.date.message} />
              )}
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Time</label>
              <Input
                type="time"
                {...register("time")}
                className="bg-[#141926] border-white/10 text-white"
              />
              {errors.time?.message && (
                <ErrorText error={errors.time.message} />
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {defaultValues ? "Save Changes" : "Schedule Session"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CourseLiveSession;
