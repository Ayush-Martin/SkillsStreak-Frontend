import { AdminCourseBasicDetail } from "@/components";
import { useAddQuiz } from "@/hooks";
import { AdminLayout } from "@/layouts";

const AdminAddQuizPage = () => {
  const { errors, onSave, register, setValue, topics, trigger, watch } =
    useAddQuiz();

  return (
    <AdminLayout>
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
