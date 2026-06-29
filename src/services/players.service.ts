import { PlayersRepository } from '../repositories/players.repository';
import type { Player } from '../models/player.model';

export class PlayersService {
  constructor(private readonly repo = new PlayersRepository()) {}

  getAllPlayers(): Player[] {
    const players = this.repo.findAll();

    // rank ASC = best player first
    return [...players].sort((a, b) => a.data.rank - b.data.rank);
  }
}