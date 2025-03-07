import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { IoIosSave, RiFolderCloseFill, MdDelete, MdEdit } from "@/assets/icons";
import { ErrorText } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICourse } from "@/types/courseType";
import { TRAINER_COURSES_API } from "@/constants/API";
import { axiosPatchRequest } from "@/config/axios";
import { successPopup } from "@/utils/popup";

interface IEditCourseRequirementsProps {
  course: ICourse;
  setCourse: (course: ICourse) => void;
}

interface IEditCourseRequirementsEditProps {
  requirement: string;
  requirements: string[];
  submit: (requirement: string) => void;
}

const CourseRequirementSchema = z.object({
  requirement: z.string().min(1, "Requirement is required"),
});

type EditCourseRequirementsSchemaType = z.infer<typeof CourseRequirementSchema>;

const EditCourseRequirementsEdit: FC<IEditCourseRequirementsEditProps> = ({
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
  } = useForm<EditCourseRequirementsSchemaType>({
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
          className="w-30 bg-app-border"
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

const EditCourseRequirements: FC<IEditCourseRequirementsProps> = ({
  course,
  setCourse,
}) => {
  const [requirements, setRequirements] = useState(course.requirements);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<null | string>();

  const {
    setValue,
    trigger,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      requirements: course.requirements,
    },
  });

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

  const submit = async (data: { requirements: string[] }) => {
    const res = await axiosPatchRequest(
      `${TRAINER_COURSES_API}/${course._id}/requirements`,
      data
    );

    if (!res) return;
    successPopup(res.message!);
    setCourse({ ...course, requirements });
  };

  return (
    <div className="my-10">
      <div className="flex gap-4">
        <Input
          className="w-60 bg-app-border"
          placeholder="enter text here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          variant={"v1"}
          onClick={addRequirement}
          disabled={!input || requirements.includes(input)}
        >
          Add
        </Button>
      </div>
      {errors.requirements && (
        <ErrorText error={errors.requirements.message!} />
      )}

      <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>Requirement</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!requirements.length ? (
            <p className="text-xl">No requirement</p>
          ) : (
            requirements.map((requirement) => (
              <TableRow key={requirement}>
                <TableCell>
                  {selected == requirement ? (
                    <EditCourseRequirementsEdit
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
      <Button variant={"v3"} onClick={handleSubmit(submit)}>
        Save
      </Button>
    </div>
  );
};

export default EditCourseRequirements;
