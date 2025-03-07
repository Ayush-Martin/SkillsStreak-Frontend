import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";
import { axiosGetRequest } from "@/config/axios";
import AuthLayout from "@/layouts/AuthLayout";
import { successPopup } from "@/utils/popup";

const TrainerRequest: FC = () => {
  const navigate = useNavigate();
  const sendTrainerRequest = async () => {
    const res = await axiosGetRequest("/user/trainerRequest");
    if (!res) return;
    successPopup(res.message || "request has been send");
    navigate("/");
  };
  return (
    <AuthLayout>
      <div className=" w-[570px] py-5  text-center flex flex-col gap-5">
        <h1 className="text-3xl text-app-neutral">Trainer Request</h1>
        <p className="text-sm md:text-lg text-app-neutral">
          To become trainer send trainer request to the admin
        </p>
        <div className="px-28">
          <Button variant={"v1"} size={"full"} onClick={sendTrainerRequest}>
            Send Request
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default TrainerRequest;
