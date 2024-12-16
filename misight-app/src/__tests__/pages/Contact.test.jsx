
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Contact from "@/pages/Contact";

describe("Contact Page", () => {
  const renderContact = () => {
    render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );
  };

  it("renders contact form", () => {
    renderContact();
    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("submits contact form", async () => {
    renderContact();
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Test message" }
    });
    
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    
    expect(await screen.findByText(/message sent successfully/i)).toBeInTheDocument();
  });
});

