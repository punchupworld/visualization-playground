import "dotenv/config";
import { csvParse, csvFormat } from "d3-dsv";
import { readFileSync, writeFileSync } from "fs";
import { argv, exit } from "process";
import pLimit from "p-limit";
import { fetchGenres, fetchMovieGenres } from "./tmdb";

const OUTPUT = "movie-genres.csv";
const MAX_CONCURRENT_REQUESTS = 5;

interface InputMovie {
  title: string;
}

interface OutputMovie extends InputMovie {
  genres: string[];
}

const inputCsv = argv[2];

try {
  if (!inputCsv) {
    throw "ERROR: Please specified input csv file with title column";
  }

  const inputMovies = csvParse(readFileSync(inputCsv, "utf-8")) as InputMovie[];

  console.log("Fetching genres...");

  const genreMap = new Map<number, string>(
    (await fetchGenres()).map(({ id, name }) => [id, name]),
  );

  console.log(`Found ${genreMap.size} genre`);
  console.log(`Fetching ${inputMovies.length} movies from ${inputCsv}...`);

  const concurrency = pLimit(MAX_CONCURRENT_REQUESTS);

  const outputMovies: OutputMovie[] = await Promise.all(
    inputMovies.map(({ title }) =>
      concurrency(async () => ({
        title,
        genres: (await fetchMovieGenres(title))
          ?.map((id) => genreMap.get(id))
          .filter((genre) => genre) as string[],
      })),
    ),
  );

  writeFileSync(OUTPUT, csvFormat(outputMovies));

  console.log(`Succesfully write output to ${OUTPUT}`);
} catch (e) {
  console.error(e);
  exit(1);
}
