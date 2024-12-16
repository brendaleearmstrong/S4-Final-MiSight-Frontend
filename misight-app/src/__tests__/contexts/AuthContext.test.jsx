
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      {user ? (
        <>
          <div>Logged in as: {user.username}</div>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login({ username: "test" })}>Login</button>
      )}
    </div>
  );
};

describe("AuthContext", () => {
  it("provides auth context", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText("Login"));
    expect(screen.getByText("Logged in as: test")).toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Logout"));
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});

