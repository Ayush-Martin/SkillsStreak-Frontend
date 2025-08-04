import { Skeleton, TableBody, TableCell, TableRow } from "@/components";
import { FC } from "react";

interface ITableSkeletonProps {
  widths: number[];
}
const TableSkeleton: FC<ITableSkeletonProps> = ({ widths }) => {
  return (
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          {widths.map((width, index) => (
            <TableCell key={index}>
              <Skeleton className={`h-4 w-[${width}px] bg-app-neutral`} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default TableSkeleton;
