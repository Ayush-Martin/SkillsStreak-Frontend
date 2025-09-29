import { Button } from "@/components";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronsUpDown } from "lucide-react";
import { FC, useState } from "react";
import { Link } from "react-router-dom";

interface ITrainerStudentsEnrolledCoursesProps {
  enrolledCourses: {
    _id: string;
    title: string;
    thumbnail: string;
    completedPercentage: number;
  }[];
}

const TrainerStudentsEnrolledCourses: FC<
  ITrainerStudentsEnrolledCoursesProps
> = ({ enrolledCourses }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[350px] space-y-2"
    >
      <div className="flex items-center justify-between px-4 space-x-4">
        <div>
          {/* First course */}
          <Link
            to={`/trainer/courses/${enrolledCourses[0]._id}`}
            className="flex items-center gap-4"
          >
            <img src={enrolledCourses[0].thumbnail} className="w-24 rounded" />
            <div>
              <p className="text-lg font-medium">{enrolledCourses[0].title}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${enrolledCourses[0].completedPercentage}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {enrolledCourses[0].completedPercentage}%
              </p>
            </div>
          </Link>

          {/* Collapsible rest */}
          <CollapsibleContent className="space-y-6 mt-4">
            {enrolledCourses.slice(1).map((course) => (
              <Link
                key={course._id}
                to={`/trainer/courses/${course._id}`}
                className="flex items-center gap-4"
              >
                <img src={course.thumbnail} className="w-20 rounded" />
                <div>
                  <p className="text-base">{course.title}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${course.completedPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.completedPercentage}%
                  </p>
                </div>
              </Link>
            ))}
          </CollapsibleContent>
        </div>

        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="w-4 h-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  );
};

export default TrainerStudentsEnrolledCourses;
