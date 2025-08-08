import { AdminCourseBasicDetail } from "@/components";
import { useAddQuiz } from "@/hooks";
import { AdminLayout } from "@/layouts";
import { AlertCircle } from "lucide-react";

const AdminAddQuizPage = () => {
  const { errors, onSave, register, setValue, topics, trigger, watch } =
    useAddQuiz();

  return (
    <AdminLayout>
      {/* Alert */}
      <div className="flex items-center gap-3 text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-sm font-medium">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>You must add a quiz before adding questions.</span>
      </div>
      <AdminCourseBasicDetail
        topics={topics}
        errors={errors}
        register={register}
        setValue={setValue}
        trigger={trigger}
        watch={watch}
        submit={onSave}
      />
    </AdminLayout>
  );
};

export default AdminAddQuizPage;
