import * as d3 from "d3";
import { groups } from "d3";
import { alphabetical, counting, flat, intersects, unique } from "radash";

export interface RawAnimeData {
  id: string;
  title: string;
  title_jp: string;
  tags: string[];
  posters: { [key: string]: string };
  score: string;
  studios: string[];
  source: string;
  episodes: string;
  synopsis: string;
  related_links: {
    watch: "/anime/3632/streams";
    anilist: "https://anilist.co/anime/813";
    mal: "https://myanimelist.net/anime/813";
    anidb: "http://anidb.net/a1530";
    anime: "http://www.anime-planet.com/anime/dragon-ball-z";
    anisearch: "https://www.anisearch.com/anime/2938";
    kitsu: "https://kitsu.app/anime/720";
    crunchyroll: "https://www.crunchyroll.com/series/G9VHN9PPW";
  };
  season: string;
  year: string;
}

export interface AnimeData {
  title: string;
  tags: string[];
  studio: string;
  studios: string[];
  season: string;
  year: string;
  year_season: string;
  img: string;
}

export interface ChartData {
  genre: string;
  data: {
    year: string;
    count: number;
  }[];
}

export interface StudioData {
  name: string;
  count: number;
}

export const cleanUpData = (rawData: RawAnimeData[]) => {
  const cleanData = rawData.map((d) => ({
    title: d.title,
    tags: d.tags,
    studio: d.studios.join(),
    studios: d.studios,
    season: d.season,
    year: d.year,
    year_season: `${d.year}-${d.season}`,
    img: d.posters ? d.posters["1x"] : "",
  }));

  // find unique studio and order in alphabetical order
  const studioList = [
    { name: "All Studio", count: cleanData.length },
    ...Object.entries(
      counting(
        alphabetical(flat(cleanData.map((d) => d.studios)), (d) => d),
        (d) => d,
      ),
    )
      .map(([k, v]) => ({
        name: k,
        count: v,
      }))
      .sort((a, b) => b.count - a.count),
  ];

  // find unique all year list
  const yearSeasonList = unique(
    cleanData.map((d) => d.year_season),
    (d: string) => d,
  );

  return { cleanData, studioList, yearSeasonList };
};

export const filterDataByStudio = (
  rawData: AnimeData[],
  selectedStudio: string,
) => {
  if (selectedStudio === "All Studio") return rawData;
  else return rawData.filter((d) => d.studios.indexOf(selectedStudio) !== -1);
};

export const filterDataByGenre = (
  rawData: AnimeData[],
  selectedGenre: string[] | null | string,
) => {
  if (
    selectedGenre === "All Genre" ||
    !Array.isArray(selectedGenre) ||
    !selectedGenre
  )
    return rawData;
  else return rawData.filter((d) => intersects(d.tags, selectedGenre));
};

export const getGenreList = (rawData: AnimeData[]) => {
  // find unique genre and order in alphabetical order
  return alphabetical(unique(flat(rawData.map((d) => d.tags))), (d) => d);
};

export const formatData = (res: AnimeData[]) => {
  const genreList = alphabetical(
    unique(flat(res.map((d) => d.tags))),
    (d) => d,
  );

  const data = res.map((d) => ({
    ...d,
    year_season: `${d.year}-${d.season}`,
  }));

  const yearSeasonList = unique(
    data.map((d) => d.year_season),
    (d: string) => d,
  );

  return { genreList, yearSeasonList };
};

export const groupDataByGenre = (res: AnimeData[]) => {
  const data = res.map((d) => ({
    ...d,
    year_season: `${d.year}-${d.season}`,
  }));
  // group data by year_season
  const groupYearSeason = groups(data, (d) => d.year_season);
  // groupYearSeason;
  const chartData: { [key: string]: { [key: string]: number }[] }[] = [];
  groupYearSeason.map((d) => {
    chartData[d[0]] = counting(flat(d[1].map((d) => d.tags)), (d) => d);
    // d[1]
  });

  const tagAndYearData: { tag: string; year_season: string }[] = [];
  data.map((d) =>
    d.tags.map((t) => {
      tagAndYearData.push({
        tag: t,
        year_season: d.year_season,
      });
    }),
  );

  const groupDataByGenre = groups(
    tagAndYearData,
    (d) => d.tag,
    (d) => d.year_season,
  ).map((d) => ({
    genre: d[0],
    data: d[1].map((y) => ({ year: y[0], count: y[1].length })),
  }));

  return groupDataByGenre;
};

export const renderAreaChart = (data: ChartData) => {
  const setting = {
    width: 1500,
    height: 1500,
  };
  const allYearData = data.data;

  const svg = d3
    .select(".container")
    .append("svg")
    .attr("class", data.genre)
    .attr("width", setting.width)
    .attr("height", setting.height);

  const xScale = d3
    .scaleBand()
    .domain(allYearData.map((d) => d.year))
    .range([0, setting.width]);

  const yScale = d3.scaleLinear().domain([0, 100]).range([1500, 0]);

  const areaChart = d3
    .area<{ year: string; count: number }>()
    .x((d) => Number(xScale(d.year)))
    .y0(yScale(0))
    .y1((d) => yScale(d.count));

  svg
    .append("path")
    .datum(allYearData)
    // .attr("fill", "red")
    .attr("d", areaChart);
};
