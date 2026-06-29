import { Player } from "../models/player.model";
import players from "../data/headtohead.json";

export class PlayersRepository {
  findAll(): Player[] {
    return players as Player[];
  }

  findById(id: number): Player | undefined {
    return this.findAll().find((player) => player.id === id);
  }

  create(player: Omit<Player, "id">): Player {
    const players = this.findAll();

    const newPlayer: Player = {
      ...player,
      id: this.generateId(players),
    };

    (players as Player[]).push(newPlayer);

    return newPlayer;
  }

  private generateId(players: Player[]): number {
    return players.length ? Math.max(...players.map((p) => p.id)) + 1 : 1;
  }
}
