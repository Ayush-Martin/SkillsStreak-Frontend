import { FC, useEffect, useState } from "react";
import {
  ClipboardList,
  Pencil,
  Trash2,
  FileText,
  BookOpen,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ErrorText } from "../common";
import { Input } from "../ui";
import { IAssignment } from "@/types/courseType";

interface ICourseAssignmentsProps {
  assignments: IAssignment[];
  fetchAssignments: () => void;
  addAssignment: (title: string, description: string, task: string) => void;
  editAssignment: (
    assignmentId: string,
    title: string,
    description: string,
    task: string
  ) => void;
  deleteAssignment: (assignmentId: string) => void;
}
const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  task: z.string().min(1, "Task is required"),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface IAssignmentModalProps {
  defaultValues?: {
    title: string;
    description: string;
    task: string;
  };
  onSubmit: (data: AssignmentFormData) => void;
  onClose: () => void;
}

const CourseAssignments: FC<ICourseAssignmentsProps> = ({
  addAssignment,
  editAssignment,
  deleteAssignment,
  assignments,
  fetchAssignments,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] =
    useState<IAssignment | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreate = () => {
    setEditingAssignment(null);
    setModalOpen(true);
  };

  const handleEdit = (assignment: IAssignment) => {
    setEditingAssignment(assignment);
    setModalOpen(true);
  };

  const handleSubmit = (data: {
    title: string;
    description: string;
    task: string;
  }) => {
    if (editingAssignment) {
      editAssignment(
        editingAssignment._id,
        data.title,
        data.description,
        data.task
      );
    } else {
      addAssignment(data.title, data.description, data.task);
    }
    setModalOpen(false);
  };

  return (
    <div className="text-white space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreate} className="px-6 py-2 text-white">
          <ClipboardList className="mr-2 w-5 h-5" /> Add Assignment
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-[#131722] border border-white/10 p-5 rounded-xl"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-500" />
                {assignment.title}
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="v1"
                  onClick={() => handleEdit(assignment)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteAssignment(assignment._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-zinc-300 mb-2">
              {assignment.description}
            </p>
            <p className="text-sm text-zinc-400 italic">{assignment.task}</p>
          </div>
        ))}
      </div>

      {modalOpen && (
        <AssignmentModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          defaultValues={editingAssignment ?? undefined}
        />
      )}
    </div>
  );
};

const AssignmentModal: FC<IAssignmentModalProps> = ({
  defaultValues,
  onSubmit,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      task: "",
    },
  });

  useEffect(() => {
    reset(defaultValues ?? { title: "", description: "", task: "" });
  }, [defaultValues]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#0c0f1a] border border-white/10 rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-500" />
            {defaultValues ? "Edit Assignment" : "Create Assignment"}
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
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Task</label>
            <Input
              {...register("task")}
              className="bg-[#141926] border-white/10 text-white"
            />
            {errors.task?.message && <ErrorText error={errors.task.message} />}
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {defaultValues ? "Save Changes" : "Create Assignment"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CourseAssignments;
