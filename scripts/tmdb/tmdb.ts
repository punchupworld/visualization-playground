import { env } from "process";

interface Genre {
  id: number;
  name: string;
}

interface SearchResult {
  title: string;
  genre_ids: number[];
}

export async function fetchGenres() {
  const { genres } = await fetchTmdb<{ genres: Genre[] }>("/genre/movie/list");

  return genres;
}

export async function fetchMovieGenres(title: string) {
  const { results } = await fetchTmdb<{ results: SearchResult[] }>(
    `/search/movie?query=${title}`,
  );

  return results.find((res) => res.title === title)?.genre_ids;
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
