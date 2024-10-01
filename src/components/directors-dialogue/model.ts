import type directors from "../../../scripts/subtitles/out/directors.json";

export type Director = (typeof directors)[number];
export type Movie = Director["movies"][number];
