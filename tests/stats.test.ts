import { describe, expect, it, vi, beforeEach } from "vitest";
import { StatsService } from "../src/services/stats.service";
import players from "../src/data/headtohead.json";
import { buildApp } from "../src/app";

describe("GET /stats", () => {
  it("should return application statistics", async () => {
    const app = buildApp();
    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/stats",
    });

    expect(response.statusCode).toBe(200);
    const stats = response.json();
    await app.close();
  });

  it("should return a valid stats structure", async () => {
    const app = buildApp();
    await app.ready();
    const response = await app.inject({
      method: "GET",
      url: "/stats",
    });

    const stats = response.json();
    expect(stats).toHaveProperty("countryWithHighestWinRatio");
    expect(stats).toHaveProperty("averageBmi");
    expect(stats).toHaveProperty("medianHeight");
    expect(stats.countryWithHighestWinRatio).toHaveProperty("country");
    expect(stats.countryWithHighestWinRatio).toHaveProperty("ratio");
    expect(typeof stats.countryWithHighestWinRatio.country).toBe("string");
    expect(typeof stats.countryWithHighestWinRatio.ratio).toBe("number");
    expect(typeof stats.averageBmi).toBe("number");
    expect(typeof stats.medianHeight).toBe("number");

    await app.close();
  });
});

describe("StatsService", () => {
  const repo = {
    findAll: vi.fn(),
  };

  let service: StatsService;

  beforeEach(() => {
    repo.findAll.mockClear();
    repo.findAll.mockReturnValue(players);
    service = new StatsService(repo as any);
  });

  describe("getStats", () => {
    it("should return all statistics", () => {
      const stats = service.getStats();

      expect(stats).toEqual({
        countryWithHighestWinRatio: {
          country: "SRB",
          ratio: 1,
        },
        averageBmi: 23.36,
        medianHeight: 185,
      });
    });

    it("should call repository once", () => {
      service.getStats();

      expect(repo.findAll).toHaveBeenCalledTimes(1);
    });

    it("should return the country with the highest win ratio", () => {
      const players = [
        {
          country: { code: "FR" },
          data: {
            last: [1, 1, 0],
            height: 180,
            weight: 80000,
          },
        },
        {
          country: { code: "FR" },
          data: {
            last: [1, 0, 0],
            height: 185,
            weight: 82000,
          },
        },
        {
          country: { code: "ES" },
          data: {
            last: [1, 1, 1],
            height: 190,
            weight: 85000,
          },
        },
      ];

      repo.findAll.mockReturnValue(players);

      const stats = service.getStats();

      expect(stats.countryWithHighestWinRatio).toEqual({
        country: "ES",
        ratio: 1,
      });
    });
    it("should calculate average BMI", () => {
      const players = [
        {
          country: { code: "FR" },
          data: {
            height: 200,
            weight: 80000,
            last: [],
          },
        },
        {
          country: { code: "ES" },
          data: {
            height: 100,
            weight: 100000,
            last: [],
          },
        },
      ];

      repo.findAll.mockReturnValue(players);

      const stats = service.getStats();

      // BMI:
      // 80 / 2² = 20
      // 100 / 1² = 100
      // moyenne = 60

      expect(stats.averageBmi).toBe(60);
    });

    it("should calculate median height for an odd number of players", () => {
      const players = [
        { country: { code: "FR" }, data: { height: 170, weight: 1, last: [] } },
        { country: { code: "FR" }, data: { height: 190, weight: 1, last: [] } },
        { country: { code: "FR" }, data: { height: 180, weight: 1, last: [] } },
      ];

      repo.findAll.mockReturnValue(players);

      const stats = service.getStats();

      expect(stats.medianHeight).toBe(180);
    });

    it("should calculate median height for an even number of players", () => {
      const players = [
        { country: { code: "FR" }, data: { height: 170, weight: 1, last: [] } },
        { country: { code: "FR" }, data: { height: 180, weight: 1, last: [] } },
        { country: { code: "FR" }, data: { height: 190, weight: 1, last: [] } },
        { country: { code: "FR" }, data: { height: 200, weight: 1, last: [] } },
      ];

      repo.findAll.mockReturnValue(players);

      const stats = service.getStats();

      // (180 + 190) / 2

      expect(stats.medianHeight).toBe(185);
    });
  });
});
