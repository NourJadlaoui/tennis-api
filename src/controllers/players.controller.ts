import { Player } from "../models/player.model";
import { PlayersService } from "../services/players.service";
import { CreatePlayerInput } from "../validators/player.validator";

export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  getPlayers() {
    return this.playersService.getAllPlayers();
  }

  getPlayerById(id: number) {
    return this.playersService.getPlayerById(id);
  }

  createPlayer(data: CreatePlayerInput): Player {
    return this.playersService.createPlayer(data);
  }
}
