
import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "@/components/dashboard/DataTable";

describe("DataTable", () => {
  const mockData = [
    { id: 1, name: "Test Item", value: 100 }
  ];
  const mockColumns = [
    { key: "name", label: "Name" },
    { key: "value", label: "Value" }
  ];
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  it("renders table with data", () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("Test Item")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("calls edit handler", () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(mockOnEdit).toHaveBeenCalledWith(mockData[0]);
  });

  it("calls delete handler", () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(mockOnDelete).toHaveBeenCalledWith(mockData[0].id);
  });
});

