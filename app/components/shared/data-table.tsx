import fluentReactComponents from "@fluentui/react-components";

const { Button, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } =
  fluentReactComponents;

import { useMemo, useState } from "react";

import type { ReactNode } from "react";

type SortDirection = "ascending" | "descending";

type DataTableColumn<TItem> = {
  key: string;
  header: string;
  renderCell: (item: TItem) => ReactNode;
  compare?: (left: TItem, right: TItem) => number;
  width?: "narrow" | "regular" | "wide";
};

export function DataTable<TItem>({
  ariaLabel,
  columns,
  defaultSort,
  items,
  getRowId,
}: {
  ariaLabel: string;
  columns: DataTableColumn<TItem>[];
  defaultSort?: { columnKey: string; direction: SortDirection };
  items: TItem[];
  getRowId: (item: TItem) => string;
}) {
  const [sort, setSort] = useState<{ columnKey: string; direction: SortDirection } | undefined>(defaultSort);

  const sortedItems = useMemo(() => {
    if (!sort) {
      return items;
    }

    const column = columns.find((candidate) => candidate.key === sort.columnKey);

    if (!column?.compare) {
      return items;
    }

    const copy = [...items];
    copy.sort((left, right) => {
      const result = column.compare?.(left, right) ?? 0;

      return sort.direction === "ascending" ? result : -result;
    });

    return copy;
  }, [columns, items, sort]);

  function toggleSort(column: DataTableColumn<TItem>) {
    if (!column.compare) {
      return;
    }

    setSort((current) => {
      if (!current || current.columnKey !== column.key) {
        return { columnKey: column.key, direction: "ascending" };
      }

      return {
        columnKey: column.key,
        direction: current.direction === "ascending" ? "descending" : "ascending",
      };
    });
  }

  return (
    <div className="table-wrap">
      <Table aria-label={ariaLabel} className="data-table">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell
                className={`data-table__header-cell data-table__header-cell--${column.width ?? "regular"}`}
                key={column.key}
              >
                {column.compare ? (
                  <Button
                    appearance="subtle"
                    className="data-table__header-button"
                    onClick={() => toggleSort(column)}
                    size="small"
                  >
                    {column.header}
                    <span className="data-table__sort-indicator" aria-hidden="true">
                      {sort?.columnKey === column.key
                        ? sort.direction === "ascending"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </Button>
                ) : (
                  column.header
                )}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow className="data-table__row" key={getRowId(item)}>
              {columns.map((column) => (
                <TableCell
                  className={`data-table__cell data-table__cell--${column.width ?? "regular"}`}
                  key={column.key}
                >
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