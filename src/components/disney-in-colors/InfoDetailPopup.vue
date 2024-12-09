<script setup>
import * as d3 from "d3";
import { onMounted, ref, computed, watch, watchEffect } from "vue";
import Clapperboard from "./Clapperboard.vue";

const props = defineProps({
  year: Number,
  categorySelected: String,
  closePopup: Function,
  heros: Array,
  villains: Array,
});

const herosByMovie = ref([]);
const villainsByMovie = ref([]);
const numberOfcharactersByCurrentCategory = ref(0);
const expandMovie = ref("");
const heroCategoryIsSelected = ref(true);
const characterSelected = ref("");
const colorSelected = ref([]);
const colorFocused = ref([]);
const openTutorial = ref(false);
const middleColor = ref({});

onMounted(() => {
  herosByMovie.value = formatDataByMovie(props.heros);
  villainsByMovie.value = formatDataByMovie(props.villains);

  if (herosByMovie.value.length === 1) {
    expandMovie.value = herosByMovie.value[0].movie;
  }

  heroCategoryIsSelected.value =
    props.categorySelected === "hero" ? true : false;
});

const formatDataByMovie = (data) => {
  if (data.length === 0) {
    return [];
  }
  const group = d3.groups(data, (d) => d.featuredFilm);
  const result = group.map((g) => {
    const characters = d3.groups(g[1], (d) => d.name);
    return {
      movie: g[0],
      characters: characters
        .map((c) => {
          return {
            name: c[0],
            ...c[1][0],
          };
        })
        .sort(function (a, b) {
          return a.name.localeCompare(b.name);
        }),
    };
  });
  return result.sort(function (a, b) {
    return a.movie.localeCompare(b.movie);
  });
};

const getColors = computed(() => {
  return heroCategoryIsSelected.value ? props.heros : props.villains;
});

const getCharactersByMovie = computed(() => {
  return heroCategoryIsSelected.value
    ? herosByMovie.value
    : villainsByMovie.value;
});

watchEffect(() => {
  let count = 0;

  getCharactersByMovie.value.forEach((res) => {
    count = count + res.characters.length;
  });

  numberOfcharactersByCurrentCategory.value = count;
});

watchEffect(() => {
  const result = getColors.value;
  const item = result[Math.ceil(result.length / 2) - 1];
  middleColor.value = {
    simplified: item.isBlack
      ? "black"
      : item.isWhite
        ? "white"
        : item.isGrey
          ? "grey"
          : item.isBrown
            ? "#895129"
            : item.isRed
              ? "red"
              : `hsl(${item.hue}, 100%, 50%)`,
    original: `hsl(${item.hslColor[0]}, ${item.hslColor[1]}%, ${item.hslColor[2]}%)`,
  };
});

const scrollToElement = (id) => {
  document
    .getElementById(id)
    .scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
};

const selectColor = (data) => {
  openTutorial.value = false;
  characterSelected.value = data.name;
  colorSelected.value = data.hslColor;
  if (expandMovie.value === data.featuredFilm) {
    scrollToElement(
      data.name.toLowerCase().replace(" ", ""),
      data.featuredFilm,
    );
  } else {
    expandMovie.value = data.featuredFilm;
    setTimeout(() => {
      scrollToElement(
        data.name.toLowerCase().replace(" ", ""),
        data.featuredFilm,
      );
    }, 500);
  }
};

const clearColorSelected = () => {
  characterSelected.value = "";
  colorSelected.value = [];
};

const hslToHex = (hsl) => {
  const [h, s, l] = hsl;

  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const getInvertedColor = () => {
  const bgColor =
    colorFocused.value.length > 0
      ? hslToHex(colorFocused.value)
      : colorSelected.value.length > 0
        ? hslToHex(colorSelected.value)
        : "#ffffff";

  let color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  let r = parseInt(color.substring(0, 2), 16); // hexToR
  let g = parseInt(color.substring(2, 4), 16); // hexToG
  let b = parseInt(color.substring(4, 6), 16); // hexToB
  let uiColors = [r / 255, g / 255, b / 255];
  let c = uiColors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  let L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

  return L <= 0.179 ? "#FFFFFF" : "#000000";
};

watch(
  () => [heroCategoryIsSelected.value],
  () => {
    const movies = heroCategoryIsSelected.value
      ? herosByMovie.value
      : villainsByMovie.value;

    if (movies.length === 1) {
      expandMovie.value = movies[0].movie;
    }
  },
);
</script>

<template>
  <div
    class="flex items-center justify-center fixed inset-0 z-50 transition duration-300"
    :style="{
      background:
        colorFocused.length > 0
          ? `hsl(${colorFocused[0]}, ${colorFocused[1]}%, ${colorFocused[2]}%, 0.5)`
          : colorSelected.length > 0
            ? `hsl(${colorSelected[0]}, ${colorSelected[1]}%, ${colorSelected[2]}%, 0.5)`
            : '',
    }"
    @click="closePopup()"
  >
    <div
      class="relative flex flex-col bg-white text-black rounded-2xl w-[95%] h-[85%] md:w-[80%] md:h-[80%] max-w-[1400px] max-h-[800px] overflow-hidden border-[2px] md:border-[3px] border-black"
      @click="
        (event) => {
          event.stopPropagation();
        }
      "
    >
      <button
        @click="closePopup()"
        type="button"
        class="absolute top-0 right-0 z-30 rounded-md p-2 inline-flex items-center justify-center text-black"
        :style="{ color: getInvertedColor() }"
      >
        <svg
          class="h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div
        class="relative pt-2 pb-11 px-0 md:p-3 w-full flex flex-col items-center transition duration-300"
        :style="{
          background:
            colorFocused.length > 0
              ? `hsl(${colorFocused[0]}, ${colorFocused[1]}%, ${colorFocused[2]}%, 1)`
              : colorSelected.length > 0
                ? `hsl(${colorSelected[0]}, ${colorSelected[1]}%, ${colorSelected[2]}%, 1)`
                : `linear-gradient(90deg,
                    hsl(0, 100%, 50%, 0.8),
                    hsl(30, 100%, 50%, 0.8),
                    hsl(60, 100%, 50%, 0.8),
                    hsl(90, 100%, 50%, 0.8),
                    hsl(120, 100%, 50%, 0.8),
                    hsl(150, 100%, 50%, 0.8),
                    hsl(180, 100%, 50%, 0.8),
                    hsl(210, 100%, 50%, 0.8),
                    hsl(240, 100%, 50%, 0.8),
                    hsl(270, 100%, 50%, 0.8),
                    hsl(300, 100%, 50%, 0.8),
                    hsl(330, 100%, 50%, 0.8),
                    hsl(360, 100%, 50%, 0.8)
                )`,
        }"
      >
        <div
          class="absolute bottom-0 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 flex items-start gap-3 px-3 md:px-5"
        >
          <div
            v-if="villainsByMovie.length > 0"
            :class="`w-[90px] md:w-[112px] bg-white py-1 text-center rounded-t-[20px] cursor-pointer transition duration-300 ${heroCategoryIsSelected && 'opacity-50 translate-y-[5px]'}`"
            @click="heroCategoryIsSelected = false"
          >
            <p
              :class="`typo-b2 ${!heroCategoryIsSelected && 'font-bold'} translate-y-[1px]`"
            >
              Villain
            </p>
          </div>
          <div
            v-if="herosByMovie.length > 0"
            :class="`w-[90px] md:w-[112px] bg-white py-1 text-center rounded-t-[20px] cursor-pointer transition duration-300 ${!heroCategoryIsSelected && 'opacity-50 translate-y-[5px]'}`"
            @click="heroCategoryIsSelected = true"
          >
            <p
              :class="`typo-b2 ${heroCategoryIsSelected && 'font-bold'} translate-y-[1px]`"
            >
              Hero
            </p>
          </div>
        </div>
        <p
          class="typo-h6 font-bold translate-y-[1px]"
          :style="{ color: getInvertedColor() }"
        >
          {{ year }}
        </p>
      </div>

      <div
        @click="openTutorial = !openTutorial"
        class="cursor-pointer absolute z-30 top-[110px] md:top-[105px] right-2 -translate-y-[5px] w-5 h-5 md:w-6 md:h-6 bg-black border-[1px] border-black rounded-full flex items-center justify-center"
      >
        <div class="flex flex-col gap-[2px] typo-b4 font-bold leading-none">
          <div
            class="absolute bottom-0 left-0 w-0 h-0 border-l-[4px] border-l-solid border-l-transparent border-r-[4px] border-r-solid border-r-transparent border-t-[8px] border-t-solid border-t-black transition rotate-[55deg] origin-top-left"
          ></div>
          <div
            class="w-[2.2px] h-[2.2px] md:w-[3px] md:h-[3px] rounded-full bg-white"
          />
          <div
            class="w-[2.2px] h-[6px] md:w-[3px] md:h-[8px] rounded-full bg-white"
          />
        </div>
        <div
          v-if="openTutorial"
          class="flex absolute bottom-0 -left-2 -translate-x-full w-[155px] md:w-[185px] z-30 bg-white pt-4 p-3 border-[1px] md:border-[2px] border-black rounded-md"
        >
          <div class="relative">
            <div
              class="h-12 md:h-16 w-4 md:w-5 flex items-center"
              :style="{ background: middleColor.simplified }"
            >
              <div
                class="relative w-full h-[70%] border-[1px] border-black"
                :style="{ background: middleColor.original }"
              >
                <div
                  class="absolute inset-[0.1px] md:inset-[1px] border-[0.2px] md:border-[1px] border-white"
                ></div>
              </div>
            </div>
            <div
              class="flex absolute top-[5px] -translate-y-1/2 right-0 translate-x-full opacity-50"
            >
              <img class="w-5" src="/disney-in-colors/arrow_left.svg" alt="" />
              <p class="typo-b6 font-bold whitespace-nowrap">
                Simplified Color
              </p>
            </div>
            <div
              class="flex absolute top-1/2 -translate-y-1/2 right-0 translate-x-full"
            >
              <img class="w-5" src="/disney-in-colors/arrow_left.svg" alt="" />
              <p class="typo-b6 font-bold whitespace-nowrap">Original Color</p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col bg-white overflow-hidden"
        @click="clearColorSelected"
      >
        <div class="z-20">
          <div
            class="relative flex items-baseline gap-2 px-4 py-2 md:px-10 md:pt-5 md:pb-2"
          >
            <span class="font-bold typo-b2"
              >{{ getColors.length }} colors
            </span>
            <span class="typo-b5 -translate-y-[1px]"
              >({{ numberOfcharactersByCurrentCategory }} character{{
                numberOfcharactersByCurrentCategory > 1 ? "s" : ""
              }})</span
            >
          </div>
          <div class="relative flex flex-col gap-[1px] pb-3 md:pb-5">
            <div
              class="flex flex-wrap w-full h-12 md:h-16 flex-none bg-white border-[1px] border-black"
              @click="
                (event) => {
                  event.stopPropagation();
                }
              "
            >
              <div
                v-for="character in getColors"
                :key="character.name"
                class="flex-1"
              >
                <div
                  @click="selectColor(character)"
                  @mouseover="colorFocused = character.hslColor"
                  @mouseout="colorFocused = []"
                  :class="`relative cursor-pointer h-full flex items-center transition duration-300 z-20 ${colorSelected === character.hslColor && 'scale-[150%] rotate-[1.5deg] z-40'}  hover:scale-[140%] hover:z-30 ${expandMovie === character.featuredFilm || expandMovie === '' ? 'opacity-100' : 'opacity-10 pointer-events-none'}`"
                  :style="{
                    backgroundColor: character.isBlack
                      ? 'black'
                      : character.isWhite
                        ? 'white'
                        : character.isGrey
                          ? 'grey'
                          : character.isBrown
                            ? '#895129'
                            : character.isRed
                              ? 'red'
                              : `hsl(${character.hue}, 100%, 50%)`,
                  }"
                >
                  <div
                    class="relative z-10 w-full h-[80%] border-[1px] border-black"
                    :style="{
                      background: `hsl(${character.hslColor[0]}, ${character.hslColor[1]}%, ${character.hslColor[2]}%)`,
                    }"
                  >
                    <div
                      class="absolute inset-[0.1px] md:inset-[1px] border-[0.2px] md:border-[1px] border-white"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="scrolling_div"
          class="flex flex-1 flex-col overflow-y-auto pb-5"
        >
          <div v-for="d in getCharactersByMovie" :key="d.movie">
            <div class="relative">
              <div
                class="flex items-center gap-3 pt-2 md:pt-4 pb-1 sticky top-0 bg-white cursor-pointer px-3 md:px-10 z-20"
                @click="
                  () => {
                    if (expandMovie === d.movie) {
                      expandMovie = '';
                    } else {
                      expandMovie = d.movie;
                    }
                  }
                "
              >
                <Clapperboard :clapperboardIsOpened="expandMovie === d.movie" />
                <div
                  class="flex flex-col md:flex-row items-baseline md:gap-2 hover:text-[#26AAF6]"
                >
                  <span class="typo-b3 md:typo-b2 font-bold">{{
                    d.movie
                  }}</span>
                  <span class="typo-b5"
                    >({{ d.characters.length }} character{{
                      d.characters.length > 1 ? "s" : ""
                    }})</span
                  >
                </div>
              </div>
              <div
                :class="`w-fit h-full px-4 md:px-10 overflow-hidden grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 ${expandMovie === d.movie ? 'max-h-[3000px] transition-all duration-500 pt-2 md:pt-3 pb-6' : 'max-h-[0px] transition-all duration-200'}`"
              >
                <div
                  v-for="char in d.characters"
                  :id="char.name.toLowerCase().replace(' ', '')"
                  :key="char"
                  :class="`flex flex-col justify-between border-[2px] ${characterSelected === char.name ? 'border-black scale-[105%]' : 'border-black/20'} rounded-[10px] pt-2 p-3`"
                >
                  <p
                    :class="`typo-b3 ${characterSelected === char.name && 'font-bold'}`"
                  >
                    {{ char.name }}
                  </p>
                  <div class="flex gap-2">
                    <div
                      class="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-[10px] overflow-hidden"
                    >
                      <img
                        class="w-full h-full object-cover"
                        :src="`/disney-in-colors/images/${char.fileName}`"
                        alt=""
                        referrerpolicy="no-referrer"
                      />
                    </div>
                    <div class="flex flex-col justify-between">
                      <div
                        v-for="palette in char.palettes"
                        :key="palette"
                        class="w-9 h-9 md:w-12 md:h-12 flex-none rounded-[5px]"
                        :style="{
                          background: `hsl(${palette[0]}, ${palette[1]}%, ${palette[2]}%)`,
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
