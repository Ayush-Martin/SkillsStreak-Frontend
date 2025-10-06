import { FC, useEffect, useMemo, useState } from "react";
import { ClipboardList, Pencil, Trash2, X, CheckCircle } from "lucide-react";
import { Button, ErrorText, Input } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { IQuestion } from "@/types/quizType";
import {
  QuestionSchemaType,
  QuestionSchema,
} from "@/validation/quiz.validation";

interface IAdminQuestionsProps {
  questions: IQuestion[];
  fetchQuestions: () => void;
  addQuestion: (question: QuestionSchemaType) => void;
  editQuestion: (questionId: string, question: QuestionSchemaType) => void;
  deleteQuestion: (questionId: string) => void;
}

const AdminQuestions: FC<IAdminQuestionsProps> = ({
  addQuestion,
  deleteQuestion,
  editQuestion,
  fetchQuestions,
  questions,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(
    null
  );

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleCreate = () => {
    setEditingQuestion(null);
    setModalOpen(true);
  };

  const handleEdit = (question: IQuestion) => {
    setEditingQuestion(question);
    setModalOpen(true);
  };

  const handleSubmit = (data: QuestionSchemaType) => {
    if (editingQuestion) {
      // Editing existing question
      editQuestion(editingQuestion._id, data);
    } else {
      // Adding new question
      addQuestion(data);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteQuestion(id);
  };

  return (
    <div className="text-white space-y-6 mt-5">
      <div className="flex justify-end">
        <Button onClick={handleCreate} className="px-6 py-2 text-white">
          <ClipboardList className="mr-2 w-5 h-5" /> Add Question
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {questions.map((q) => (
          <div
            key={q._id}
            className="bg-[#131722] border border-white/10 p-5 rounded-xl"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-base font-semibold">{q.question}</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="v1" onClick={() => handleEdit(q)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(q._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ul className="text-sm space-y-2 mt-2">
              {q.options.map((opt) => (
                <li
                  key={opt.id}
                  className={`flex items-center gap-2 ${
                    opt.id === q.answer ? "text-green-400" : "text-zinc-300"
                  }`}
                >
                  {opt.choice}
                  {opt.id === q.answer && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {modalOpen && (
        <QuestionModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          defaultValues={editingQuestion ?? undefined}
        />
      )}
    </div>
  );
};

interface IQuestionModalProps {
  defaultValues?: IQuestion;
  onSubmit: (data: QuestionSchemaType) => void;
  onClose: () => void;
}

const QuestionModal: FC<IQuestionModalProps> = ({
  defaultValues,
  onSubmit,
  onClose,
}) => {
  // Build stable initial values (preserve existing option.id or generate if missing)
  const initialValues = useMemo(() => {
    if (defaultValues) {
      const options =
        defaultValues.options?.map((opt) => ({
          id: opt.id ?? uuid(), // preserve DB id; generate if missing
          choice: opt.choice ?? "",
        })) ?? [];
      const answer =
        defaultValues.answer &&
        options.some((o) => o.id === defaultValues.answer)
          ? defaultValues.answer
          : "";
      return {
        question: defaultValues.question ?? "",
        options,
        answer,
      } as QuestionSchemaType;
    }
    return {
      question: "",
      options: [
        { id: uuid(), choice: "" },
        { id: uuid(), choice: "" },
      ],
      answer: "",
    } as QuestionSchemaType;
  }, [defaultValues]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<QuestionSchemaType>({
    resolver: zodResolver(QuestionSchema),
    mode: "onBlur",
    defaultValues: initialValues,
  });

  // Reset the form whenever modal opens or defaultValues change
  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  // IMPORTANT: set keyName so RHF doesn't overwrite our 'id' property
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
    keyName: "fieldId", // RHF's internal key will be field.fieldId, preserving field.id
  });

  const currentAnswer = watch("answer");

  const handleAnswerSelection = (optionId: string) => {
    // Set answer to the persistent option id (not RHF generated key)
    setValue("answer", optionId, { shouldValidate: true, shouldDirty: true });
    clearErrors("answer");
  };

  const handleSubmitForm = (data: QuestionSchemaType) => {
    // data.options will have { id, choice } entries and answer will be one of those ids
    onSubmit(data);
    reset(); // clear form state
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-[#0c0f1a] border border-white/10 rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {defaultValues ? "Edit Question" : "Create Question"}
          </h2>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          {/* Question */}
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Question</label>
            <Input
              {...register("question")}
              className="bg-[#141926] border-white/10 text-white"
            />
            {errors.question?.message && (
              <ErrorText error={errors.question.message} />
            )}
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400 block">
              Options (click the circle to mark as correct)
            </label>

            {fields.map((field, index) => {
              // field.id here is YOUR persistent id (because we used keyName)
              const optionId = field.id;
              return (
                <div key={field.fieldId} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                      currentAnswer === optionId
                        ? "border-green-500 bg-green-500"
                        : "border-zinc-400 hover:border-zinc-300"
                    }`}
                    onClick={() => handleAnswerSelection(optionId)}
                  >
                    {currentAnswer === optionId && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>

                  {/* Hidden input to ensure option id is part of values (safe but optional) */}
                  <input
                    type="hidden"
                    {...register(`options.${index}.id` as const)}
                    defaultValue={optionId}
                  />

                  <Input
                    {...register(`options.${index}.choice`)}
                    className="flex-1 bg-[#141926] border-white/10 text-white"
                    placeholder={`Option ${index + 1}`}
                  />

                  {fields.length > 2 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        // if removed option was selected as answer, clear answer
                        if (currentAnswer === optionId) {
                          setValue("answer", "", { shouldValidate: true });
                        }
                        remove(index);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              );
            })}

            {errors.options && (
              <ErrorText
                error={
                  (errors.options.message as string) ||
                  (errors.options.root?.message as string)
                }
              />
            )}
            {errors.answer?.message && (
              <ErrorText error={errors.answer.message} />
            )}

            <Button
              type="button"
              onClick={() =>
                append({
                  id: uuid(), // new persistent id for the new option
                  choice: "",
                })
              }
              className="mt-2"
            >
              + Add Option
            </Button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {defaultValues ? "Save Changes" : "Create Question"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminQuestions;
