import { Skeleton, TableBody, TableCell, TableRow } from "@/components/ui";
import { RECORDS_PER_PAGE } from "@/constants";

const TableSkeleton = () => {
  return (
    <TableBody>
      {[...Array(RECORDS_PER_PAGE)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-[50px] md:h-[100px] w-full max-w-[200px] aspect-video bg-app-neutral" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 max-w-[150px] bg-app-neutral" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 max-w-[100px] bg-app-neutral" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 max-w-[80px] bg-app-neutral" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 max-w-[120px] bg-app-neutral" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 max-w-[100px] bg-app-neutral" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-8 h-8 rounded-full bg-app-neutral" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default TableSkeleton;
