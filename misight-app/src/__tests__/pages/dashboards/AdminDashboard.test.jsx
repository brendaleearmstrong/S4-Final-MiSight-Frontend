
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

describe("AdminDashboard", () => {
  const renderDashboard = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <AdminDashboard />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  it("renders admin dashboard", () => {
    renderDashboard();
    expect(screen.getByText("Administrator Dashboard")).toBeInTheDocument();
  });

  it("displays admin navigation options", () => {
    renderDashboard();
    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByText("Mine Management")).toBeInTheDocument();
  });
});

