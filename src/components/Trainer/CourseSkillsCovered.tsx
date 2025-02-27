import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  FieldErrors,
  useForm,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import { addCourseSchemaType } from "@/hooks/useAddCourse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { IoIosSave } from "react-icons/io";
import { RiFolderCloseFill } from "react-icons/ri";
import ErrorText from "../ErrorText";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdDelete, MdEdit } from "react-icons/md";

interface ICourseSkillsCoveredProps {
  watch: UseFormWatch<addCourseSchemaType>;
  setValue: UseFormSetValue<addCourseSchemaType>;
  errors: FieldErrors<addCourseSchemaType>;
  trigger: UseFormTrigger<addCourseSchemaType>;
}

interface ICourseSkillsCoveredEditProps {
  skillCovered: string;
  skillsCovered: string[];
  submit: (skillCovered: string) => void;
}

const CourseSkillCoveredSchema = z.object({
  skillCovered: z.string().min(1, "Requirement is required"),
});

type CourseSkillsCoveredEditSchemaType = z.infer<
  typeof CourseSkillCoveredSchema
>;

const CourseSkillsCoveredEdit: FC<ICourseSkillsCoveredEditProps> = ({
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
  } = useForm<CourseSkillsCoveredEditSchemaType>({
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

const CourseSkillsCovered: FC<ICourseSkillsCoveredProps> = ({
  watch,
  setValue,
  errors,
  trigger,
}) => {
  const [skillsCovered, setRequirements] = useState(
    watch("skillsCovered") || []
  );
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<null | string>();

  const addRequirement = () => {
    const updatedSkillsCovered = [...skillsCovered, input];
    setRequirements(updatedSkillsCovered);
    setValue("skillsCovered", updatedSkillsCovered);
    trigger("skillsCovered");
  };

  const deleteRequirement = (skillCovered: string) => {
    const updatedSkillsCovered = skillsCovered.filter((x) => x != skillCovered);
    setRequirements(updatedSkillsCovered);
    setValue("skillsCovered", updatedSkillsCovered);
    trigger("skillsCovered");
  };

  const editRequirement = (oldRequirement: string, skillCovered: string) => {
    const updatedSkillsCovered = skillsCovered.map((x) =>
      x == oldRequirement ? skillCovered : x
    );
    setRequirements(updatedSkillsCovered);
    setValue("skillsCovered", updatedSkillsCovered);
    setSelected(null);
    trigger("skillsCovered");
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
            <TableHead>Requirement</TableHead>
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
                    <CourseSkillsCoveredEdit
                      skillCovered={skillCovered}
                      skillsCovered={skillsCovered}
                      submit={(editedRequirement) => {
                        editRequirement(skillCovered, editedRequirement);
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
                  onClick={() => deleteRequirement(skillCovered)}
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

export default CourseSkillsCovered;
