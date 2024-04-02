<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<script setup>
import { ref, onMounted } from "vue";
import * as d3 from "d3";
import { computePosition, shift, flip, offset } from "@floating-ui/dom";
import Information from "../components/icon/Information.vue";
import MdiMovieCogOutline from "./icon/MdiMovieCogOutline.vue";
import CloseIcon from "./icon/CloseIcon.vue";
import HandPointing from "./icon/HandPointing.vue";

const animations = ref(null);
const studioList = ref();
const studioGroupedData = ref();
const separatedDataArray = ref([]);
const genresGroupCount = ref(null);
const studioGroupConut = ref(null);
const topStudios = ref(null);
const showStudioFilter = ref(false);
const dataGroupByReleaseYear = ref(null);
const genres = ref([]);
const selectedStudios = ref([]);
const selectedStudioName = ref();
const showStudioDetail = ref(false);
const studioDetailSet = ref();
const studioDetailYearSet = ref();
const colors = [
  { genre: "family", color: "#4E79A7" },
  { genre: "comedy", color: "#F28E2C" },
  { genre: "romance", color: "#E15759" },
  { genre: "adventure", color: "#76B7B2" },
  { genre: "action", color: "#59A14F" },
  { genre: "science fiction", color: "#EDC949" },
  { genre: "drama", color: "#AF7AA1" },
  { genre: "fantasy", color: "#FF9DA7" },
  { genre: "horror", color: "#9C755F" },
  { genre: "mystery", color: "#BAB0AB" },
  { genre: "other", color: "#CCEBC5" },
  { genre: "western", color: "#FDB462" },
  { genre: "thriller", color: "#80B1D3" },
];
const isHover = ref(false);
const hoverObj = ref(null);
const genresFocus = ref(null);
const genresSet = ref([
  "family",
  "comedy",
  "romance",
  "adventure",
  "action",
  "science fiction",
  "drama",
  "fantasy",
  "horror",
  "mystery",
  "western",
  "thriller",
  "other",
]);
const chartElementSize = ref(0);

const groupByReleaseYear = (movieData) => {
  return movieData.reduce((acc, movie) => {
    const releaseYear = new Date(movie.IAD_release_date).getFullYear();
    acc[releaseYear] = acc[releaseYear] || [];
    acc[releaseYear].push(movie);
    return acc;
  }, {});
};

const groupByYearAndGenre = (movieData) => {
  return movieData.reduce((acc, movie) => {
    const releaseYear = new Date(movie.IAD_release_date).getFullYear();
    acc[releaseYear] = acc[releaseYear] || {};
    movie.genres.forEach((genre) => {
      acc[releaseYear][genre] = acc[releaseYear][genre] || [];
      acc[releaseYear][genre].push(movie);
    });
    return acc;
  }, {});
};

const groupByGenre = (movieData) => {
  return movieData.reduce((acc, movie) => {
    movie.genres.forEach((genre) => {
      acc[genre] = acc[genre] || [];
      acc[genre].push(movie);
    });
    return acc;
  }, {});
};

const countAnimationsByStudio = (animations) => {
  return animations.reduce((acc, animation) => {
    acc[animation.studio] = (acc[animation.studio] || 0) + 1;
    return acc;
  }, {});
};

const sortDataDescending = (data) => {
  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  return Object.fromEntries(sortedEntries);
};

const setData = async () => {
  animations.value = await d3.csv("/movies_with_genres.csv");

  animations.value.forEach((animation) => {
    animation.genres = animation.genres.split(",").map((genre) => genre.trim());
    animation.genres.forEach((genre) => {
      const separatedData = {
        ...animation,
        genres: [genre],
        isMultiGenres: animation.genres.length > 1,
        numOfGenres: animation.genres.length,
      };
      separatedDataArray.value.push(separatedData);
    });
  });

  dataGroupByReleaseYear.value = groupByReleaseYear(separatedDataArray.value);
  genresGroupCount.value = animations.value.reduce((acc, curr) => {
    curr.genres.forEach((genre) => {
      if (acc[genre]) {
        acc[genre]++;
      } else {
        acc[genre] = 1;
      }
    });
    return acc;
  }, {});
};

const setStudioData = () => {
  studioGroupConut.value = countAnimationsByStudio(animations.value);
  studioGroupConut.value = sortDataDescending(studioGroupConut.value);

  studioGroupConut.value = Object.entries(studioGroupConut.value)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);

  topStudios.value = Object.fromEntries(studioGroupConut.value);
  topStudios.value["Other"] = 0;

  genresGroupCount.value = sortDataDescending(genresGroupCount.value);

  studioList.value = animations.value.map((item) => item.studio);
  const uniqueStudios = new Set(
    studioList.value.map((genre) => genre.trim().toLowerCase()),
  );

  studioList.value = Array.from(uniqueStudios);
  studioList.value.unshift("All");

  studioGroupedData.value = animations.value.reduce((acc, curr) => {
    if (acc[curr.studio]) {
      acc[curr.studio].push(curr);
    } else {
      acc[curr.studio] = [curr];
    }
    return acc;
  }, {});
};

const filterGenres = () => {
  genres.value = Array.from(
    new Set(
      animations.value
        .flatMap((animation) => animation.genres)
        .map((genre) => genre.trim().toLowerCase()),
    ),
  );
};

const handleStudioDetail = (studio) => {
  if (studio) {
    selectedStudioName.value = studio;
    let target;
    for (const key in studioGroupedData.value) {
      if (key === studio) {
        target = key;
      }
    }
    studioDetailSet.value = studioGroupedData.value[`${target}`];
    studioDetailSet.value = groupByGenre(studioDetailSet.value);
    studioDetailYearSet.value = groupByYearAndGenre(
      studioGroupedData.value[`${target}`],
    );
  }
  showStudioDetail.value = true;
};

const handleHover = (detail, year, isOut) => {
  if (!isOut) {
    const data = dataGroupByReleaseYear.value[year]
      .filter(
        (item) =>
          item.title === detail.title &&
          item.IAD_release_date === detail.IAD_release_date,
      )
      .map((item) => item.genres);

    genresFocus.value = data.flat();
    hoverObj.value = { ...detail };
    isHover.value = true;
  } else if (isOut) {
    isHover.value = false;
  }
};

const handleDisplay = (detail) => {
  if (
    detail &&
    detail?.title === hoverObj.value?.title &&
    detail?.IAD_release_date === hoverObj.value?.IAD_release_date &&
    detail.isMultiGenres &&
    isHover.value
  ) {
    return "outline outline-1";
  }

  if (
    genresSet.value &&
    !genresSet.value.includes(detail.genres[0].toLowerCase())
  ) {
    return "opacity-0 pointer-events-none";
  }
  if (!selectedStudios.value.length) {
    return "opacity-100";
  }
  if (selectedStudios.value.includes("Other")) {
    let opacityValue = "opacity-100";
    if (
      selectedStudios.value.length === 1 ||
      !selectedStudios.value.includes(detail.studio)
    ) {
      studioGroupConut.value.forEach((a) => {
        if (a[0] === detail.studio) {
          opacityValue = "opacity-0 pointer-events-none";
        }
      });
    }
    return opacityValue;
  } else if (!selectedStudios.value.includes(detail.studio)) {
    return "opacity-0 pointer-events-none";
  } else {
    return "opacity-100";
  }
};

const x = d3.scaleLinear().domain([0, 24]).range([0, 360]);

const handleGenresFilter = (name) => {
  if (genresSet.value.includes(name)) {
    genresSet.value = genresSet.value.filter((n) => n !== name);
  } else {
    genresSet.value.push(name);
  }
};

const toggleStudioFilter = () => {
  showStudioFilter.value = !showStudioFilter.value;
};

const calculatePercentage = (mode, data, genre) => {
  if (studioDetailSet.value && mode === "studio") {
    let totalCount = 0;
    let maxValue = 0;
    let maxGenres = [];
    const data = studioDetailSet.value;

    for (const key in data) {
      const count = data[key].length;
      totalCount += count;

      if (count > maxValue) {
        maxValue = count;
        maxGenres = [key];
      } else if (count === maxValue) {
        maxGenres.push(key);
      }
    }

    const maxPercent = Math.floor((maxValue / totalCount) * 100);

    return {
      max: maxPercent,
      genre: maxGenres,
      maxValue: maxValue,
      totalCount: totalCount,
    };
  } else if (data) {
    let sumEachYear = 0;
    for (const key in data) {
      sumEachYear += data[key].length;
    }
    let num = data[genre].length;
    const percent = Math.floor((num / sumEachYear) * 100);
    return percent;
  }
};

const calculateHeight = (num, sumGenre) => {
  let height = (100 * num) / sumGenre;
  return Math.ceil(height);
};

const filterAnimations = (year) => {
  return dataGroupByReleaseYear.value[year]
    .filter((detail) => {
      if (
        selectedStudios.value.includes("Other") &&
        selectedStudios.value.length > 0
      ) {
        return (
          !studioGroupConut.value.find(
            ([studio]) => studio === detail.studio,
          ) || selectedStudios.value.includes(detail.studio)
        );
      } else if (
        !selectedStudios.value.includes("Other") &&
        selectedStudios.value.length > 0
      ) {
        return selectedStudios.value.includes(detail.studio);
      } else {
        return true;
      }
    })
    .filter((detail) => {
      return (
        !genresSet.value ||
        genresSet.value.includes(detail.genres[0].toLowerCase())
      );
    })
    .sort(
      (a, b) =>
        genresGroupCount.value[a.genres[0]] -
        genresGroupCount.value[b.genres[0]],
    );
};

const k2 = ref(1);
const k1 = ref(1);
const x1 = ref(0);
const x2 = ref(0);
const y1 = ref(0);
const y2 = ref(0);

const imgChartHeight = ref(30);
const genreFilterElementWidth = ref(0);

onMounted(async () => {
  await setData();

  setStudioData();
  filterGenres();
  const chartImg = document.getElementsByClassName("chart-img")[0];
  imgChartHeight.value = chartImg.clientHeight;

  const genreFilterElement = document.getElementById("genre-div");
  genreFilterElementWidth.value = genreFilterElement.clientWidth;

  const chartDiv = document.getElementById("chart-div");
  if (chartDiv) {
    if (window.innerWidth > 1024) {
      chartElementSize.value = chartDiv.clientHeight;
    } else {
      chartElementSize.value = chartDiv.clientWidth;
    }
  } else {
    chartElementSize.value = 0;
  }

  const zoomableImage = document.getElementById("zoomable-image");
  let isFirstZoom = true;
  const zoom = d3
    .zoom()
    .scaleExtent([1, 10])
    .on("zoom", (event) => {
      if (isFirstZoom) {
        x1.value = event.transform.x;
        y1.value = event.transform.y;
        isFirstZoom = false;
      }

      x2.value = event.transform.x;
      y2.value = event.transform.y;
      k2.value = event.transform.k;

      if (!isFirstZoom) {
        zoomableImage.children[0].style.transform = `scale(${k2.value}) translate(${x1.value}px, ${y1.value}px)`;
      }
      if (event.transform.x) {
        zoomableImage.children[0].style.transform = `scale(${k2.value}) translate(${event.transform.x}px, ${event.transform.y}px)`;
      }
    });

  d3.select(zoomableImage).call(zoom);
  d3.select(zoomableImage.children[0]).call(zoom.transform, d3.zoomIdentity);

  const floating = document.getElementById("floating");
  // eslint-disable-next-line vue/no-ref-as-operand
  if (isHover) {
    document.addEventListener("mousemove", ({ clientX, clientY }) => {
      const virtualEl = {
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: clientX,
            y: clientY,
            left: clientX,
            right: clientX,
            top: clientY,
            bottom: clientY,
          };
        },
      };

      computePosition(virtualEl, floating, {
        placement: "right-start",
        middleware: [offset(5), flip(), shift()],
      }).then(({ x, y }) => {
        Object.assign(floating.style, {
          top: `${y}px`,
          left: `${x}px`,
        });
      });
    });
  }
});
</script>

<template>
  <div class="w-full relative flex h-screen">
    <div
      v-show="showStudioDetail"
      class="fixed z-30 w-full flex items-center justify-center h-full"
    >
      <div
        class="bg-[#F6F6EE] flex flex-col lg:flex-row justify-center rounded-xl relative max-w-[40vh] lg:max-w-full shadow-md shadow-white/10"
      >
        <div
          class="text-white bg-black/100 max-w-[500px] h-full relative p-5 flex flex-col justify-end lg:rounded-s-xl"
        >
          <p class="typo-h4 font-head font-semibold">
            {{ selectedStudioName }}
          </p>
          <p class="typo-b5 pb-3">
            the most genre of {{ selectedStudioName }} studio
          </p>
          <p class="lg:typo-h1 typo-h2 font-head font-semibold text-[#CEA35F]">
            {{ calculatePercentage("studio")?.max }}%
            <span class="text-white typo-b4"
              >{{ calculatePercentage("studio")?.maxValue }} of
              {{ calculatePercentage("studio")?.totalCount }} animations</span
            >
          </p>
          <div v-if="studioDetailSet" class="w-full py-5">
            <div class="w-full flex h-[20px]">
              <div
                v-for="genre in Object.keys(studioDetailSet).sort(
                  (a, b) =>
                    studioDetailSet[b].length - studioDetailSet[a].length,
                )"
                :key="genre"
                class="w-full"
                :style="{
                  width:
                    Math.floor(
                      (studioDetailSet[genre].length /
                        Object.values(studioDetailSet).reduce(
                          (acc, val) => acc + val.length,
                          0,
                        )) *
                        100,
                    ) + '%',
                  'background-color': colors.find(
                    (color) => color.genre === genre.toLowerCase(),
                  ).color,
                }"
              />
            </div>
          </div>
          <div class="flex gap-2">
            <p>is</p>
            <div>
              <div v-if="calculatePercentage('studio')">
                <p
                  v-for="(genre, index) in calculatePercentage('studio').genre"
                  :key="index"
                  class="lg:typo-h2 typo-h4 font-semibold uppercase font-body"
                >
                  <span
                    v-if="
                      index === 1 &&
                      calculatePercentage('studio').genre.length > 1
                    "
                  >
                    &
                  </span>
                  <span>{{ genre }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="studioDetailYearSet && studioDetailSet"
          class="flex flex-col items-center justify-center px-8 relative py-6 lg:py-0"
        >
          <p class="typo-b5 font-semibold py-3">
            Proportion of Film Genres Over Each Year
          </p>
          <div class="flex">
            <div
              v-for="(year, index) in Object.keys(studioDetailYearSet)"
              :key="index"
              class="group flex flex-col items-center gap-4 lg:h-[200px] h-[150px] cursor-pointer"
            >
              <div
                class="absolute bg-white rounded-md border p-2 opacity-0 group-hover:opacity-100 -top-8 z-20 pointer-events-none"
              >
                <p class="font-semibold text-sm">Year: {{ year }}</p>
                <div
                  v-for="genre in Object.keys(studioDetailYearSet[year]).sort(
                    (a, b) =>
                      studioDetailYearSet[year][b].length -
                      studioDetailYearSet[year][a].length,
                  )"
                  :key="genre"
                >
                  <div class="flex items-center">
                    <div
                      class="lg:w-3 lg:h-3 w-2 h-2 mr-1"
                      :style="{
                        'background-color': colors.find(
                          (color) => color.genre === genre.toLowerCase(),
                        ).color,
                      }"
                    />
                    <p class="text-xs">
                      {{ genre }}
                      <span class="font-semibold">
                        {{
                          calculatePercentage(
                            "other",
                            studioDetailYearSet[year],
                            genre,
                          )
                        }}%
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex flex-col-reverse h-full items-center">
                <div
                  v-for="(genre, index) in Object.keys(
                    studioDetailYearSet[year],
                  ).sort()"
                  :key="index"
                  class="lg:w-3 w-2"
                  :style="{
                    height:
                      calculateHeight(
                        studioDetailYearSet[year][genre].length,
                        Object.values(studioDetailYearSet[year]).reduce(
                          (acc, val) => acc + val.length,
                          0,
                        ),
                        Object.values(studioDetailSet).reduce(
                          (acc, val) => acc + val.length,
                          0,
                        ),
                      ) + '%',
                    'background-color': colors.find(
                      (color) => color.genre === genre.toLowerCase(),
                    ).color,
                  }"
                />
              </div>

              <div class="rotate-90 lg:text-[9px] text-[7px] text-center">
                {{ year }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="absolute right-0 top-0 p-3 cursor-pointer"
          @click="showStudioDetail = false"
        >
          <CloseIcon
            class="text-white lg:text-black text-2xl hover:text-[#e7507d] duration-150"
          />
        </div>
      </div>
    </div>

    <div class="w-full h-full" :class="showStudioDetail ? 'opacity-50' : ''">
      <div
        class="flex flex-col-reverse lg:flex-row w-full justify-start items-start h-full"
      >
        <div
          class="lg:w-1/4 w-full bg-[#e7507d] flex flex-col self-end justify-ed lg:p-7 p-4 lg:h-full"
        >
          <div class="lg:border-b-[1px] lg:border-black">
            <p class="typo-b4 font-body font-semibold">Studio Animation</p>
            <h1 class="typo-h4 font-head font-black">DECADE of</h1>
            <h1 class="typo-h4 font-head font-black">GENRE DIVERSITY</h1>
            <p class="typo-b4 font-body font-semibold hidden lg:block">
              Retracing the 24-Year Journey of Animations: Comparative Analysis
              of Genre Distribution in Animation Production
            </p>
            <p
              class="typo-b6 p-2 font-body hidden lg:block opacity-70 lg:border-t-[1px] lg:border-black py-2 mt-3"
            >
              * For movies featuring more than one genre, each will be
              subdivided into smaller boxes. For movies with only one genre,
              they will be displayed as individual posters.
            </p>
          </div>

          <div class="bg-white lg:my-5 mb-5 rounded-md p-3 shadow-lg">
            <div class="flex flex- gap-1">
              <div
                v-for="item in Math.floor(genreFilterElementWidth / 15)"
                :key="item"
                class="w-3 h-4 rounded-sm bg-[#000000]"
              />
            </div>
            <div id="genre-div" class="py-3">
              <p class="font-head typo-b6 font-semibold">
                Genres
                <span class="typo-b7 font-normal text-zinc-400">
                  ( click for filter by genre )
                </span>
              </p>
              <div class="flex gap-3 typo-b7 font-head text-nowrap h-full">
                <div class="flex flex-wrap gap-1">
                  <div
                    v-for="(color, index) in colors"
                    :key="index"
                    class="flex cursor-pointer"
                    @click="handleGenresFilter(color.genre)"
                  >
                    <div
                      class="p-1 lg:p-2 flex items-center"
                      :class="
                        genresSet.includes(color.genre) ? '' : 'opacity-40'
                      "
                      :style="{
                        'background-color': color.color,
                      }"
                    >
                      {{ color.genre }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex- gap-1">
              <div
                v-for="item in Math.floor(genreFilterElementWidth / 15)"
                :key="item"
                class="w-3 h-4 rounded-sm bg-[#000000]"
              />
            </div>
          </div>
        </div>

        <div
          id="chart-div"
          class="lg:w-3/4 w-full bg-black/90 text-white p-3 flex flex-col lg:flex-row gap-3 shadow-md typo-b7 font-head text-nowrap h-full justify-between"
        >
          <div class="flex lg:flex-col gap-1">
            <div
              v-for="item in Math.floor(chartElementSize / 16)"
              :key="item"
              class="w-4 h-3 rounded-sm bg-[#F7F5DD]"
            />
          </div>

          <div
            class="flex justify-center items-center h-full overflow-hidden w-full"
            :class="showStudioDetail ? 'opacity-50' : ''"
          >
            <div
              id="zoomable-image"
              class="flex justify-center items-center h-full w-full"
            >
              <div
                v-if="dataGroupByReleaseYear"
                class="flex w-0 h-0 justify-center items-center relative transition-transform duration-[20ms] ease-linear"
                style="transform-origin: 0 0"
              >
                <div
                  v-for="(year, index) in Object.keys(
                    dataGroupByReleaseYear,
                  ).filter((key) => !isNaN(parseFloat(key)))"
                  :id="'set' + index"
                  :key="index"
                  :year="year"
                  class="group flex self-end items-end absolute origin-bottom z-0"
                  :style="{
                    transform: `rotate(${x(index)}deg)`,
                  }"
                >
                  <div
                    class="flex flex-col gap-[1px] flex-wrap justify-center items-center pb-12 h-full"
                  >
                    <div
                      v-for="(detail, dIndex) in filterAnimations(year)"
                      :key="dIndex"
                      class="w-[10px] cursor-pointer group hover:outline outline-1 outline-white h-full"
                      :class="handleDisplay(detail)"
                      @mouseover="handleHover(detail, year, false)"
                      @mouseout="handleHover(detail, year, true)"
                    >
                      <div class="group-img relative h-full">
                        <img
                          v-if="!detail.isMultiGenres"
                          :src="
                            'https://image.tmdb.org/t/p/w300_and_h450_bestv2' +
                            detail.poster_path
                          "
                          alt=""
                          class="chart-img relative saturate-0 contrast-50 z-10"
                        />
                        <div
                          v-for="genre in detail.genres"
                          :key="genre"
                          :style="{
                            'background-color': colors.find(
                              (color) => color.genre === genre.toLowerCase(),
                            ).color,
                          }"
                          class="absolute top-0 hover:opacity-70 opacity-50 w-[10px] z-20 h-full"
                        />
                        <div v-if="detail.isMultiGenres">
                          <div
                            v-for="genre in detail.genres"
                            :key="genre"
                            :style="{
                              'background-color': colors.find(
                                (color) => color.genre === genre.toLowerCase(),
                              ).color,
                              height:
                                Math.floor(
                                  parseInt(imgChartHeight) / detail.numOfGenres,
                                ) + 'px',
                            }"
                            class="opacity-70 w-[10px]"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      class="pl-3 font-head text-[10px] text-white/70 rotate-90"
                    >
                      {{ year }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-show="isHover"
                id="floating"
                class="opacity-100 absolute bg-[#F6F6EE] lg:p-4 p-2 pointer-events-none shadow-xl rounded-md z-30 flex items-start gap-2 w-max left-0 text-black lg:text-[10px] text-[8px] font-body"
              >
                <img
                  :src="
                    'https://image.tmdb.org/t/p/w300_and_h450_bestv2' +
                    hoverObj?.poster_path
                  "
                  alt="img"
                  class="lg:w-20 w-12"
                />
                <div>
                  <div class="flex flex-col">
                    <p class="font-semibold lg:text-[14px]">
                      {{ hoverObj?.title }}
                    </p>
                    <p class="font-body">
                      ({{ hoverObj?.IAD_release_date.slice(0, 4) }})
                    </p>
                    <p>{{ hoverObj?.studio }}</p>
                  </div>
                  <div>
                    <p class="font-semibold">Genres</p>
                    <div>
                      <div
                        v-for="(genre, index) in genresFocus"
                        :key="index"
                        class="flex lg:gap-2 gap-1 items-center"
                      >
                        <div
                          class="lg:w-3 lg:h-3 w-2 h-2 rounded-full"
                          :style="{
                            'background-color': colors.find(
                              (color) => color.genre === genre.toLowerCase(),
                            ).color,
                          }"
                        />
                        <p>
                          {{ genre }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex lg:flex-col gap-1">
            <div
              v-for="item in Math.floor(chartElementSize / 16)"
              :key="item"
              class="w-4 h-3 rounded-sm bg-[#F7F5DD]"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="absolute text-white lg:right-4 right-0 bottom-0 lg:p-10 p-3 lg:text-3xl text-xl lg:hover:text-[#e7507d] hover:text-black duration-200"
      @click="toggleStudioFilter"
    >
      <MdiMovieCogOutline class="hover:text-[e7507d] cursor-pointer" />
      <div
        class="absolute font-light right-12 top-[15px] lg:top-2 text-nowrap flex items-center gap-1 lg:text-zinc-500"
      >
        <p class="typo-b6 font-head">Click for open studio filter</p>
        <HandPointing class="lg:text-xl text-lg lg:rotate-180 rotate-90" />
      </div>
    </div>

    <div
      v-show="showStudioFilter"
      :class="showStudioDetail ? 'opacity-50' : ''"
      class="bg-white rounded-md absolute bottom-10 lg:right-24 right-4 z-20 w-[280px] p-3"
    >
      <div class="flex flex- gap-1">
        <div
          v-for="item in Math.floor(280 / 13)"
          :key="item"
          class="w-3 h-4 rounded-sm bg-[#000000]"
        />
      </div>
      <div class="p-2">
        <p class="font-head">Filter top 5 studio</p>
        <div
          v-if="topStudios"
          class="flex flex-col items-start typo-b7 font-head"
        >
          <div
            v-for="studio in Object.keys(topStudios).sort(
              (a, b) => topStudios[b] - topStudios[a],
            )"
            :key="studio"
            class="flex gap-[2px]"
          >
            <div class="space-x-1">
              <input
                :id="'studio-' + studio"
                v-model="selectedStudios"
                type="checkbox"
                class="accent-pink-500 rounded-md p-4"
                :value="studio"
              />
              <label :for="'studio-' + studio"> {{ studio }}</label>
            </div>

            <div
              v-show="studio !== 'Other'"
              class="cursor-pointer"
              @click="handleStudioDetail(studio)"
            >
              <Information class="hover:text-[#e7507d] text-xs" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex- gap-1">
        <div
          v-for="item in Math.floor(280 / 13)"
          :key="item"
          class="w-3 h-4 rounded-sm bg-[#000000]"
        />
      </div>
    </div>
  </div>
</template>
