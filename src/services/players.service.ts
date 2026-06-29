import { PlayersRepository } from "../repositories/players.repository";
import type { Player } from "../models/player.model";
import { CreatePlayerInput } from "../validators/player.validator";

export class PlayersService {
  constructor(private readonly repo = new PlayersRepository()) {}

  getAllPlayers(): Player[] {
    const players = this.repo.findAll();

    // rank ASC = best player first
    return [...players].sort((a, b) => a.data.rank - b.data.rank);
  }

  getPlayerById(id: number): Player {
    const player = this.repo.findById(id);

    if (!player) {
      throw new Error("Player not found");
    }

    return player;
  }

  createPlayer(data: CreatePlayerInput): Player {
    return this.repo.create(data);
  }
}
