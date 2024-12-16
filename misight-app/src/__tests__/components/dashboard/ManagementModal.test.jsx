
import { render, screen, fireEvent } from "@testing-library/react";
import { ManagementModal } from "@/components/dashboard/ManagementModal";

describe("ManagementModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockFields = [
    { name: "testField", label: "Test Field", type: "text" }
  ];

  it("renders modal when open", () => {
    render(
      <ManagementModal
        title="Test Modal"
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        fields={mockFields}
      />
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByLabelText("Test Field")).toBeInTheDocument();
  });

  it("handles form submission", () => {
    render(
      <ManagementModal
        title="Test Modal"
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        fields={mockFields}
      />
    );
    
    fireEvent.change(screen.getByLabelText("Test Field"), {
      target: { value: "test value" }
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      testField: "test value"
    });
  });

  it("handles close", () => {
    render(
      <ManagementModal
        title="Test Modal"
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        fields={mockFields}
      />
    );
    
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});

