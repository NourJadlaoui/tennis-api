import { PlayersService } from "../services/players.service";

export class PlayersController {
  constructor(private readonly service = new PlayersService()) {}

  getPlayers() {
    return this.service.getAllPlayers();
  }
}
