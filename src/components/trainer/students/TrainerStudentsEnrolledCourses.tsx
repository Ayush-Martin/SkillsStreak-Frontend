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
          <Link
            to={`/trainer/courses/${enrolledCourses[0]._id}`}
            className="flex items-center gap-4"
          >
            <img src={enrolledCourses[0].thumbnail} className="w-36" />
            <p className="text-lg">{enrolledCourses[0].title}</p>
          </Link>
          <CollapsibleContent className="space-y-10 ">
            {enrolledCourses.slice(1).map((course) => (
              <Link
                to={`/trainer/courses/${course._id}`}
                className="flex items-center gap-4 my-3"
              >
                <img src={course.thumbnail} className="w-36" />
                <p className="text-lg">{course.title}</p>
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
