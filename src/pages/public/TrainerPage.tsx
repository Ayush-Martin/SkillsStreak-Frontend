import { getTrainer } from "@/api/trainer.api";
import { Loading, Profile } from "@/components";
import { UserLayout } from "@/layouts";
import { IUserProfileDetails } from "@/types/userType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TrainerPage = () => {
  const { trainerId } = useParams();
  const [trainer, setTrainer] = useState<IUserProfileDetails | null>(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      const data = await getTrainer(trainerId!);
      if (!data) return;
      setTrainer(data);
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
