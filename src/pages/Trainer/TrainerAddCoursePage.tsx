import { TrainerCourseBasicDetails } from "@/components";
import { useAddCourse } from "@/hooks";
import { TrainerLayout } from "@/layouts";
import { AlertCircle } from "lucide-react";

const TrainerNewAddCoursePage = () => {
  const {
    categories,
    errors,
    onSave,
    register,
    setValue,
    trigger,
    watch,
    handleThumbnailChange,
    previewThumbnail,
  } = useAddCourse();

  return (
    <TrainerLayout>
      <div className="px-4 py-8 md:px-10 text-white space-y-8">
        {/* Info Alert */}
        <div className="flex items-center gap-3 text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>You must add a course before adding modules.</span>
        </div>

        {/* Course Form */}
        <div className="w-full max-w-screen-xl mx-auto">
          <TrainerCourseBasicDetails
            errors={errors}
            register={register}
            setValue={setValue}
            trigger={trigger}
            watch={watch}
            submit={onSave}
            previewThumbnail={previewThumbnail}
            handleThumbnailChange={handleThumbnailChange}
            categories={categories}
          />
        </div>
      </div>
    </TrainerLayout>
  );
};

export default TrainerNewAddCoursePage;
