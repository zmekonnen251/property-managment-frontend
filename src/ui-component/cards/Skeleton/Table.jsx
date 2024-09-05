import Skeleton from '@mui/material/Skeleton';
import { Table, TableCell, TableBody, TableRow, TableHead } from '@mui/material';

const TableSkeleton = () => (
  <Table>
    <TableHead>
      <TableRow>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <TableCell key={i}>
            <Skeleton variant="rectangular" height={10} width={15} />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRow key={i}>
          {[1, 2, 3, 4, 5, 6].map((j) => (
            <TableCell key={j}>
              <Skeleton variant="rectangular" height={10} width={15} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default TableSkeleton;
