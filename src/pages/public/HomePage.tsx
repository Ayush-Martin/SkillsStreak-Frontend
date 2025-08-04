import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CourseCardSkeleton,
  CourseCard,
  Footer,
  UserHeader,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@/components";
import {
  HERO_SECTION,
  FEATURES_SECTION,
  POPULAR_COURSES_SECTION,
  SUBSCRIPTION_FEATURES_SECTION,
  FAQ_SECTION,
} from "@/constants/sections";
import { IUserCourseData } from "@/types/courseType";
import { getUserCourses } from "@/api/course.api";

const PAGE_RECORD_LIMIT = 3;

const Home: FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Array<IUserCourseData>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchCourses = async () => {
      const data = await getUserCourses({
        page: 1,
        search: "",
        category: "all",
        difficulty: "all",
        price: "all",
        size: PAGE_RECORD_LIMIT,
        sort: "popularity",
      });
      if (!data) return;
      setCourses(data);
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

            <div className="flex justify-center mt-10 lg:block sm:px-14 lg:px-24">
              <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-3">
                {loading
                  ? Array.from({ length: PAGE_RECORD_LIMIT }, (_, i) => i).map(
                      (index) => <CourseCardSkeleton key={index} />
                    )
                  : courses.map((course) => (
                      <CourseCard
                        linkPrefix="/courses"
                        averageRating={course.averageRating}
                        _id={course._id}
                        key={course._id}
                        category={course.category.categoryName}
                        noOfEnrolled={course.noOfEnrolled}
                        noOfModules={course.moduleCount}
                        price={course.price}
                        thumbnail={course.thumbnail}
                        title={course.title}
                      />
                    ))}
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl  text-center text-white font-tektur mb-10 tracking-wide">
              {SUBSCRIPTION_FEATURES_SECTION.title}
            </h1>

            <div className="flex flex-col gap-10 sm:mx-10">
              {SUBSCRIPTION_FEATURES_SECTION.features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`flex w-full px-4 ${
                    index % 2 ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="relative w-full sm:w-2/4 lg:w-3/5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.03] transition-transform duration-300 ease-in-out overflow-hidden group">
                    <div className="flex flex-col md:flex-row">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="object-cover w-full h-32 md:h-auto md:w-44 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                      />
                      <div className="flex flex-col justify-center p-6 md:p-8 gap-4 text-center md:text-left w-full">
                        <h2 className="text-white text-xl font-josefinsans font-semibold tracking-wide group-hover:text-cyan-400 transition-colors">
                          {feature.title}
                        </h2>
                        <p className="text-app-neutral font-winkysans leading-relaxed text-white/80">
                          {feature.description}
                        </p>
                      </div>
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
