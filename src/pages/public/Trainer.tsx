import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseCard, Footer, Loading } from "@/components";
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
  const navigate = useNavigate();

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
        <div className="px-10 sm:px-32">
          <div className="bg-gray-900 rounded-2xl p-8 block">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Trainer Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={trainer.profileImage}
                  alt={trainer.username}
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>

              {/* Trainer Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {trainer.username}
                </h3>
                <p className="text-blue-400 mb-4">{trainer.email}</p>
                {/* <p className="text-blue-400 mb-4">{course.trainer.experience}</p> */}
                <p className="text-gray-300 leading-relaxed text-app-neutral">
                  {trainer.about}
                </p>
                <button
                  className=" flex items-center text-green-400"
                  onClick={() => navigate(`/user/chats?trainerId=${trainerId}`)}
                >
                  <IoChatbox className="mr-2" size={20} />
                  Chat with Trainer
                </button>
              </div>
            </div>
          </div>
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
