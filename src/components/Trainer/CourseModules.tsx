import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";
import { MdEdit, MdDelete, FaFileVideo, FaFilePdf } from "@/assets/icons";
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
  const [open, setOpen] = useState(false);
  const [modules, setModules] = useState<Array<ModuleType>>([]);

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

  const addModule = async (title: string) => {
    setOpen(false);

    const res = await axiosPostRequest(
      `${TRAINER_COURSES_API}/${course._id}/modules`,
      {
        title,
      }
    );

    if (!res) return;
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
    <div className="relative">
      <div className="flex justify-center my-4">
        <Button variant={"v2"} onClick={() => setOpen(true)}>
          Add Module
        </Button>
      </div>
      {open && <AddModule close={() => setOpen(false)} addModule={addModule} />}

      <div className="flex flex-col gap-7">
        {modules.map((module) => (
          <div className="w-full px-5 py-2 bg-app-border" key={module._id}>
            <div className="flex justify-between">
              <h1 className="text-xl text-app-neutral">{module.title}</h1>
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
              <div className="flex flex-col gap-2 mt-3">
                {module.lessons.map((lesson) => (
                  <div className="flex items-center gap-2 " key={lesson._id}>
                    {lesson.type == "video" ? (
                      <FaFileVideo className="text-xl" />
                    ) : (
                      <FaFilePdf className="text-xl" />
                    )}
                    <h1>{lesson.title}</h1>
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
