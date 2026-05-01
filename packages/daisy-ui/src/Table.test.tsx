import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it } from "vitest";

import { Table, type TableProps } from "./Table";

describe("Table", () => {
  type TableTestProps = Omit<TableProps, "children">;

  function renderBasicTable(props?: TableTestProps) {
    return renderWithProviders(
      <Table {...props}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Header</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Data>Cell</Table.Data>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Data>Footer</Table.Data>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }

  it("renders children", () => {
    const { getByText } = renderWithProviders(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Data>Cell value</Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(getByText("Cell value")).toBeTruthy();
  });

  it("applies default variant classes", () => {
    const { container } = renderBasicTable();
    const table = container.firstElementChild;

    expect(table?.className).toContain("table");
    expect(table?.className).toContain("table-md");
  });

  it("applies border variant classes", () => {
    const { container } = renderBasicTable({ border: true });
    const table = container.firstElementChild;

    expect(table?.className).toContain("border-4");
    expect(table?.className).toContain("rounded-md");
  });

  it("applies pinCols variant class", () => {
    const { container } = renderBasicTable({ pinCols: true });
    const table = container.firstElementChild;

    expect(table?.className).toContain("table-pin-cols");
  });

  it("applies pinRows variant class", () => {
    const { container } = renderBasicTable({ pinRows: true });
    const table = container.firstElementChild;

    expect(table?.className).toContain("table-pin-rows");
  });

  it("applies size variant classes", () => {
    const { container } = renderBasicTable({ size: "lg" });
    const table = container.firstElementChild;

    expect(table?.className).toContain("table-lg");
  });

  it("applies zebra variant class", () => {
    const { container } = renderBasicTable({ zebra: true });
    const table = container.firstElementChild;

    expect(table?.className).toContain("table-zebra");
  });

  it("forwards extra className", () => {
    const { container } = renderBasicTable({ className: "my-custom-table" });
    const table = container.firstElementChild;

    expect(table?.className).toContain("my-custom-table");
  });

  it("renders all compound child parts", () => {
    const { container } = renderWithProviders(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Head A</Table.Head>
            <Table.Head>Head B</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Data>Cell A</Table.Data>
            <Table.Data>Cell B</Table.Data>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Data colSpan={2}>Footer A</Table.Data>
          </Table.Row>
        </Table.Footer>
      </Table>
    );

    expect(container.querySelector("thead")).toBeTruthy();
    expect(container.querySelector("tbody")).toBeTruthy();
    expect(container.querySelector("tfoot")).toBeTruthy();
    expect(container.querySelectorAll("tr").length).toBe(3);
    expect(container.querySelectorAll("th").length).toBe(2);
    expect(container.querySelectorAll("td").length).toBe(3);
  });

  it("forwards colSpan on Table.Data to td", () => {
    const { container } = renderWithProviders(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Data colSpan={3}>Spanning cell</Table.Data>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    const dataCell = container.querySelector("td");
    if (!(dataCell instanceof HTMLTableCellElement)) {
      throw new Error("Expected a <td> element");
    }
    expect(dataCell.colSpan).toBe(3);
  });

  it("forwards colSpan on Table.Head to th", () => {
    const { container } = renderWithProviders(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head colSpan={2}>Spanning head</Table.Head>
          </Table.Row>
        </Table.Header>
      </Table>
    );

    const headCell = container.querySelector("th");
    if (!(headCell instanceof HTMLTableCellElement)) {
      throw new Error("Expected a <th> element");
    }
    expect(headCell.colSpan).toBe(2);
  });

  it("throws when Table.Body is used outside Table", () => {
    expect(() => renderWithProviders(<Table.Body>Orphan</Table.Body>)).toThrow(
      "Table child components must be wrapped in <Table/>"
    );
  });

  it("throws when Table.Footer is used outside Table", () => {
    expect(() => renderWithProviders(<Table.Footer>Orphan</Table.Footer>)).toThrow(
      "Table child components must be wrapped in <Table/>"
    );
  });

  it("throws when Table.Data is used outside Table", () => {
    expect(() => renderWithProviders(<Table.Data>Orphan</Table.Data>)).toThrow(
      "Table child components must be wrapped in <Table/>"
    );
  });

  it("throws when Table.Head is used outside Table", () => {
    expect(() => renderWithProviders(<Table.Head>Orphan</Table.Head>)).toThrow(
      "Table child components must be wrapped in <Table/>"
    );
  });

  it("throws when Table.Header is used outside Table", () => {
    expect(() => renderWithProviders(<Table.Header>Orphan</Table.Header>)).toThrow(
      "Table child components must be wrapped in <Table/>"
    );
  });

  it("throws when Table.Row is used outside Table", () => {
    expect(() => renderWithProviders(<Table.Row>Orphan</Table.Row>)).toThrow(
      "Table child components must be wrapped in <Table/>"
    );
  });
});



