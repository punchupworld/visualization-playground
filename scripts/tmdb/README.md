# The Movie Database (TMDB) Fetching Scripts

Create `.env` with TMDB token

```env
TMDB_TOKEN=<token>
```

To fetch genres from input csv with movies' title

```sh
npx tsx fetch-genres-by-titles.ts input.csv
```
