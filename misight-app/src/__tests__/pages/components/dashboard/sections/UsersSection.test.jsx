// UsersSection.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UsersSection from "../UsersSection";

describe("UsersSection", () => {
  const mockUsers = [
    { id: 1, username: "admin" },
    { id: 2, username: "mineadmin" },
  ];

  const mockOnUserCreate = jest.fn();
  const mockOnUserDelete = jest.fn();

  beforeEach(() => {
    render(
      <UsersSection
        users={mockUsers}
        onUserCreate={mockOnUserCreate}
        onUserDelete={mockOnUserDelete}
      />
    );
  });

  it("renders user management interface", () => {
    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Add User")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("mineadmin")).toBeInTheDocument();
  });

  it("handles user creation", () => {
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "newuser" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "newpassword" } });
    fireEvent.click(screen.getByText("Add User"));

    expect(mockOnUserCreate).toHaveBeenCalledWith({ username: "newuser", password: "newpassword" });
  });

  it("handles user deletion", () => {
    fireEvent.click(screen.getAllByText("Delete")[0]);
    expect(mockOnUserDelete).toHaveBeenCalledWith(1);
  });
});
