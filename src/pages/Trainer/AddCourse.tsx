import { FC } from "react";

import {
  AddCourseBasicDetails,
  AddCourseRequirements,
  AddCourseSkillsCovered,
  BackButton,
} from "@/components";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import useAddCourse from "@/hooks/useAddCourse";
import TrainerLayout from "@/layouts/TrainerLayout";

const AddCourse: FC = () => {
  const {
    errors,
    register,
    setValue,
    trigger,
    watch,
    publishCourse,
    previewThumbnail,
    handleThumbnailChange,
  } = useAddCourse();

  return (
    <TrainerLayout>
      <BackButton />
      <Tabs defaultValue="basic_details" className="w-full my-5">
        <TabsList className="w-full min-w-48">
          <TabsTrigger value="basic_details" className="w-1/2">
            Basic Details
          </TabsTrigger>
          <TabsTrigger value="requirements" className="w-1/2">
            requirements
          </TabsTrigger>
          <TabsTrigger value="skills_covered" className="w-1/2">
            skills_covered
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basic_details">
          <AddCourseBasicDetails
            errors={errors}
            register={register}
            setValue={setValue}
            trigger={trigger}
            handleThumbnailChange={handleThumbnailChange}
            previewThumbnail={previewThumbnail}
            watch={watch}
          />
        </TabsContent>
        <TabsContent value="requirements">
          <AddCourseRequirements
            watch={watch}
            setValue={setValue}
            errors={errors}
            trigger={trigger}
          />
        </TabsContent>
        <TabsContent value="skills_covered">
          <AddCourseSkillsCovered
            watch={watch}
            setValue={setValue}
            errors={errors}
            trigger={trigger}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mb-5">
        <Button variant={"v2"} onClick={publishCourse}>
          Publish
        </Button>
      </div>
    </TrainerLayout>
  );
};

export default AddCourse;
