import { Button } from "@/components/ui/button";
import { axiosGetRequest } from "@/config/axios";
import { COURSES_API } from "@/constants/API";
import UserLayout from "@/layouts/UserLayout";
import { ICourseDetails } from "@/types/courseType";
import { FC, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PiStudentBold } from "react-icons/pi";
import { MdViewModule } from "react-icons/md";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IoVideocam } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa6";
import { TbDiamondFilled } from "react-icons/tb";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Loading from "./Loading";

const CourseDetail: FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState<ICourseDetails | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}`);
      if (!res) return;
      setCourse(res.data);
    };

    fetchCourse();
  }, []);

  if (!course) return <Loading />;

  return (
    <UserLayout>
      <section className="w-full h-56 px-10 md:h-96">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/courses" className="md:text-lg text-app-neutral">
                Courses
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="md:text-lg text-app-neutral" />
            <BreadcrumbItem>
              <Link
                to={`/courses/${course._id}`}
                className="md:text-lg text-app-neutral"
              >
                {course.title}
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <img
          src={course.thumbnail}
          alt=""
          className="object-cover w-full h-48 mt-2 md:h-80"
        />
      </section>

      <section className="w-full py-5 md:px-16 lg:px-36 ">
        <p className="text-2xl text-center md:text-3xl text-app-secondary">
          {course.title}
        </p>
        <div className="flex flex-col items-center justify-between w-full h-2 gap-4 mt-5 md:flex-row">
          <div className="flex items-center gap-4 text-sm sm:text-lg lg:text-xl">
            {course.price == 0 ? (
              <p className="px-4 text-sm font-medium text-white rounded-sm bg-app-accent">
                Free
              </p>
            ) : (
              <p className=" text-app-accent">₹ {course.price}</p>
            )}
            <p className="px-4 text-sm font-medium text-white rounded-sm bg-app-tertiary first-letter:uppercase">
              {course.category.categoryName}
            </p>

            <p className="flex items-center gap-1 text-app-accent">
              {" "}
              <PiStudentBold className="md:text-2xl" />
              {100} enrolled
            </p>
            <p className="flex items-center gap-1 text-app-accent">
              <MdViewModule className="md:text-2xl" /> {course.modules.length}{" "}
              modules
            </p>
          </div>
          <Button
            variant={"v1"}
            onClick={() => navigate(`/user/enrolledCourses/${courseId}/view`)}
          >
            View Course
          </Button>
        </div>
      </section>

      <section className="flex flex-col w-full gap-16 px-10 py-5 mt-10 md:px-32 lg:px-56">
        <div>
          <h1 className="mb-2 text-xl text-app-neutral">Course Contents</h1>
          <Accordion type="single" collapsible className="w-full">
            {course.modules.map((module) => (
              <AccordionItem value={module._id} key={module._id}>
                <AccordionTrigger>{module.title}</AccordionTrigger>
                {module.lessons.map((lesson) => (
                  <AccordionContent key={lesson._id}>
                    <div className="flex gap-2">
                      {lesson.type == "video" ? (
                        <IoVideocam className="text-xl" />
                      ) : (
                        <FaFilePdf className="text-xl" />
                      )}

                      <p className="text-app-neutral">{lesson.title}</p>
                    </div>
                  </AccordionContent>
                ))}
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div>
          <h1 className="mb-2 text-xl text-app-neutral">What you will learn</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
            {course.skillsCovered.map((skill) => (
              <p className="flex items-center w-full gap-2 text-white md:text-lg">
                <TbDiamondFilled className="text-xl md:text-3xl text-app-secondary" />
                {skill}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h1 className="mb-2 text-xl text-app-neutral">Requirements</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
            {course.requirements.map((requirement) => (
              <p className="flex items-center w-full gap-2 text-white md:text-lg">
                <TbDiamondFilled className="text-xl md:text-3xl text-app-secondary" />
                {requirement}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h1 className="mb-2 text-xl text-app-neutral">Description</h1>

          <p className="font-light md:text-lg text-app-neutral">
            {course.description}
          </p>
        </div>
      </section>
    </UserLayout>
  );
};

export default CourseDetail;
