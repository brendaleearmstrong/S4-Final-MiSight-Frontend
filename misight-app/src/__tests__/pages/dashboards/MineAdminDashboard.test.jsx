
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import MineAdminDashboard from "@/pages/dashboards/MineAdminDashboard";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

describe("MineAdminDashboard", () => {
  const renderDashboard = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <MineAdminDashboard />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  it("renders mine admin dashboard", () => {
    renderDashboard();
    expect(screen.getByText("Mine Administration")).toBeInTheDocument();
  });

  it("displays mine-specific data", () => {
    renderDashboard();
    expect(screen.getByText("Environmental Data")).toBeInTheDocument();
    expect(screen.getByText("Safety Reports")).toBeInTheDocument();
  });
});

