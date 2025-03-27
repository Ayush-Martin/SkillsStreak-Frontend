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
  MdDelete,
  MdEdit,
  IoIosSave,
  RiFolderCloseFill,
  IoMdAddCircleOutline,
} from "@/assets/icons";

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
    setInput("");
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
          className="bg-transparent border w-60 border-app-border placeholder:text-muted-foreground"
          placeholder="enter text here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={addRequirement}
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
                    <CourseSkillsCoveredEdit
                      skillCovered={requirement}
                      skillsCovered={skillsCovered}
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

export default CourseSkillsCovered;
