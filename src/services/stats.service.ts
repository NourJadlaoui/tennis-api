import { PlayersRepository } from "../repositories/players.repository";
import type { Player } from "../models/player.model";

export class StatsService {
  constructor(private readonly repo = new PlayersRepository()) {}

  public getStats() {
    const players = this.repo.findAll();

    return {
      countryWithHighestWinRatio: this.topCountryByWinRate(players),
      averageBmi: this.calculateAverageIMC(players),
      medianHeight: this.calculateMedianHeight(players),
    };
  }

  private topCountryByWinRate(players: Player[]) {
    const map = new Map<string, { wins: number; matches: number }>();

    for (const player of players) {
      const country = player.country.code;
      const last = player.data.last;

      const wins = last.filter((v) => v === 1).length;
      const matches = last.length;

      const current = map.get(country) || { wins: 0, matches: 0 };

      map.set(country, {
        wins: current.wins + wins,
        matches: current.matches + matches,
      });
    }

    let bestCountry = "";
    let bestRatio = -1;

    for (const [country, data] of map.entries()) {
      const ratio = data.matches ? data.wins / data.matches : 0;

      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestCountry = country;
      }
    }

    return {
      country: bestCountry,
      ratio: Number(bestRatio.toFixed(2)),
    };
  }

  private calculateAverageIMC(players: Player[]): number {
    let sum = 0;

    for (const p of players) {
      const weightKg = p.data.weight / 1000;
      const heightM = p.data.height / 100;
      sum += weightKg / (heightM * heightM);
    }

    return Number((sum / players.length).toFixed(2));
  }

  private calculateMedianHeight(players: Player[]) {
    const heights = players.map((p) => p.data.height).sort((a, b) => a - b);

    const mid = Math.floor(heights.length / 2);

    const median =
      heights.length % 2 === 0
        ? (heights[mid - 1] + heights[mid]) / 2
        : heights[mid];

    return Number(median.toFixed(2));
  }
}
