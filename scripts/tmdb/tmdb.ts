import { env } from "process";

const ANIMATION_GENRE_ID = 16;

interface Genre {
  id: number;
  name: string;
}

interface SearchResult {
  id: number;
  title: string;
  genre_ids: number[];
  release_date: string;
  backdrop_path: string;
  poster_path: string;
}

export async function fetchGenres() {
  const { genres } = await fetchTmdb<{ genres: Genre[] }>("/genre/movie/list");

  return genres;
}

export async function searchAnimation(title: string, release_date: string) {
  const { results } = await fetchTmdb<{ results: SearchResult[] }>(
    `/search/movie?query=${title}`,
  );

  return results.find(
    (res) =>
      res.title === title &&
      res.genre_ids.includes(ANIMATION_GENRE_ID) &&
      res.release_date.includes(release_date),
  );
}

async function fetchTmdb<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.themoviedb.org/3${path}`, {
    headers: {
      authorization: `Bearer ${env.TMDB_TOKEN}`,
    },
  });

  if (!res.ok) throw await res.json();

  return res.json() as Promise<T>;
}
