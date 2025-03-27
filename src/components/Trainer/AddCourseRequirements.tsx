import { FC, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldErrors,
  useForm,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";

import { addCourseSchemaType } from "@/hooks/useAddCourse";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { ErrorText } from "@/components";
import {
  IoIosSave,
  RiFolderCloseFill,
  MdDelete,
  MdEdit,
  IoMdAddCircleOutline,
} from "@/assets/icons";

interface IAddCourseRequirementsProps {
  watch: UseFormWatch<addCourseSchemaType>;
  setValue: UseFormSetValue<addCourseSchemaType>;
  errors: FieldErrors<addCourseSchemaType>;
  trigger: UseFormTrigger<addCourseSchemaType>;
}

interface IAddCourseRequirementsEditProps {
  requirement: string;
  requirements: string[];
  submit: (requirement: string) => void;
}

const CourseRequirementSchema = z.object({
  requirement: z.string().min(1, "Requirement is required"),
});

type AddCourseRequirementsEditSchemaType = z.infer<
  typeof CourseRequirementSchema
>;

const AddCourseRequirementsEdit: FC<IAddCourseRequirementsEditProps> = ({
  requirement,
  requirements,
  submit,
}) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    trigger,
    watch,
  } = useForm<AddCourseRequirementsEditSchemaType>({
    resolver: zodResolver(CourseRequirementSchema),
    defaultValues: { requirement },
  });

  return (
    <form
      className="flex-col"
      onSubmit={handleSubmit(({ requirement }) => submit(requirement))}
    >
      <div className="flex gap-2">
        <Input
          placeholder="Enter category name"
          {...register("requirement")}
          className="bg-transparent border w-30 border-app-border"
          onBlur={() => trigger("requirement")}
        />
        <button
          type="submit"
          className="text-xl text-app-secondary"
          disabled={
            requirements.includes(watch("requirement")) &&
            watch("requirement") != requirement
          }
        >
          <IoIosSave />
        </button>
        <button onClick={close} className="text-xl text-app-tertiary">
          <RiFolderCloseFill />
        </button>
      </div>
      {errors.requirement && <ErrorText error={errors.requirement.message!} />}
    </form>
  );
};

const AddCourseRequirements: FC<IAddCourseRequirementsProps> = ({
  watch,
  setValue,
  errors,
  trigger,
}) => {
  const [requirements, setRequirements] = useState(watch("requirements") || []);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<null | string>();

  const addRequirement = () => {
    const updatedRequirements = [...requirements, input];
    setRequirements(updatedRequirements);
    setValue("requirements", updatedRequirements);
    trigger("requirements");
  };

  const deleteRequirement = (requirement: string) => {
    const updatedRequirements = requirements.filter((x) => x != requirement);
    setRequirements(updatedRequirements);
    setValue("requirements", updatedRequirements);
    trigger("requirements");
    setInput("");
  };

  const editRequirement = (oldRequirement: string, requirement: string) => {
    const updatedRequirements = requirements.map((x) =>
      x == oldRequirement ? requirement : x
    );
    setRequirements(updatedRequirements);
    setValue("requirements", updatedRequirements);
    setSelected(null);
    trigger("requirements");
  };

  return (
    <div className="my-10">
      <div className="flex gap-4">
        <Input
          className="bg-transparent border w-60 border-app-border placeholder:text-muted-foreground"
          placeholder="enter text here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={addRequirement}
          disabled={!input || requirements.includes(input)}
          className="text-3xl text-white disabled:text-app-border"
        >
          <IoMdAddCircleOutline />
        </button>
      </div>
      {errors.requirements && (
        <ErrorText error={errors.requirements.message!} />
      )}

      <Table className="mt-10 max-w-[800px] border border-app-border">
        <TableHeader className="rounded-md ">
          <TableRow className="border-b-4 border-green-300 ">
            <TableHead className="text-white font-josefinsans ">
              Requirement
            </TableHead>
            <TableHead className="text-white font-josefinsans ">Edit</TableHead>
            <TableHead className="text-white font-josefinsans ">
              Delete
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!requirements.length ? (
            <p className="px-4 my-3 text-lg font-tektur">
              No requirement added
            </p>
          ) : (
            requirements.map((requirement) => (
              <TableRow
                key={requirement}
                className="border-app-border text-app-neutral font-winkysans"
              >
                <TableCell>
                  {selected == requirement ? (
                    <AddCourseRequirementsEdit
                      requirement={requirement}
                      requirements={requirements}
                      submit={(editedRequirement) => {
                        editRequirement(requirement, editedRequirement);
                      }}
                    />
                  ) : (
                    requirement
                  )}
                </TableCell>
                <TableCell
                  onClick={() => setSelected(requirement)}
                  className="text-2xl cursor-pointer text-app-accent"
                >
                  <MdEdit />
                </TableCell>
                <TableCell
                  onClick={() => deleteRequirement(requirement)}
                  className="text-2xl text-red-500 cursor-pointer"
                >
                  <MdDelete />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AddCourseRequirements;
