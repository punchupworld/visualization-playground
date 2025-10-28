# The Movie Database (TMDB) Fetching Scripts

Create `.env` with TMDB token

```env
TMDB_TOKEN=<token>
```

1. To fetch genres from input csv with movies' title

```sh
npx tsx fetch-genres-by-titles.ts input.csv
```

2. To fetch all animations from 2000 until now

```sh
npx tsx fetch-animations.ts 2000-01-01
```
