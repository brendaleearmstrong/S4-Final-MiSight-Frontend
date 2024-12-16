
import { authAPI } from "@/services/auth";

describe("Auth Service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("checks authentication status", () => {
    expect(authAPI.isAuthenticated()).toBeFalsy();
    
    localStorage.setItem("user", JSON.stringify({ username: "test" }));
    expect(authAPI.isAuthenticated()).toBeTruthy();
  });

  it("verifies user roles", () => {
    localStorage.setItem("user", JSON.stringify({ 
      username: "admin", 
      role: "ADMIN" 
    }));

    expect(authAPI.hasRole("ADMIN")).toBeTruthy();
    expect(authAPI.hasRole("USER")).toBeFalsy();
  });

  it("returns correct protected route", () => {
    expect(authAPI.getProtectedRoute("ADMIN")).toBe("/pages/AdminDashboard");
    expect(authAPI.getProtectedRoute("MINE_ADMIN")).toBe("/pages/MineAdminDashboard");
    expect(authAPI.getProtectedRoute("USER")).toBe("/pages/UserDashboard");
  });
});

