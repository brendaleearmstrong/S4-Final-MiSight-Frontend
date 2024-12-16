
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Features from "@/pages/Features";

describe("Features Page", () => {
  it("renders features content", () => {
    render(
      <BrowserRouter>
        <Features />
      </BrowserRouter>
    );
    expect(screen.getByText("Powerful Features for Mining Operations")).toBeInTheDocument();
    expect(screen.getByText("Safety Management")).toBeInTheDocument();
    expect(screen.getByText("Environmental Monitoring")).toBeInTheDocument();
  });
});

