import { renderWithProviders } from "@repo/testing-react";
import {
  type CellContext,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  type Table as TanstackTable,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { DataTable, type TableAction } from "./DataTable";

type User = {
  id: number;
  name: string;
  email: string;
};

const USERS: User[] = [
  { id: 1, name: "Zed", email: "zed@example.com" },
  { id: 2, name: "Amy", email: "amy@example.com" },
  { id: 3, name: "Moe", email: "moe@example.com" },
  { id: 4, name: "Bea", email: "bea@example.com" },
  { id: 5, name: "Ian", email: "ian@example.com" },
  { id: 6, name: "Lex", email: "lex@example.com" },
];

const columnHelper = createColumnHelper<User>();

type DataTableHarnessProps = {
  actions?: TableAction<User>[];
  border?: boolean;
  pinCols?: boolean;
  pinRows?: boolean;
  showPagination?: boolean;
  size?: "lg" | "md" | "sm" | "xl" | "xs";
  zebra?: boolean;
};

type MockPaginationOptions = {
  canNextPage?: boolean;
  canPreviousPage?: boolean;
  pageCount?: number;
  pageIndex?: number;
  rowCount?: number;
};

function createMockPaginationTable(options?: MockPaginationOptions) {
  const canNextPage = options?.canNextPage ?? true;
  const canPreviousPage = options?.canPreviousPage ?? false;
  const pageCount = options?.pageCount ?? 3;
  const pageIndex = options?.pageIndex ?? 0;
  const rowCount = options?.rowCount ?? 6;

  return {
    firstPage: vi.fn(),
    getCanNextPage: vi.fn(() => canNextPage),
    getCanPreviousPage: vi.fn(() => canPreviousPage),
    getCenterLeafColumns: vi.fn(() => [{ id: "id" }, { id: "name" }, { id: "email" }]),
    getHeaderGroups: vi.fn(() => []),
    getPageCount: vi.fn(() => pageCount),
    getRowCount: vi.fn(() => rowCount),
    getRowModel: vi.fn(() => ({ rows: [] })),
    getState: vi.fn(() => ({ pagination: { pageIndex } })),
    lastPage: vi.fn(),
    nextPage: vi.fn(),
    previousPage: vi.fn(),
  };
}

function DataTableHarness(props: DataTableHarnessProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 2,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        cell: (info: CellContext<User, number>) => info.getValue(),
        enableSorting: true,
        header: "Id",
      }),
      columnHelper.accessor("name", {
        cell: (info: CellContext<User, string>) => info.getValue(),
        enableSorting: true,
        header: "Name",
      }),
      columnHelper.accessor("email", {
        cell: (info: CellContext<User, string>) => info.getValue(),
        header: "Email",
      }),
    ],
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<User>({
    columns,
    data: USERS,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
    },
  });

  return <DataTable table={table} {...props} />;
}

function DataTableWithNonSortableEmailHarness(props: DataTableHarnessProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 2,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        cell: (info: CellContext<User, number>) => info.getValue(),
        enableSorting: true,
        header: "Id",
      }),
      columnHelper.accessor("name", {
        cell: (info: CellContext<User, string>) => info.getValue(),
        enableSorting: true,
        header: "Name",
      }),
      columnHelper.accessor("email", {
        cell: (info: CellContext<User, string>) => info.getValue(),
        enableSorting: false,
        header: "Email",
      }),
    ],
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<User>({
    columns,
    data: USERS,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
    },
  });

  return <DataTable table={table} {...props} />;
}

function getFirstRowName(container: HTMLElement) {
  const firstRow = container.querySelector("tbody tr");
  if (!firstRow) {
    return null;
  }
  const cells = firstRow.querySelectorAll("td");
  if (cells.length < 2) {
    return null;
  }
  return cells[1]?.textContent ?? null;
}

function isButtonDisabled(button: HTMLButtonElement) {
  return (
    button.disabled
    || button.getAttribute("aria-disabled") === "true"
    || button.className.includes("btn-disabled")
  );
}

describe("DataTable", () => {
  it("renders headers and paginated row data", () => {
    const { getByText, queryByText } = renderWithProviders(<DataTableHarness />);

    expect(getByText("Id")).toBeTruthy();
    expect(getByText("Name")).toBeTruthy();
    expect(getByText("Email")).toBeTruthy();

    // First page has two rows because pageSize is set to 2 in the harness.
    expect(getByText("Zed")).toBeTruthy();
    expect(getByText("Amy")).toBeTruthy();
    expect(queryByText("Moe")).toBeNull();
  });

  it("applies table variant classes", () => {
    const { container } = renderWithProviders(
      <DataTableHarness border pinCols pinRows size="sm" zebra />
    );

    const table = container.querySelector("table");
    expect(table).toBeTruthy();
    expect(table?.className).toContain("table");
    expect(table?.className).toContain("border-4");
    expect(table?.className).toContain("table-pin-cols");
    expect(table?.className).toContain("table-sm");
    expect(table?.className).toContain("table-zebra");
  });

  it("sorts when a sortable header control is pressed", async () => {
    const { container, user } = renderWithProviders(<DataTableHarness />);

    expect(getFirstRowName(container)).toBe("Zed");

    const nameHeader = container.querySelectorAll("thead th")[1];
    const sortControl = nameHeader?.querySelector("span[style]") as HTMLSpanElement | null;
    expect(sortControl).toBeTruthy();

    await user.click(sortControl as HTMLSpanElement);

    await vi.waitFor(() => {
      expect(getFirstRowName(container)).toBe("Amy");
    });
  });

  it("does not render a sort control for non-sortable headers", () => {
    const { container } = renderWithProviders(<DataTableWithNonSortableEmailHarness />);

    const emailHeader = container.querySelectorAll("thead th")[2];
    expect(emailHeader).toBeTruthy();
    expect(emailHeader?.querySelector("span[style]")).toBeNull();
  });

  it("renders descending sort icon after sorting a column twice", async () => {
    const { container, user } = renderWithProviders(<DataTableHarness />);

    const nameHeader = container.querySelectorAll("thead th")[1];
    const sortControl = nameHeader?.querySelector("span[style]") as HTMLSpanElement | null;
    expect(sortControl).toBeTruthy();

    await user.click(sortControl as HTMLSpanElement);
    await user.click(sortControl as HTMLSpanElement);

    await vi.waitFor(() => {
      const descendingIcon = nameHeader?.querySelector("svg.lucide-arrow-down-a-z");
      expect(descendingIcon).toBeTruthy();
    });
  });

  it("renders row actions and invokes the action handler", async () => {
    const onAction = vi.fn();
    const actions: TableAction<User>[] = [
      {
        label: "Edit",
        onClick: (row) => onAction(row.original.id),
      },
    ];

    const { getAllByRole, getByRole, user } = renderWithProviders(
      <DataTableHarness actions={actions} />
    );

    expect(getByRole("columnheader", { name: "Actions" })).toBeTruthy();

    const menuButtons = getAllByRole("button", { name: "..." });
    expect(menuButtons.length).toBeGreaterThan(0);

    await user.click(menuButtons[0] as HTMLButtonElement);

    await vi.waitFor(() => {
      expect(getByRole("menuitem", { name: "Edit" })).toBeTruthy();
    });

    await user.click(getByRole("menuitem", { name: "Edit" }));

    expect(onAction).toHaveBeenCalledWith(1);
  });

  it("renders action icons when a TableAction provides icon", async () => {
    const actions: TableAction<User>[] = [
      {
        icon: <svg data-testid="edit-action-icon" />,
        label: "Edit With Icon",
        onClick: vi.fn(),
      },
    ];

    const { getAllByRole, getByRole, getByTestId, user } = renderWithProviders(
      <DataTableHarness actions={actions} />
    );

    await user.click(getAllByRole("button", { name: "..." })[0] as HTMLButtonElement);

    await vi.waitFor(() => {
      expect(getByRole("menuitem", { name: "Edit With Icon" })).toBeTruthy();
    });

    expect(getByTestId("edit-action-icon")).toBeTruthy();
  });

  it("renders and uses pagination controls when enabled", async () => {
    const { container, getByText, user } = renderWithProviders(
      <DataTableHarness showPagination />
    );

    expect(getByText(/Page 1 of 3/)).toBeTruthy();
    expect(getByText(/Total of 6 Rows/)).toBeTruthy();

    const nextPageButton = container.querySelector('[data-tip="Next Page"] button');
    expect(nextPageButton).toBeTruthy();

    await user.click(nextPageButton as HTMLButtonElement);

    await vi.waitFor(() => {
      expect(getByText(/Page 2 of 3/)).toBeTruthy();
    });
  });

  it("invokes nextPage and lastPage when their pagination controls are pressed", async () => {
    const table = createMockPaginationTable();
    const { container, user } = renderWithProviders(
      <DataTable showPagination table={table as unknown as TanstackTable<User>} />
    );

    const nextPageButton = container.querySelector('[data-tip="Next Page"] button');
    const lastPageButton = container.querySelector('[data-tip="Last Page"] button');

    expect(nextPageButton).toBeTruthy();
    expect(lastPageButton).toBeTruthy();

    await user.click(nextPageButton as HTMLButtonElement);
    await user.click(lastPageButton as HTMLButtonElement);

    expect(table.nextPage).toHaveBeenCalledTimes(1);
    expect(table.lastPage).toHaveBeenCalledTimes(1);
  });

  it("invokes firstPage and previousPage when their pagination controls are pressed", async () => {
    const table = createMockPaginationTable({ canPreviousPage: true, pageIndex: 1 });
    const { container, user } = renderWithProviders(
      <DataTable showPagination table={table as unknown as TanstackTable<User>} />
    );

    const firstPageButton = container.querySelector('[data-tip="First Page"] button');
    const previousPageButton = container.querySelector('[data-tip="Previous Page"] button');

    expect(firstPageButton).toBeTruthy();
    expect(previousPageButton).toBeTruthy();

    await user.click(firstPageButton as HTMLButtonElement);
    await user.click(previousPageButton as HTMLButtonElement);

    expect(table.firstPage).toHaveBeenCalledTimes(1);
    expect(table.previousPage).toHaveBeenCalledTimes(1);
  });

  it("updates pagination button disabled states on first and last pages", async () => {
    const { container, getByText, user } = renderWithProviders(
      <DataTableHarness showPagination />
    );

    const firstPageButton = container.querySelector('[data-tip="First Page"] button');
    const previousPageButton = container.querySelector('[data-tip="Previous Page"] button');
    const nextPageButton = container.querySelector('[data-tip="Next Page"] button');
    const lastPageButton = container.querySelector('[data-tip="Last Page"] button');

    expect(firstPageButton).toBeTruthy();
    expect(previousPageButton).toBeTruthy();
    expect(nextPageButton).toBeTruthy();
    expect(lastPageButton).toBeTruthy();

    expect(isButtonDisabled(firstPageButton as HTMLButtonElement)).toBe(true);
    expect(isButtonDisabled(previousPageButton as HTMLButtonElement)).toBe(true);
    expect(isButtonDisabled(nextPageButton as HTMLButtonElement)).toBe(false);
    expect(isButtonDisabled(lastPageButton as HTMLButtonElement)).toBe(false);

    await user.click(lastPageButton as HTMLButtonElement);

    await vi.waitFor(() => {
      expect(getByText(/Page 3 of 3/)).toBeTruthy();
      expect(isButtonDisabled(firstPageButton as HTMLButtonElement)).toBe(false);
      expect(isButtonDisabled(previousPageButton as HTMLButtonElement)).toBe(false);
      expect(isButtonDisabled(nextPageButton as HTMLButtonElement)).toBe(true);
      expect(isButtonDisabled(lastPageButton as HTMLButtonElement)).toBe(true);
    });
  });

  it("renders 'Page 1 of 1' when page count is zero", () => {
    const table = createMockPaginationTable({
      canNextPage: false,
      canPreviousPage: false,
      pageCount: 0,
      pageIndex: 0,
      rowCount: 0,
    });

    const { getByText } = renderWithProviders(
      <DataTable showPagination table={table as unknown as TanstackTable<User>} />
    );

    expect(getByText(/Page 1 of 1/)).toBeTruthy();
    expect(getByText(/Total of 0 Rows/)).toBeTruthy();
  });

  it("logs errors thrown by action handlers", async () => {
    const expectedError = new Error("boom");
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const actions: TableAction<User>[] = [
      {
        label: "Explode",
        onClick: () => {
          throw expectedError;
        },
      },
    ];

    const { getAllByRole, getByRole, user } = renderWithProviders(
      <DataTableHarness actions={actions} />
    );

    await user.click(getAllByRole("button", { name: "..." })[0] as HTMLButtonElement);

    await vi.waitFor(() => {
      expect(getByRole("menuitem", { name: "Explode" })).toBeTruthy();
    });

    await user.click(getByRole("menuitem", { name: "Explode" }));

    expect(consoleErrorSpy).toHaveBeenCalledWith(expectedError);
    consoleErrorSpy.mockRestore();
  });

  it("does not render pagination footer when disabled", () => {
    const { queryByText } = renderWithProviders(<DataTableHarness showPagination={false} />);

    expect(queryByText(/Total of 6 Rows/)).toBeNull();
  });
});











