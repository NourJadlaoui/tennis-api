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

describe("GET /player by id", () => {
  it("should return a player by id", async () => {
    const app = buildApp();

    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/players/52",
    });

    expect(response.statusCode).toBe(200);

    const player = response.json();

    expect(player.id).toBe(52);
    expect(player.firstname).toBe("Novak");

    await app.close();
  });

  it('should return 404 if player does not exist', async () => {
    const app = buildApp();
  
    await app.ready();
  
    const response = await app.inject({
      method: 'GET',
      url: '/players/999999',
    });
  
    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      message: 'Player not found',
    });
  
    await app.close();
  });

  it('should return 400 for invalid id', async () => {
    const app = buildApp();
  
    await app.ready();
  
    const response = await app.inject({
      method: 'GET',
      url: '/players/abc',
    });
  
    expect(response.statusCode).toBe(400);
  
    expect(response.json()).toEqual({
      message: 'Invalid player id',
    });
  
    await app.close();
  });
});
