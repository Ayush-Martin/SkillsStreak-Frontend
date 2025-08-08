import {
  AdminCourseBasicDetail,
  AdminQuestions,
  BackButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components";
import { useEditQuiz } from "@/hooks";
import { AdminLayout } from "@/layouts";

const AdminEditQuizPage = () => {
  const {
    editQuizBasicDetails,
    errors,
    register,
    setValue,
    topics,
    trigger,
    watch,
    addQuestion,
    deleteQuestion,
    editQuestion,
    fetchQuestions,
    questions,
  } = useEditQuiz();

  return (
    <AdminLayout>
      <BackButton />

      <Tabs defaultValue="basic_details" className="w-full my-5">
        <TabsList className="w-full overflow-x-auto min-w-48">
          <TabsTrigger value="basic_details" className="w-full">
            Basic Details
          </TabsTrigger>
          <TabsTrigger value="questions" className="w-full">
            Questions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basic_details">
          <AdminCourseBasicDetail
            errors={errors}
            submit={editQuizBasicDetails}
            register={register}
            setValue={setValue}
            topics={topics}
            trigger={trigger}
            watch={watch}
          />
        </TabsContent>
        <TabsContent value="questions">
          <AdminQuestions
            addQuestion={addQuestion}
            deleteQuestion={deleteQuestion}
            editQuestion={editQuestion}
            fetchQuestions={fetchQuestions}
            questions={questions}
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminEditQuizPage;
