
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

