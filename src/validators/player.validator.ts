import { z } from "zod";

const CountrySchema = z.object({
  picture: z.string().url(),
  code: z.string().min(2).max(3),
});

const PlayerDataSchema = z.object({
  rank: z.number().int().nonnegative(),
  points: z.number().nonnegative(),
  weight: z.number().positive(),
  height: z.number().positive(),
  age: z.number().int().positive(),
  last: z.array(z.union([z.literal(0), z.literal(1)])).min(1),
});

export const CreatePlayerSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  shortname: z.string().min(1),
  sex: z.enum(["M", "F"]),
  country: CountrySchema,
  picture: z.string().url(),
  data: PlayerDataSchema,
});

export type CreatePlayerInput = z.infer<typeof CreatePlayerSchema>;
