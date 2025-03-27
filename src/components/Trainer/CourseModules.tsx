import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Input } from "@/components/ui";
import {
  MdEdit,
  MdDelete,
  FaFileVideo,
  FaFilePdf,
  IoMdAddCircleOutline,
} from "@/assets/icons";
import { ICourse } from "@/types/courseType";
import {
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPostRequest,
} from "@/config/axios";
import { TRAINER_COURSES_API } from "@/constants/API";
import { successPopup } from "@/utils/popup";
import { AddModule } from "@/components";
import { ModuleType } from "@/types/courseType";

interface ICourseModulesParams {
  course: ICourse;
}

const CourseModules: FC<ICourseModulesParams> = ({ course }) => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Array<ModuleType>>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      const res = await axiosGetRequest(
        `${TRAINER_COURSES_API}/${course._id}/modules`
      );
      if (!res) return;
      setModules(res.data);
    };

    fetchModules();
  }, []);

  const addModule = async () => {
    const res = await axiosPostRequest(
      `${TRAINER_COURSES_API}/${course._id}/modules`,
      {
        title: input,
      }
    );

    if (!res) return;
    setInput("");
    setModules([...modules, res.data]);
    successPopup(res.message || "added");
  };

  const deleteModule = async (moduleId: string) => {
    const res = await axiosDeleteRequest(
      `${TRAINER_COURSES_API}/${course._id}/modules/${moduleId}`
    );

    if (!res) return;
    successPopup(res.message || "deleted");
    const updatedModules = modules.filter((module) => module._id != moduleId);
    setModules(updatedModules);
  };

  return (
    <div className="relative my-10">
      <div className="flex gap-4">
        <Input
          className="bg-transparent border w-60 border-app-border placeholder:text-muted-foreground"
          placeholder="enter text here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={addModule}
          disabled={!input}
          className="text-3xl text-white disabled:text-app-border"
        >
          <IoMdAddCircleOutline />
        </button>
      </div>

      <div className="flex flex-col pt-5 mt-10 border-t gap-7 border-app-highlight">
        {modules.map((module) => (
          <div
            className="w-full px-5 py-2 border rounded-md border-app-border max-w-[600px]"
            key={module._id}
          >
            <div className="flex justify-between">
              <h1 className="text-2xl border-b-2 border-green-400 text-app-neutral font-winkysans ">
                {module.title}
              </h1>
              <div className="flex gap-2 text-xl ">
                <button
                  className="text-app-accent"
                  onClick={() =>
                    navigate(`/trainer/courses/${course._id}/${module._id}`)
                  }
                >
                  <MdEdit />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => deleteModule(module._id)}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
            {module.lessons && (
              <div className="flex flex-col gap-2 px-5 mt-5">
                {module.lessons.map((lesson) => (
                  <div
                    className="flex items-center gap-2 px-2 border-s-2 border-app-accent"
                    key={lesson._id}
                  >
                    {lesson.type == "video" ? (
                      <FaFileVideo className="text-xl" />
                    ) : (
                      <FaFilePdf className="text-xl" />
                    )}
                    <h1 className="font-playwritehu">{lesson.title}</h1>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseModules;
