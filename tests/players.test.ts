import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

describe("GET /players", () => {
  it("should return players sorted by rank", async () => {
    const app = buildApp();

    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/players",
    });

    expect(response.statusCode).toBe(200);

    const players = response.json();

    expect(players.length).toBeGreaterThan(0);

    for (let i = 0; i < players.length - 1; i++) {
      expect(players[i].data.rank).toBeLessThanOrEqual(
        players[i + 1].data.rank
      );
    }

    await app.close();
  });
});
