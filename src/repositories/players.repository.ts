import { Player } from '../models/player.model';
import players from '../data/headtohead.json'

export class PlayersRepository {
    findAll(): Player[] {
        return players as Player[];
    }
}