import { Table, Column, type RowType } from "sheethuahua";
import type directors from "../../../scripts/subtitles/out/directors.json";

type RawDirector = (typeof directors)[number];
export interface Director extends RawDirector {
  averageWordsPerMinute: number;
  movies: Movie[];
}

export type Movie = RawDirector["movies"][number] & {
  wordFrequency: Omit<WordFrequency, "movieId">[];
};

export const wordFrequencyTable = Table({
  movieId: Column.Number(),
  minute: Column.Number(),
  negative: Column.Number(),
  neutral: Column.Number(),
  positive: Column.Number(),
});

type WordFrequency = RowType<typeof wordFrequencyTable>;
