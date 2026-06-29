export interface Country {
  picture: string;
  code: string;
}

export type MatchResult = 0 | 1;

export interface PlayerData {
  rank: number;
  points: number;
  weight: number;
  height: number;
  age: number;
  last: MatchResult[];
}

export interface Player {
  id: number;
  firstname: string;
  lastname: string;
  shortname: string;
  sex: "M" | "F";
  country: Country;
  picture: string;
  data: PlayerData;
}
