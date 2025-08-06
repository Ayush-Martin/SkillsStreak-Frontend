import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components";
import {
  axiosGetRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";
import AuthLayout from "@/layouts/AuthLayout";
import { successPopup } from "@/utils/popup";
import { TRAINER_REQUEST_API } from "@/constants/API";
import { checkProfileCompleted } from "@/api";

type TrainerRequestStatus = "pending" | "approved" | "rejected";

interface RequestState {
  status: TrainerRequestStatus;
  rejectedReason?: string;
}

const TrainerRequest: FC = () => {
  const navigate = useNavigate();
  const [isCompletedProfile, setIsCompletedProfile] = useState<boolean | null>(
    null
  );
  const [requestStatus, setRequestStatus] = useState<RequestState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [completed, requestRes] = await Promise.all([
      await checkProfileCompleted(),
      axiosGetRequest(TRAINER_REQUEST_API),
    ]);

    setIsCompletedProfile(completed);
    if (requestRes?.data) setRequestStatus(requestRes.data);

    setLoading(false);
  };

  const sendTrainerRequest = async () => {
    const res = await axiosPostRequest(TRAINER_REQUEST_API, {});
    if (!res) return;
    successPopup(res.message || "Trainer request sent");
  };

  const resendTrainerRequest = async () => {
    const res = await axiosPutRequest(TRAINER_REQUEST_API, {});
    if (!res) return;
    successPopup(res.message || "Trainer request sent");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center text-app-neutral animate-pulse">
          Loading trainer request...
        </div>
      );
    }

    if (!isCompletedProfile) {
      return (
        <>
          <p className="text-sm text-red-400">
            You need to complete your profile before sending a trainer request.
          </p>
          <div className="mt-6 px-28">
            <Button
              variant="v1"
              size="full"
              onClick={() => navigate("/user/profile")}
            >
              Complete Profile
            </Button>
          </div>
        </>
      );
    }

    if (requestStatus) {
      const { status, rejectedReason } = requestStatus;

      if (status === "approved") {
        return (
          <div className="bg-green-900 border border-green-700 rounded-xl p-5 text-green-300 shadow">
            <h2 className="text-xl font-semibold mb-2">✅ Approved</h2>
            <p>You are now a trainer. Congratulations!</p>
          </div>
        );
      }

      if (status === "pending") {
        return (
          <div className="bg-yellow-900 border border-yellow-700 rounded-xl p-5 text-yellow-200 shadow animate-pulse">
            <h2 className="text-xl font-semibold mb-2">⏳ Pending</h2>
            <p>Your request is under review by the admin.</p>
          </div>
        );
      }

      if (status === "rejected") {
        return (
          <>
            <div className="bg-red-950 border border-red-700 text-red-300 rounded-xl p-5 text-left shadow-lg w-full">
              <h2 className="text-xl font-semibold text-red-400 mb-2">
                ❌ Rejected
              </h2>
              <p className="text-sm">
                <span className="block mb-1 font-medium">Reason:</span>
                {rejectedReason || "No reason provided."}
              </p>
            </div>
            <div className="mt-6 px-28">
              <Button variant="v1" size="full" onClick={resendTrainerRequest}>
                Reapply for Trainer
              </Button>
            </div>
          </>
        );
      }
    } 
 
    return (
      <>
        <p className="text-sm text-app-neutral">
          You're eligible to become a trainer. Click below to send a request to
          the admin.
        </p>
        <div className="mt-6 px-28">
          <Button variant="v1" size="full" onClick={sendTrainerRequest}>
            Send Trainer Request
          </Button>
        </div>
      </>
    );
  };

  return (
    <AuthLayout>
      <div className="max-w-[570px] w-full py-10 mx-auto text-center flex flex-col gap-6 px-4">
        <h1 className="text-3xl font-bold text-app-neutral">Trainer Request</h1>
        <p className="text-base md:text-lg text-app-neutral">
          Send a trainer request to the admin after completing your profile.
        </p>
        {renderContent()}
      </div>
    </AuthLayout>
  );
};

export default TrainerRequest;
