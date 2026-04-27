"use client";

/**
 * Generic data table rendering component, using TanStack Table.
 */

// External Modules ----------------------------------------------------------

import {
  flexRender,
  Row,
  Table,
} from "@tanstack/react-table";
import {
  ArrowDownAZ,
  ArrowDownUp,
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
  ArrowUpAZ,
} from "lucide-react";
import { ReactNode } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export type TableAction<TData> = {
  // Optional icon for the action
  icon?: ReactNode;
  // Label for the action
  label: string;
  // Click handler for the action
  onClick: (row: Row<TData>) => void;
};

type DataTableProps<TData> = {
  // Optional actions rendered as a dropdown per-row
  actions?: TableAction<TData>[];
  // Show pagination controls
  showPagination?: boolean;
  // The Tanstack Table we are displaying
  table: Table<TData>,
}

export function DataTable<TData>(
  {
    actions,
    showPagination,
    table,
  }: DataTableProps<TData>) {

  // Pagination state
  const pageCount = table.getPageCount();
  const extraColumn = actions && actions.length > 0 ? 1 : 0;

  return (
    <table className="table table-zebra border-4 rounded-md w-full">

      <thead>
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th key={header.id} colSpan={header.colSpan}>
              <div  className="flex flex-row w-full justify-center">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                { header.column.getCanSort() ? (
                  <>
                    <span
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: "pointer" }}
                    >
                      {header.column.getIsSorted() === "asc" ? (
                        <ArrowUpAZ className="ms-2 text-info" size={24}/>
                      ) : header.column.getIsSorted() === "desc" ? (
                        <ArrowDownAZ className="ms-2 text-info" size={24}/>
                      ) : (
                        <ArrowDownUp className="ms-2 text-info" size={24}/>
                      )}
                    </span>
                  </>
                ) : null}
              </div>
            </th>
          ))}
          {actions && actions.length > 0 ? (
            <th key={`${headerGroup.id}-actions`}>
              <div className="flex flex-row w-full justify-center">Actions</div>
            </th>
          ) : null}
        </tr>
      ))}
      </thead>

      <tbody>
      {table.getRowModel().rows.map(row => (
        <tr key={row.id}>
          {row.getVisibleCells().map(cell => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
          {actions && actions.length > 0 ? (
            <td key={`${row.id}-actions`} className="flex flex-row justify-center">
              <div className="dropdown dropdown-end">
                <details>
                  <summary className="btn bth-ghost">
                    ...
                  </summary>
                  <ul tabIndex={0} className="menu dropdown-content z-1 mt-6 shadow-sm bg-base-300 rounded-box">
                    {actions.map((action, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          try {
                            action.onClick(row as Row<TData>);
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        {action.icon ? (
                          <span className="mr-2">
                            {action.icon}
                          </span>
                        ) : null}
                        {action.label}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </td>
          ) : null}
        </tr>
      ))}
      </tbody>

      { showPagination ? (
        <tfoot>
        <tr>
          <th colSpan={table.getCenterLeafColumns().length + extraColumn}>
            <div className="text-center space-x-4">
              <span className="tooltip" data-tip="First Page">
                <button
                  className="btn btn-info"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.firstPage()}
                >
                  <ArrowLeftToLine/>
                </button>
              </span>
              <span className="tooltip" data-tip="Previous Page">
                <button
                  className="btn btn-info"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                >
                  <ArrowLeft/>
                </button>
              </span>
              <span className="tooltip" data-tip="Next Page">
                <button
                  className="btn btn-info"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                >
                  <ArrowRight/>
                </button>
              </span>
              <span className="tooltip" data-tip="Last Page">
                <button
                  className="btn btn-info"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.lastPage()}
                >
                  <ArrowRightToLine/>
                </button>
              </span>
              <span>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {pageCount > 0 ? pageCount : `1`}{" "}| Total of{" "}
                {table.getRowCount().toLocaleString()} Rows
              </span>
            </div>
          </th>
        </tr>
        </tfoot>
      ) : null }

    </table>
  );

}
