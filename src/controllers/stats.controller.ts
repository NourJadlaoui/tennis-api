import { StatsService } from "../services/stats.service";

export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  getStats() {
    return this.statsService.getStats();
  }
}
