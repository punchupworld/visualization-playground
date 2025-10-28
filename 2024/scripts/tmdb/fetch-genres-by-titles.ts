import "dotenv/config";
import { csvParse, csvFormat } from "d3-dsv";
import { readFileSync, writeFileSync } from "fs";
import { argv, exit } from "process";
import pLimit from "p-limit";
import { fetchGenres, searchAnimation } from "./tmdb";

const OUTPUT = "movie-genres.csv";
const MAX_CONCURRENT_REQUESTS = 40;

interface InputMovie {
  title: string;
  release_date: string;
}

interface OutputMovie extends InputMovie {
  genres?: string[];
  tmdbUrl?: string;
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
  console.log(`Fetching ${inputMovies.length} animations from ${inputCsv}...`);

  const concurrency = pLimit(MAX_CONCURRENT_REQUESTS);

  const movies: (OutputMovie | null)[] = await Promise.all(
    inputMovies.map((input) =>
      concurrency(async () => {
        const movie = await searchAnimation(input.title, input.release_date);

        if (!movie) return null;

        return {
          ...input,
          genres: movie.genre_ids
            .map((id) => genreMap.get(id))
            .filter((genre) => genre) as string[],
          tmdbUrl: `https://www.themoviedb.org/movie/${movie.id}`,
          backDrop: movie.backdrop_path,
          poster: movie.poster_path,
        };
      }),
    ),
  );

  const animationWithGenre = movies.filter((m) => m) as OutputMovie[];

  writeFileSync(OUTPUT, csvFormat(animationWithGenre));

  console.log(
    `Succesfully write ${animationWithGenre.length} animations to ${OUTPUT}`,
  );
} catch (e) {
  console.error(e);
  exit(1);
}
