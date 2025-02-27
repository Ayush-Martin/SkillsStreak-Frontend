import { Pagination, SearchBox } from "@/components";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import TrainerLayout from "@/layouts/TrainerLayout";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const MyCourses: FC = () => {
  const navigate = useNavigate();
  return (
    <TrainerLayout>
      <SearchBox
        placeholder="search by email"
        search={"hello"}
        searchHandler={() => null}
      />
      <div className="flex justify-center w-full my-5">
        <Button variant={"v1"} onClick={() => navigate("/trainer/courses/add")}>
          Add Course
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell>row</TableCell>
            <TableCell>row</TableCell>
            <TableCell>row</TableCell>
            <TableCell>row</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Pagination
        currentPage={1}
        totalPages={10}
        previousPage={() => {}}
        nextPage={() => {}}
      />
    </TrainerLayout>
  );
};

export default MyCourses;
