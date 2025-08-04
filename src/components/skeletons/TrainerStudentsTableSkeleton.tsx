import { Skeleton, TableBody, TableCell, TableRow } from "@/components";

const TrainerStudentsTableSkeleton = () => {
  return (
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-[100px] bg-app-neutral" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[150px] bg-app-neutral" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[50px] bg-app-neutral" />
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-[50px] w-full max-w-[100px] bg-app-neutral" />
              <Skeleton className="h-4 w-[100px] bg-app-neutral" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default TrainerStudentsTableSkeleton;
