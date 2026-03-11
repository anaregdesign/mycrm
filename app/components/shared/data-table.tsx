import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";

import type { ReactNode } from "react";

type DataTableColumn<TItem> = {
  key: string;
  header: string;
  renderCell: (item: TItem) => ReactNode;
};

export function DataTable<TItem>({
  ariaLabel,
  columns,
  items,
  getRowId,
}: {
  ariaLabel: string;
  columns: DataTableColumn<TItem>[];
  items: TItem[];
  getRowId: (item: TItem) => string;
}) {
  return (
    <div className="table-wrap">
      <Table aria-label={ariaLabel} className="data-table">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell className="data-table__header-cell" key={column.key}>
                {column.header}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow className="data-table__row" key={getRowId(item)}>
              {columns.map((column) => (
                <TableCell className="data-table__cell" key={column.key}>
                  {column.renderCell(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}