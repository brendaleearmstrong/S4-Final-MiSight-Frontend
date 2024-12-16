
import { render, screen, fireEvent } from "@testing-library/react";
import { MineralsSection } from "@/components/dashboard/sections/MineralsSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

describe("MineralsSection", () => {
  const renderWithQuery = (ui) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it("renders minerals section", () => {
    renderWithQuery(<MineralsSection />);
    expect(screen.getByText("Minerals Management")).toBeInTheDocument();
  });

  it("opens create modal", () => {
    renderWithQuery(<MineralsSection />);
    fireEvent.click(screen.getByRole("button", { name: /add mineral/i }));
    expect(screen.getByText("Add Mineral")).toBeInTheDocument();
  });
});

