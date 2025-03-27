import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CourseCard, Footer, UserHeader } from "@/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui";
import {
  HERO_SECTION,
  FEATURES_SECTION,
  POPULAR_COURSES_SECTION,
  SUBSCRIPTION_FEATURES_SECTION,
  FAQ_SECTION,
} from "@/constants/sections";
import { ICourseData } from "@/types/courseType";
import { COURSES_API } from "@/constants";
import { axiosGetRequest } from "@/config/axios";
import { CourseCardSkeleton } from "@/components/skeletons";

const PAGE_RECORD_LIMIT = 10;

const Home: FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Array<ICourseData>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchCourses = async () => {
      const params = new URLSearchParams({
        page: "1",
        search: "",
        category: "all",
        difficulty: "all",
        price: "all",
        limit: PAGE_RECORD_LIMIT.toString(),
        sort: "popularity",
      });

      const res = await axiosGetRequest(`${COURSES_API}?${params.toString()}`);
      if (!res) return;
      setCourses(res.data.courses);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <main className="relative bg-app-primary">
      <UserHeader />

      <section className="min-h-screen ">
        <div className="h-[500px] sm-h-[600px] relative">
          <img
            src={HERO_SECTION.image}
            alt=""
            className="object-cover h-[500px] sm-h-[600px] object-top w-full "
          />
          <div className="absolute top-0 w-full h-full px-5 py-64 sm:pl-10 md:pl-20 md:w-1/2 md:py-36 lg:py-48">
            <h1
              className="text-xl text-white md:leading-loose lg:text-3xl font-boldonse "
              style={{
                textShadow: "2px 2px 4px rgba(175, 136, 242, 0.6)",
              }}
            >
              {HERO_SECTION.title}
            </h1>
            <h2 className="mt-3 text-sm leading-tight text-white md:text-lg font-winkysans">
              {HERO_SECTION.subtitle}
            </h2>

            <Button
              className="mt-3"
              variant={"v3"}
              onClick={() => navigate("/courses")}
            >
              {HERO_SECTION.exploreButton}
            </Button>
          </div>
        </div>

        <section className="flex flex-col gap-16 px-10 py-10 md:px-20">
          <div>
            <h1 className="text-2xl text-center text-white font-tektur">
              {FEATURES_SECTION.title}
            </h1>

            <div className="grid grid-cols-1 gap-5 mt-10 md:grid-cols-2 lg:grid-cols-4">
              {FEATURES_SECTION.features.map((feature) => (
                <div
                  key={feature.title}
                  className="w-full px-3 py-4 transition-all duration-300 border rounded-md border-app-border hover:bg-app-border hover:scale-105"
                >
                  <div className="flex items-center justify-center">
                    <img src={feature.icon} alt="" className="w-24" />
                  </div>
                  <h1 className="mt-2 text-xl text-center text-white font-josefinsans">
                    {feature.title}
                  </h1>
                  <p className="mt-2 text-center text-app-neutral font-winkysans">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-2xl text-center text-white font-tektur">
              {POPULAR_COURSES_SECTION.title}
            </h1>

            <div className="px-5 mt-5">
              <Carousel className="">
                <CarouselContent className="flex justify-center gap-2 sm:gap-4 lg:gap-6">
                  {loading
                    ? Array.from(
                        { length: PAGE_RECORD_LIMIT },
                        (_, i) => i
                      ).map((index) => (
                        <div key={index} className="w-full max-w-[300px]">
                          <CourseCardSkeleton />
                        </div>
                      ))
                    : courses.map((course) => (
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
          <div>
            <h1 className="text-2xl text-center text-white font-tektur">
              {SUBSCRIPTION_FEATURES_SECTION.title}
            </h1>
            <div className="flex flex-col flex-1 w-full gap-5 mt-5">
              {SUBSCRIPTION_FEATURES_SECTION.features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`flex justify-center w-full ${
                    index % 2 ? "sm:justify-end" : "sm:justify-start"
                  }`}
                >
                  <div className="sm:flex sm:w-3/4 lg:w-3/5 gap-6 rounded-md bg-[#112734] hover:bg-app-border hover:scale-105 transition-all duration-300 ease-in-out">
                    <img
                      src={feature.image}
                      alt=""
                      className="object-cover w-full h-40 rounded-md md:h-auto md:w-52"
                    />
                    <div className="flex flex-col items-center justify-center gap-2 p-2">
                      <h1 className="text-lg text-center text-white md:text-xl font-josefinsans">
                        {feature.title}
                      </h1>
                      <p className="text-sm text-center md:text-base text-app-neutral font-winkysans">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-2xl text-center text-white font-tektur">
              {FAQ_SECTION.title}
            </h1>
            <Accordion type="single" collapsible className="mt-5 lg:mx-40 ">
              {FAQ_SECTION.faqs.map((faq) => (
                <AccordionItem value={faq.question} key={faq.question}>
                  <AccordionTrigger className="text-lg md:text-xl font-josefinsans">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="md:text-lg">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </section>
      <Footer />
    </main>
  );
};

export default Home;
