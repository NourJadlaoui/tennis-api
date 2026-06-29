import { describe, expect, it, vi, beforeEach } from "vitest";
import { buildApp } from "../src/app.js";
import { PlayersService } from "../src/services/players.service.js";

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

    const listResponse = await app.inject({
      method: "GET",
      url: "/players",
    });

    const players = listResponse.json();

    const firstPlayer = players[0];
    const response = await app.inject({
      method: "GET",
      url: `/players/${firstPlayer.id}`,
    });

    expect(response.statusCode).toBe(200);

    const player = response.json();

    expect(player.id).toBe(firstPlayer.id);
    expect(player.firstname).toBe(firstPlayer.firstname);

    await app.close();
  });

  it("should return 404 if player does not exist", async () => {
    const app = buildApp();

    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/players/999999",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      message: "Player not found",
    });

    await app.close();
  });

  it("should return 400 for invalid id", async () => {
    const app = buildApp();

    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/players/abc",
    });

    expect(response.statusCode).toBe(400);

    expect(response.json()).toEqual({
      message: "Invalid player id",
    });

    await app.close();
  });
});

describe("POST /player", () => {
  const repo = {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
  };

  let service: PlayersService;
  beforeEach(() => {
    repo.create.mockClear();
    repo.findAll.mockClear();
    repo.findById.mockClear();

    service = new PlayersService(repo as any);
  });
  it("should create and return a player", () => {
    repo.create.mockReturnValue({
      id: 999,
      firstname: "Rafael",
      lastname: "Nadal",
    });

    const result = service.createPlayer({
      firstname: "Rafael",
      lastname: "Nadal",
      shortname: "R.NAD",
      sex: "M",
      country: { code: "ESP", picture: "" },
      picture: "",
      data: {
        rank: 10,
        points: 1000,
        weight: 80000,
        height: 185,
        age: 30,
        last: [1],
      },
    });

    expect(result.id).toBe(999);

    expect(result.firstname).toBe("Rafael");
  });

  it("should call repository once", () => {
    repo.create.mockReturnValue({ id: 1 });

    service.createPlayer({
      firstname: "x",
      lastname: "x",
      shortname: "x",
      sex: "M",
      country: { code: "FR", picture: "" },
      picture: "",
      data: {
        rank: 1,
        points: 1,
        weight: 1,
        height: 1,
        age: 1,
        last: [1],
      },
    });

    expect(repo.create).toHaveBeenCalledTimes(1);
  });
  it("should return 400 if required fields are missing", async () => {
    const app = buildApp();

    await app.ready();

    const response = await app.inject({
      method: "POST",
      url: "/players",
      payload: {
        firstname: "Rafael",
        sex: "M",
      },
    });

    expect(response.statusCode).toBe(400);

    const body = response.json();

    expect(body.message).toBe("Validation error");
    expect(body.errors).toBeDefined();

    await app.close();
  });

  it("should return 400 for invalid sex value", async () => {
    const app = buildApp();

    await app.ready();

    const response = await app.inject({
      method: "POST",
      url: "/players",
      payload: {
        firstname: "Rafael",
        lastname: "Nadal",
        shortname: "R.NAD",
        sex: "X", // invalid
        country: {
          picture: "https://example.com/spain.png",
          code: "ESP",
        },
        picture: "https://example.com/nadal.png",
        data: {
          rank: 10,
          points: 2000,
          weight: 85000,
          height: 185,
          age: 30,
          last: [1, 0, 1],
        },
      },
    });

    expect(response.statusCode).toBe(400);

    const body = response.json();

    expect(body.message).toBe("Validation error");

    await app.close();
  });

  it("should return 400 for invalid country", async () => {
    const app = buildApp();

    await app.ready();

    const response = await app.inject({
      method: "POST",
      url: "/players",
      payload: {
        firstname: "Rafael",
        lastname: "Nadal",
        shortname: "R.NAD",
        sex: "M",
        country: {
          code: "", // invalid
          picture: "",
        },
        picture: "https://example.com/nadal.png",
        data: {
          rank: 10,
          points: 2000,
          weight: 85000,
          height: 185,
          age: 30,
          last: [1],
        },
      },
    });

    expect(response.statusCode).toBe(400);

    const body = response.json();

    expect(body.message).toBe("Validation error");

    await app.close();
  });
});
