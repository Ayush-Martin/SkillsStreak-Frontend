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
import { IoIosSave, RiFolderCloseFill, MdDelete, MdEdit } from "@/assets/icons";
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
          className="w-30 bg-app-border"
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
          className="w-60 bg-app-border"
          placeholder="enter text here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          variant={"v1"}
          onClick={addSkillCovered}
          disabled={!input || skillsCovered.includes(input)}
        >
          Add
        </Button>
      </div>
      {errors.skillsCovered && (
        <ErrorText error={errors.skillsCovered.message!} />
      )}

      <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>SkillCovered</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!skillsCovered.length ? (
            <p className="text-xl">No skillCovered</p>
          ) : (
            skillsCovered.map((skillCovered) => (
              <TableRow key={skillCovered}>
                <TableCell>
                  {selected == skillCovered ? (
                    <EditCourseSkillsCoveredEdit
                      skillCovered={skillCovered}
                      skillsCovered={skillsCovered}
                      submit={(editedSkillCovered) => {
                        editSkillCovered(skillCovered, editedSkillCovered);
                      }}
                    />
                  ) : (
                    skillCovered
                  )}
                </TableCell>
                <TableCell
                  onClick={() => setSelected(skillCovered)}
                  className="text-2xl cursor-pointer text-app-accent"
                >
                  <MdEdit />
                </TableCell>
                <TableCell
                  onClick={() => deleteSkillCovered(skillCovered)}
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

export default EditCourseSkillsCovered;
