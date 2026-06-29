import { PlayersService } from "../services/players.service";

export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
  ) {}

  getPlayers() {
    return this.playersService.getAllPlayers();
  }

  getPlayerById(id: number) {
    return this.playersService.getPlayerById(id);
  }
}