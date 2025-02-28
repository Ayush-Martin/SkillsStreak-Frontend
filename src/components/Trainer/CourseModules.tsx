import { FC, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { IoCloseCircle } from "react-icons/io5";
import { MdEdit, MdDelete, MdDragHandle } from "react-icons/md";
import { ICourse } from "@/hooks/useEditCourse";
import {
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPostRequest,
} from "@/config/axios";
import { TRAINER_COURSES_API, TRAINER_MODULE_API } from "@/constants/API";
import { successPopup } from "@/utils/popup";
import { useNavigate } from "react-router-dom";

interface IAddModuleParams {
  close: () => void;
  addModule: (module: string) => void;
}

interface ICourseModulesParams {
  course: ICourse;
}

const AddModule: FC<IAddModuleParams> = ({ close, addModule }) => {
  const [input, setInput] = useState("");

  return (
    <div className="flex justify-center">
      <div className="absolute top-0   bg-opacity-30 bg-white rounded-md backdrop-blur-sm  m-auto  w-[3 00px] h-[90px]">
        <div className="flex justify-end pt-3 pr-5">
          <button onClick={close} className="text-2xl text-app-accent">
            <IoCloseCircle />
          </button>
        </div>
        <div className="flex gap-2 mx-10 my-3">
          <Input
            placeholder="input"
            value={input}
            className="outline-none text-app-primary bg-app-neutral placeholder:text-app-highlight"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => addModule(input)}>Add</Button>
        </div>
      </div>
    </div>
  );
};

const CourseModules: FC<ICourseModulesParams> = ({ course }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modules, setModules] = useState<
    Array<{ _id: string; title: string; order: number }>
  >([]);

  useEffect(() => {
    const fetchModules = async () => {
      const res = await axiosGetRequest(`${TRAINER_COURSES_API}/${course._id}`);
      if (!res) return;
      setModules(res.data);
    };

    fetchModules();
  }, []);

  const addModule = async (title: string) => {
    setOpen(false);

    const res = await axiosPostRequest(`${TRAINER_COURSES_API}/${course._id}`, {
      title,
    });

    if (!res) return;
    setModules([...modules, res.data]);
    successPopup(res.message || "added");
  };

  const deleteModule = async (moduleId: string) => {
    const res = await axiosDeleteRequest(`${TRAINER_MODULE_API}/${moduleId}`);

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
              <h1 className="text-xl text-app-secondary">{module.title}</h1>
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
                <button className="text-2xl text-app-tertiary">
                  <MdDragHandle />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseModules;
