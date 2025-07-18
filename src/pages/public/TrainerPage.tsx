import { Loading, Profile } from "@/components";
import { axiosGetRequest } from "@/config/axios";
import { UserLayout } from "@/layouts";
import { ICourseCardData } from "@/types/courseType";
import { IUserProfile } from "@/types/userType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ITrainer extends IUserProfile {
  courses: Array<ICourseCardData>;
}

const TrainerPage = () => {
  const { trainerId } = useParams();
  const [trainer, setTrainer] = useState<ITrainer | null>(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      const res = await axiosGetRequest(`/trainers/${trainerId}`);
      if (!res) return;
      setTrainer(res.data);
    };

    fetchTrainer();
  }, [trainerId]);

  if (!trainer) return <Loading />;
  return (
    <UserLayout>
      <section className="my-10">
        <Profile {...trainer} />
      </section>
    </UserLayout>
  );
};

export default TrainerPage;
