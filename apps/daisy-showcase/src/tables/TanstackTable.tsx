"use client";

/**
 * Table with Tanstack Table formatting and DaisyUI styling.
 */

// External Modules ----------------------------------------------------------

import { DataTable } from "@repo/daisy-table/DataTable";
import {
  CellContext,
  createColumnHelper,
//  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

// Internal Modules ----------------------------------------------------------

import { User } from "@/types/types";

// Public Objects ------------------------------------------------------------

export type TanstackTableProps = {
  // Dummy user data
  users: User[],
}

export function TanstackTable({ users }: TanstackTableProps) {

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {id: "id", desc: false},
  ]);

  const columns = useMemo(() => [
    columnHelper.accessor("id", {
      enableSorting: true,
      header: "Id",
      cell: (info: CellContext<User, number>) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      enableSorting: true,
      header: "Name",
      cell: (info: CellContext<User, string>) => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info: CellContext<User, string>) => info.getValue(),
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      cell: (info: CellContext<User, string>) => info.getValue(),
    }),
  ], []);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<User>({
    columns,
    data: users,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting
    },
  });

  return (
    <DataTable
      border
      pinRows
      showPagination={true}
      table={table}
      zebra
    />
  )

}

// Private Objects -----------------------------------------------------------

const columnHelper = createColumnHelper<User>();
