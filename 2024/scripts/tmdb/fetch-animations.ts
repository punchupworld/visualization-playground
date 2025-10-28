import "dotenv/config";
import { csvFormat } from "d3-dsv";
import { writeFileSync } from "fs";
import { argv, exit } from "process";
import { fetchGenres, type MovieResult, getAnimationsInYear } from "./tmdb";

interface Animation extends Omit<MovieResult, "genre_ids" | "id"> {
  genres: string[];
  tmdbUrl: string;
}

const OUTPUT = "tmdb-animations.csv";

const fromReleaseYear = +argv[2];
const toReleaseYear = +argv[3];

try {
  if (!fromReleaseYear || !toReleaseYear) {
    throw "ERROR: Please specified from and to release year";
  }

  console.log("Fetching genres...");

  const genreMap = new Map<number, string>(
    (await fetchGenres()).map(({ id, name }) => [id, name]),
  );

  console.log(`Found ${genreMap.size} genre`);

  const animations: Animation[] = [];

  for (let year = toReleaseYear; year >= fromReleaseYear; year--) {
    let currentPage = 1;
    let finalPage = 1;

    do {
      const { results, total_pages } = await getAnimationsInYear(
        year,
        currentPage,
      );

      animations.push(
        ...results.map(({ id, genre_ids, ...rest }) => ({
          ...rest,
          genres: genre_ids.map((id) => genreMap.get(id) as string),
          tmdbUrl: `https://www.themoviedb.org/movie/${id}`,
        })),
      );

      console.log(
        `Year ${year} - ${currentPage}/${total_pages} pages (total ${animations.length} animations) are fetched`,
      );

      currentPage++;
      finalPage = total_pages;
    } while (currentPage <= finalPage);
  }

  writeFileSync(OUTPUT, csvFormat(animations));

  console.log(`Succesfully write ${animations.length} animations to ${OUTPUT}`);
} catch (e) {
  console.error(e);
  exit(1);
}
