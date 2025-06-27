import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CourseCard,
  Footer,
  Loading,
  Profile,
  ProfileImage,
} from "@/components";
import { axiosGetRequest } from "@/config/axios";
import { UserLayout } from "@/layouts";
import { ICourseData } from "@/types/courseType";
import { IoChatbox } from "@/assets/icons";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui";
import { useSubscription } from "@/hooks";
import { get } from "http";
import { successPopup } from "@/utils/popup";
import { IProfile } from "@/types/userType";

interface ITrainer extends IProfile {
  courses: Array<ICourseData>;
}

const Trainer: FC = () => {
  const { trainerId } = useParams();
  const [trainer, setTrainer] = useState<ITrainer | null>(null);
  const navigate = useNavigate();
  const { getSubscriptionDetail, isSubscribed, getSubscription } =
    useSubscription();

  useEffect(() => {
    getSubscriptionDetail(async () => {});
    const fetchTrainer = async () => {
      const res = await axiosGetRequest(`/trainers/${trainerId}`);
      if (!res) return;
      setTrainer(res.data);
    };

    fetchTrainer();
  }, [trainerId]);

  const handleSubscription = () => {
    getSubscription((message: string | undefined) => {
      successPopup(message || "enrolled");
      getSubscriptionDetail(async () => {});
    });
  };

  if (!trainer) return <Loading />;

  return (
    <UserLayout>
      <section className="mt-5 mb-10">
        <div className="md:px-20">
          <Profile {...trainer} />
        </div>
        <div className="block px-10 mt-10 md:px-40">
          <h1 className="mb-2 text-xl md:text-2xl text-app-neutral font-tektur">
            Courses
          </h1>

          <div className="mt-5">
            <Carousel className="">
              <CarouselContent className="flex justify-center gap-2 sm:gap-4 lg:gap-6">
                {trainer.courses.map((course) => (
                  <div key={course._id} className="w-full max-w-[300px]">
                    <CourseCard
                      averageRating={course.averageRating || 0}
                      _id={course._id}
                      category={course.category.categoryName}
                      noOfEnrolled={course.noOfEnrolled}
                      noOfModules={course.moduleCount}
                      price={course.price}
                      thumbnail={course.thumbnail}
                      title={course.title}
                    />
                  </div>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>
      <Footer />
    </UserLayout>
  );
};

export default Trainer;
