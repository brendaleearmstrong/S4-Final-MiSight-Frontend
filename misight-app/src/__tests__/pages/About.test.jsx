
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import About from "@/pages/About";

describe("About Page", () => {
  it("renders about page content", () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
    expect(screen.getByText("The MiSight Story")).toBeInTheDocument();
    expect(screen.getByText(/transforming mining operations/i)).toBeInTheDocument();
  });
});

