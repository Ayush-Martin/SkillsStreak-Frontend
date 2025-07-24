import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModuleType } from "@/types/courseType";
import { FileText, Pencil, PlaySquare, Trash2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IModuleCardProps {
  id: string;
  title: string;
  lessons: ModuleType["lessons"];
  onDelete: (id: string) => void;
  editModule: (moduleId: string) => void;
}

interface ICourseNewModulesProps {
  modules: ModuleType[];
  fetchModules: () => void;
  addModule: (title: string) => void;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
}

const CourseNewModules: FC<ICourseNewModulesProps> = ({
  addModule,
  deleteModule,
  fetchModules,
  modules,
  editModule,
}) => {
  const [newModule, setNewModule] = useState("");

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          placeholder="Enter new module name"
          className="w-full sm:w-1/2 bg-[#131722] border border-white/10 text-white"
          value={newModule}
          onChange={(e) => setNewModule(e.target.value)}
        />
        <Button
          onClick={() => addModule(newModule)}
          className="px-6 py-2 font-semibold text-white"
        >
          Add Module
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {modules.map((module) => (
          <ModuleCard
            key={module._id}
            id={module._id}
            title={module.title}
            lessons={module.lessons}
            onDelete={deleteModule}
            editModule={editModule}
          />
        ))}
      </div>
    </div>
  );
};

const ModuleCard: FC<IModuleCardProps> = ({
  id,
  title: name,
  lessons,
  onDelete,
  editModule,
}) => {
  return (
    <div className="w-full border border-white/10 rounded-xl bg-[#131722] p-6 text-white transition-all hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold tracking-wide">{name}</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="v1" onClick={() => editModule(id)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid gap-3 pl-2">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="flex items-center gap-2 text-sm text-zinc-300"
          >
            {lesson.type === "video" ? (
              <PlaySquare className="w-4 h-4 text-blue-400" />
            ) : (
              <FileText className="w-4 h-4 text-green-400" />
            )}
            <span className="tracking-wide font-medium">{lesson.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseNewModules;
