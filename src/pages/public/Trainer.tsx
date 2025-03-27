import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CourseCard, Footer, Loading, Profile } from "@/components";
import { axiosGetRequest } from "@/config/axios";
import { UserLayout } from "@/layouts";
import { ICourseData } from "@/types/courseType";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui";

interface ITrainer {
  username: string;
  email: string;
  profileImage: string;
  about: string;
  courses: Array<ICourseData>;
}

const Trainer: FC = () => {
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
      <section className="mt-5 mb-10">
        <Profile
          email={trainer.email}
          username={trainer.username}
          about={trainer.about}
          profileImage={trainer.profileImage}
        />
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
