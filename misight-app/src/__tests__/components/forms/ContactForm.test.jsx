
import { render, screen, fireEvent } from "@testing-library/react";
import ContactForm from "@/components/forms/ContactForm";

describe("ContactForm", () => {
  it("renders form fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Test message" }
    });
    
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
  });
});

