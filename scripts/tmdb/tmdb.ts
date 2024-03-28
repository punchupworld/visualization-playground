import { env } from "process";

const ANIMATION_GENRE_ID = 16;

interface Genre {
  id: number;
  name: string;
}

interface TmdbPageResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export async function fetchGenres() {
  const { genres } = await fetchTmdb<{ genres: Genre[] }>("/genre/movie/list");

  return genres;
}

export async function searchAnimation(title: string, release_date: string) {
  const { results } = await fetchTmdb<TmdbPageResponse<MovieResult>>(
    `/search/movie?query=${title}`,
  );

  return results.find(
    (res) =>
      res.title === title &&
      res.genre_ids.includes(ANIMATION_GENRE_ID) &&
      res.release_date.includes(release_date),
  );
}

export function getAnimationsInYear(year: number, page: number) {
  return fetchTmdb<TmdbPageResponse<MovieResult>>(
    `/discover/movie?with_genres=${ANIMATION_GENRE_ID}&primary_release_date.gte=01-01-${year}&primary_release_date.lte=12-12-${year}&sort_by=release_date.desc&page=${page}`,
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
