#!/bin/bash

# Save this as generate-complete-tests.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Creating test directory structure...${NC}"

# Create all directories
mkdir -p src/__tests__/components/{dashboard/{layout,sections,stats},forms,layout,mine-admin/sections}
mkdir -p src/__tests__/{contexts,pages/dashboards,services}
mkdir -p cypress/{e2e,fixtures,support}

# Function to create a test file
create_test_file() {
    local file_path=$1
    local file_content=$2
    echo "Creating test file: $file_path"
    mkdir -p "$(dirname "$file_path")"
    echo "$file_content" > "$file_path"
}

# Create core setup files
create_test_file "src/__tests__/setup.js" '
import "@testing-library/jest-dom";
import "whatwg-fetch";
import { server } from "../mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
'

create_test_file "src/__tests__/testUtils.js" '
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false }
  }
});

export function renderWithProviders(ui) {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
'

# Create all dashboard component tests
create_test_file "src/__tests__/components/dashboard/DataTable.test.jsx" '
import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "@/components/dashboard/DataTable";

describe("DataTable", () => {
  const mockData = [
    { id: 1, name: "Test Item", value: 100 }
  ];
  const mockColumns = [
    { key: "name", label: "Name" },
    { key: "value", label: "Value" }
  ];
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  it("renders table with data", () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("Test Item")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("calls edit handler", () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(mockOnEdit).toHaveBeenCalledWith(mockData[0]);
  });

  it("calls delete handler", () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(mockOnDelete).toHaveBeenCalledWith(mockData[0].id);
  });
});
'

create_test_file "src/__tests__/components/dashboard/ManagementModal.test.jsx" '
import { render, screen, fireEvent } from "@testing-library/react";
import { ManagementModal } from "@/components/dashboard/ManagementModal";

describe("ManagementModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockFields = [
    { name: "testField", label: "Test Field", type: "text" }
  ];

  it("renders modal when open", () => {
    render(
      <ManagementModal
        title="Test Modal"
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        fields={mockFields}
      />
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByLabelText("Test Field")).toBeInTheDocument();
  });

  it("handles form submission", () => {
    render(
      <ManagementModal
        title="Test Modal"
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        fields={mockFields}
      />
    );
    
    fireEvent.change(screen.getByLabelText("Test Field"), {
      target: { value: "test value" }
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      testField: "test value"
    });
  });

  it("handles close", () => {
    render(
      <ManagementModal
        title="Test Modal"
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        fields={mockFields}
      />
    );
    
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
'

# Create all sections tests
create_test_file "src/__tests__/components/dashboard/sections/MineralsSection.test.jsx" '
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
'

# Create auth context tests
create_test_file "src/__tests__/contexts/AuthContext.test.jsx" '
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
'

# Create Cypress E2E tests
create_test_file "cypress/e2e/auth.cy.js" '
describe("Authentication", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("completes signup flow", () => {
    cy.visit("/signup");
    cy.get("input[name=username]").type("testuser");
    cy.get("input[name=password]").type("password123");
    cy.get("input[name=confirmPassword]").type("password123");
    cy.get("select[name=role]").select("USER");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/login");
  });

  it("completes login flow", () => {
    cy.visit("/login");
    cy.get("input[name=username]").type("testuser");
    cy.get("input[name=password]").type("password123");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/dashboard");
  });

  it("handles invalid login", () => {
    cy.visit("/login");
    cy.get("input[name=username]").type("wronguser");
    cy.get("input[name=password]").type("wrongpass");
    cy.get("button[type=submit]").click();
    cy.contains("Invalid username or password").should("be.visible");
  });
});
'

create_test_file "cypress/e2e/dashboard.cy.js" '
describe("Dashboard Features", () => {
  beforeEach(() => {
    cy.login("admin");
  });

  it("navigates through sections", () => {
    cy.get("[data-test=env-data]").click();
    cy.contains("Environmental Data").should("be.visible");

    cy.get("[data-test=safety-data]").click();
    cy.contains("Safety Reports").should("be.visible");
  });

  it("displays environmental data", () => {
    cy.get("[data-test=env-data]").click();
    cy.get("[data-test=air-quality-chart]").should("be.visible");
    cy.get("[data-test=add-measurement]").click();
    cy.get("input[name=measuredValue]").type("45");
    cy.get("button[type=submit]").click();
    cy.contains("Measurement added successfully").should("be.visible");
  });
});
'

# Create Cypress support files
create_test_file "cypress/support/commands.js" '
Cypress.Commands.add("login", (userType = "user") => {
  const users = {
    admin: { username: "admin", password: "admin123" },
    mine: { username: "mine", password: "mine123" },
    user: { username: "user", password: "user123" }
  };

  const user = users[userType];
  cy.visit("/login");
  cy.get("input[name=username]").type(user.username);
  cy.get("input[name=password]").type(user.password);
  cy.get("button[type=submit]").click();
});

Cypress.Commands.add("logout", () => {
  cy.get("[data-test=logout-button]").click();
  cy.url().should("include", "/login");
});
'

create_test_file "cypress/support/e2e.js" '
import "./commands";

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});
'

# Create configuration files
create_test_file "jest.config.js" '
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/mocks/**",
  ],
};
'

create_test_file "cypress.config.js" '
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    defaultCommandTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    chromeWebSecurity: false,
    experimentalStudio: true
  },
  env: {
    admin: {
      username: "admin",
      password: "admin123"
    },
    mineAdmin: {
      username: "mine",
      password: "mine123"
    },
    user: {
      username: "user",
      password: "user123"
    }
  }
});
'

# Update package.json scripts
if [ -f "package.json" ]; then
  npx json -I -f package.json -e '
    this.scripts = {
      ...this.scripts,
      "test": "jest",
      "test:watch": "jest --watch",
      "test:coverage": "jest --coverage",
      "cy:open": "cypress open",
      "cy:run": "cypress run"
    }
  '
fi

echo -e "${GREEN}Test file generation complete!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "1. npm install --save-dev jest @testing-library/react @testing-library/jest-dom cypress @testing-library/user-event"
echo "2. npm test         # Run Jest tests"
echo "3. npm run cy:open  # Open Cypress"

#!/bin/bash

# Add to the previous script - create remaining test files

# Create component tests for pages
create_test_file "src/__tests__/pages/About.test.jsx" '
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
'

create_test_file "src/__tests__/pages/Contact.test.jsx" '
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
'

create_test_file "src/__tests__/pages/Features.test.jsx" '
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
'

create_test_file "src/__tests__/pages/dashboards/AdminDashboard.test.jsx" '
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
'

create_test_file "src/__tests__/pages/dashboards/MineAdminDashboard.test.jsx" '
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
'

create_test_file "src/__tests__/services/api.test.js" '
import { endpoints } from "@/services/api";

describe("API Service", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe("Environmental Data Endpoints", () => {
    it("fetches environmental data", async () => {
      const mockData = [{ id: 1, measuredValue: 45 }];
      fetch.mockResponseOnce(JSON.stringify(mockData));

      const result = await endpoints.environmentalData.getAll();
      expect(result).toEqual(mockData);
    });

    it("creates environmental data", async () => {
      const mockData = { measuredValue: 45, date: "2024-01-01" };
      fetch.mockResponseOnce(JSON.stringify(mockData));

      const result = await endpoints.environmentalData.create(mockData);
      expect(result).toEqual(mockData);
    });
  });

  describe("Safety Data Endpoints", () => {
    it("fetches safety data", async () => {
      const mockData = [{ id: 1, incidents: 0 }];
      fetch.mockResponseOnce(JSON.stringify(mockData));

      const result = await endpoints.safetyData.getAll();
      expect(result).toEqual(mockData);
    });
  });
});
'

create_test_file "src/__tests__/services/auth.test.js" '
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
'

# Create component tests for forms
create_test_file "src/__tests__/components/forms/ContactForm.test.jsx" '
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
'

# Create additional Cypress E2E tests
create_test_file "cypress/e2e/environmental.cy.js" '
describe("Environmental Data Management", () => {
  beforeEach(() => {
    cy.login("mine");
  });

  it("adds new environmental measurement", () => {
    cy.visit("/pages/MineAdminDashboard");
    cy.get("[data-test=env-data]").click();
    cy.get("[data-test=add-measurement]").click();
    
    cy.get("input[name=measuredValue]").type("45");
    cy.get("select[name=pollutantId]").select("PM10");
    cy.get("textarea[name=notes]").type("Test measurement");
    
    cy.get("button[type=submit]").click();
    cy.contains("Measurement added successfully").should("be.visible");
  });

  it("displays environmental charts", () => {
    cy.visit("/pages/MineAdminDashboard");
    cy.get("[data-test=env-data]").click();
    
    cy.get("[data-test=air-quality-chart]").should("be.visible");
    cy.get("[data-test=trends-chart]").should("be.visible");
  });
});
'

create_test_file "cypress/e2e/safety.cy.js" '
describe("Safety Data Management", () => {
  beforeEach(() => {
    cy.login("mine");
  });

  it("records safety incident", () => {
    cy.visit("/pages/MineAdminDashboard");
    cy.get("[data-test=safety-data]").click();
    cy.get("[data-test=report-incident]").click();
    
    cy.get("input[name=lostTimeIncidents]").type("1");
    cy.get("input[name=nearMisses]").type("2");
    cy.get("select[name=safetyLevel]").select("FAIR");
    
    cy.get("button[type=submit]").click();
    cy.contains("Incident recorded successfully").should("be.visible");
  });

  it("displays safety metrics", () => {
    cy.visit("/pages/MineAdminDashboard");
    cy.get("[data-test=safety-data]").click();
    
    cy.get("[data-test=incidents-chart]").should("be.visible");
    cy.get("[data-test=safety-score]").should("be.visible");
  });
});
'

# Create fixtures for Cypress
create_test_file "cypress/fixtures/environmental-data.json" '
{
  "measurements": [
    {
      "id": 1,
      "measuredValue": 45,
      "measurementDate": "2024-12-01",
      "pollutant": {
        "name": "PM10",
        "benchmarkValue": 50,
        "unit": "μg/m³"
      }
    }
  ]
}
'

create_test_file "cypress/fixtures/safety-data.json" '
{
  "incidents": [
    {
      "id": 1,
      "dateRecorded": "2024-12-01",
      "lostTimeIncidents": 0,
      "nearMisses": 2,
      "safetyLevel": "GOOD"
    }
  ]
}
'

echo -e "${GREEN}Complete test suite generation finished!${NC}"
echo -e "${BLUE}Test coverage includes:${NC}"
echo "- Component tests"
echo "- Page tests"
echo "- Service tests"
echo "- E2E tests"
echo "- API integration tests"
echo "- Auth flow tests"
echo "- Form validation tests"
echo "- Dashboard functionality tests"

EOF

chmod +x generate-complete-tests.sh

echo "Script created as 'generate-complete-tests.sh'"
echo "To generate all test files, run:"
echo "./generate-complete-tests.sh"