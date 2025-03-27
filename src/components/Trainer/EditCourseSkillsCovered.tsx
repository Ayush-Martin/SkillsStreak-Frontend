import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  IoIosSave,
  RiFolderCloseFill,
  MdDelete,
  MdEdit,
  IoMdAddCircleOutline,
} from "@/assets/icons";
import { ErrorText } from "@/components";
import { ICourse } from "@/types/courseType";
import { TRAINER_COURSES_API } from "@/constants/API";
import { axiosPatchRequest } from "@/config/axios";
import { successPopup } from "@/utils/popup";

interface IEditCourseSkillsCoveredProps {
  course: ICourse;
  setCourse: (course: ICourse) => void;
}

interface IEditCourseSkillsCoveredEditProps {
  skillCovered: string;
  skillsCovered: string[];
  submit: (skillCovered: string) => void;
}

const CourseSkillCoveredSchema = z.object({
  skillCovered: z.string().min(1, "SkillCovered is required"),
});

type EditCourseSkillsCoveredEditSchemaType = z.infer<
  typeof CourseSkillCoveredSchema
>;

const EditCourseSkillsCoveredEdit: FC<IEditCourseSkillsCoveredEditProps> = ({
  skillCovered,
  skillsCovered,
  submit,
}) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    trigger,
    watch,
  } = useForm<EditCourseSkillsCoveredEditSchemaType>({
    resolver: zodResolver(CourseSkillCoveredSchema),
    defaultValues: { skillCovered },
  });

  return (
    <form
      className="flex-col"
      onSubmit={handleSubmit(({ skillCovered }) => submit(skillCovered))}
    >
      <div className="flex gap-2">
        <Input
          placeholder="Enter category name"
          {...register("skillCovered")}
          className="bg-transparent border w-30 border-app-border"
          onBlur={() => trigger("skillCovered")}
        />
        <button
          type="submit"
          className="text-xl text-app-secondary"
          disabled={
            skillsCovered.includes(watch("skillCovered")) &&
            watch("skillCovered") != skillCovered
          }
        >
          <IoIosSave />
        </button>
        <button onClick={close} className="text-xl text-app-tertiary">
          <RiFolderCloseFill />
        </button>
      </div>
      {errors.skillCovered && (
        <ErrorText error={errors.skillCovered.message!} />
      )}
    </form>
  );
};

const EditCourseSkillsCovered: FC<IEditCourseSkillsCoveredProps> = ({
  course,
  setCourse,
}) => {
  const [skillsCovered, setSkillsCovered] = useState(course.skillsCovered);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<null | string>();

  const {
    setValue,
    trigger,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      skillsCovered: course.skillsCovered,
    },
  });

  const addSkillCovered = () => {
    const updatedSkillsCovered = [...skillsCovered, input];
    setSkillsCovered(updatedSkillsCovered);
    setValue("skillsCovered", updatedSkillsCovered);
    trigger("skillsCovered");
  };

  const deleteSkillCovered = (skillCovered: string) => {
    const updatedSkillsCovered = skillsCovered.filter((x) => x != skillCovered);
    setSkillsCovered(updatedSkillsCovered);
    setValue("skillsCovered", updatedSkillsCovered);
    trigger("skillsCovered");
  };

  const editSkillCovered = (oldSkillCovered: string, skillCovered: string) => {
    const updatedSkillsCovered = skillsCovered.map((x) =>
      x == oldSkillCovered ? skillCovered : x
    );
    setSkillsCovered(updatedSkillsCovered);
    setValue("skillsCovered", updatedSkillsCovered);
    setSelected(null);
    trigger("skillsCovered");
  };

  const submit = async (data: { skillsCovered: string[] }) => {
    const res = await axiosPatchRequest(
      `${TRAINER_COURSES_API}/${course._id}/skillsCovered `,
      data
    );

    if (!res) return;
    successPopup(res.message!);
    setCourse({ ...course, skillsCovered });
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
          onClick={addSkillCovered}
          disabled={!input || skillsCovered.includes(input)}
          className="text-3xl text-white disabled:text-app-border"
        >
          <IoMdAddCircleOutline />
        </button>
      </div>
      {errors.skillsCovered && (
        <ErrorText error={errors.skillsCovered.message!} />
      )}

      <Table className="mt-10 max-w-[800px] border border-app-border">
        <TableHeader className="rounded-md ">
          <TableRow className="border-b-4 border-green-300 ">
            <TableHead className="text-white font-josefinsans ">
              Skills Covered
            </TableHead>
            <TableHead className="text-white font-josefinsans ">Edit</TableHead>
            <TableHead className="text-white font-josefinsans ">
              Delete
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!skillsCovered.length ? (
            <p className="px-4 my-3 text-lg font-tektur">No skills added</p>
          ) : (
            skillsCovered.map((requirement) => (
              <TableRow
                key={requirement}
                className="border-app-border text-app-neutral font-winkysans"
              >
                <TableCell>
                  {selected == requirement ? (
                    <EditCourseSkillsCoveredEdit
                      skillCovered={requirement}
                      skillsCovered={skillsCovered}
                      submit={(editedRequirement) => {
                        editSkillCovered(requirement, editedRequirement);
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
                  onClick={() => deleteSkillCovered(requirement)}
                  className="text-2xl text-red-500 cursor-pointer"
                >
                  <MdDelete />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Button variant={"v3"} onClick={handleSubmit(submit)} className="mt-5">
        Save
      </Button>
    </div>
  );
};

export default EditCourseSkillsCovered;
