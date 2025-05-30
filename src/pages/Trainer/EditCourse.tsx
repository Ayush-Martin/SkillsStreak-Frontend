import { FC } from "react";

import {
  BackButton,
  CourseModules,
  EditCourseBasicDetails,
  EditCourseRequirements,
  EditCourseSkillsCovered,
  LiveSession,
} from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import useEditCourse from "@/hooks/useEditCourse";
import TrainerLayout from "@/layouts/TrainerLayout";

const EditCourse: FC = () => {
  const { course, setCourse } = useEditCourse();

  return (
    <TrainerLayout>
      <BackButton />
      <Tabs defaultValue="basic_details" className="w-full my-5">
        <TabsList className="w-full overflow-x-auto min-w-48">
          <TabsTrigger value="basic_details" className="w-full">
            Basic Details
          </TabsTrigger>
          <TabsTrigger value="requirements" className="w-full">
            requirements
          </TabsTrigger>
          <TabsTrigger value="skills_covered" className="w-full">
            skills_covered
          </TabsTrigger>
          <TabsTrigger value="modules" className="w-full">
            Modules
          </TabsTrigger>
          <TabsTrigger value="live" className="w-full">
            Live Sessions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basic_details">
          {course && (
            <EditCourseBasicDetails course={course} setCourse={setCourse} />
          )}
        </TabsContent>
        <TabsContent value="requirements">
          {course && (
            <EditCourseRequirements course={course} setCourse={setCourse} />
          )}
        </TabsContent>
        <TabsContent value="skills_covered">
          {course && (
            <EditCourseSkillsCovered course={course} setCourse={setCourse} />
          )}
        </TabsContent>
        <TabsContent value="modules">
          {course && <CourseModules course={course} />}
        </TabsContent>
        <TabsContent value="live">
          {course && <LiveSession course={course} />}
        </TabsContent>
      </Tabs>
    </TrainerLayout>
  );
};

export default EditCourse;
