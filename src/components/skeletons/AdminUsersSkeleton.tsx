import { Skeleton, TableBody, TableCell, TableRow } from "@/components";

const AdminUsersSkeleton = () => {
  return (
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-[150px] bg-app-neutral" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px] bg-app-neutral" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[80px] bg-app-neutral" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-8 h-8 rounded-full bg-app-neutral" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default AdminUsersSkeleton;
