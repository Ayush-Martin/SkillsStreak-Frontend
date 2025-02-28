import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosGetRequest, axiosPatchRequest } from "@/config/axios";
import { TRAINER_MODULE_API } from "@/constants/API";
import TrainerLayout from "@/layouts/TrainerLayout";
import { successPopup } from "@/utils/popup";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BackButton } from "@/components";

const EditModule = () => {
  const { moduleId } = useParams();
  const [title, setTitle] = useState("");
  const [module, setModule] = useState<{
    _id: string;
    title: string;
    order: number;
  }>({ _id: "", title: "", order: 0 });

  useEffect(() => {
    const fetchModule = async () => {
      const res = await axiosGetRequest(`${TRAINER_MODULE_API}/${moduleId}`);
      if (!res) return;
      setModule(res.data);
      setTitle(res.data.title);
    };

    fetchModule();
  }, []);

  const updateTitle = async () => {
    const res = await axiosPatchRequest(`${TRAINER_MODULE_API}/${moduleId}`, {
      title,
    });

    if (!res) return;
    setModule({ ...module, title });
    successPopup(res.message || "updated");
  };

  return (
    <TrainerLayout>
      <BackButton />
      <p className="mb-2 text-xl text-app-accent">Title</p>
      <div className="flex gap-2 w-[300px]">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-app-border"
        />
        <Button onClick={updateTitle}>Change</Button>
      </div>
    </TrainerLayout>
  );
};

export default EditModule;
