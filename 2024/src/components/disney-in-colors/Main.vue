<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";
import StackedBarChart from "./StackedBarChart.vue";
import InfoDetailPopup from "./InfoDetailPopup.vue";
import Mickey from "./Mickey.vue";

const allYears = ref([]);
const startYear = 1937;
const endYear = 2024;
const yearFocused = ref(0);
const yearSelected = ref(0);
const categorySelected = ref("");
const colorsByYear = ref({});
const viewSimplifiedColor = ref(true);

onMounted(async () => {
  const charactersRawData = await d3.csv(
    "/disney-in-colors/disney_characters.csv",
  );

  const groupByYear = d3.groups(
    await formatData(charactersRawData),
    (d) => d.year,
  );

  groupByYear.forEach((g) => {
    const year = g[0];
    const heroData = g[1].filter((d) => d.role.toLowerCase() !== "villain");
    const villainData = g[1].filter((d) => d.role.toLowerCase() === "villain");

    if (heroData.length > 0) {
      colorsByYear.value[`hero_${year}`] = seperateColors(heroData);
    }
    if (villainData.length > 0) {
      colorsByYear.value[`villain_${year}`] = seperateColors(villainData);
    }
  });

  for (let year = startYear; year <= endYear; year++) {
    allYears.value.push(year);
  }
  allYears.value.sort(function (a, b) {
    return b - a;
  });
});

const formatData = async (data) => {
  return await Promise.all(
    data.map(async (d) => {
      const colorsArray = d.palettes
        .replace("[", "")
        .replace("]", "")
        .split("),");

      d.year = d.filmReleasedYear;
      d.name = d.name.trim();
      d.featuredFilm = d.featuredFilm.replaceAll('"', "").trim();
      d.palettes = colorsArray
        .map((c) => {
          const [hue, sat, light] = c.replaceAll("'", "").split(",");
          const h = hue.replace("(", "");
          const s = sat.replace("(", "");
          const l = light.replace("(", "").replace(")", "");
          return [+h, +s, +l];
        })
        .slice(0, 3);

      return d;
    }),
  );
};

const seperateColors = (data) => {
  const colorOrder = [
    "black",
    "grey",
    "brown",
    "red",
    "others",
    // "red",
    // "orange",
    // "yellow",
    // "green",
    // "cyan",
    // "blue",
    // "purple",
    // "magenta",
    "white",
  ];
  const result = [];
  data.forEach((d) => {
    d.palettes.forEach((palette) => {
      const [hue, sat, light] = palette;
      const h = Math.round(hue);
      const s = Math.round(sat);
      const l = Math.round(light);
      const colorTone = checkColorTone(h, s, l);
      result.push({
        ...d,
        toneName: colorTone,
        tone: colorOrder.indexOf(colorTone),
        isBlack: colorTone === "black" ? true : false,
        isGrey: colorTone === "grey" ? true : false,
        isBrown: colorTone === "brown" ? true : false,
        isRed: colorTone === "red" ? true : false,
        isWhite: colorTone === "white" ? true : false,
        hslColor: [h, s, l],
        hue: h,
      });
    });
  });
  return result.sort(function (a, b) {
    return (
      a.tone - b.tone ||
      a.hslColor[0] - b.hslColor[0] ||
      a.hslColor[2] - b.hslColor[2] ||
      b.hslColor[1] - a.hslColor[1]
    );
  });
};

const checkColorTone = (hue, sat, light) => {
  let colorTone = "";
  if ((sat > 50 && light <= 10) || (sat <= 50 && light <= 20)) {
    colorTone = "black";
  } else if (sat <= 10 && light >= 20 && light <= 90) {
    colorTone = "grey";
  } else if (sat <= 50 && light >= 90) {
    colorTone = "white";
  } else if (
    ((hue >= 0 && hue <= 32) || (hue >= 340 && hue <= 360)) &&
    sat >= 10 &&
    sat <= 70 &&
    light >= 10 &&
    light <= 50
  ) {
    colorTone = "brown";
  } else if (hue >= 335 && hue <= 360) {
    colorTone = "red";
  } else {
    colorTone = "others";
  }
  // else if (hue >= 0 && hue <= 15) {
  //   colorTone = "red";
  // } else if (hue > 15 && hue <= 45) {
  //   colorTone = "orange";
  // } else if (hue > 45 && hue <= 55) {
  //   colorTone = "yellow";
  // } else if (hue > 55 && hue <= 150) {
  //   colorTone = "green";
  // } else if (hue > 150 && hue <= 195) {
  //   colorTone = "cyan";
  // } else if (hue > 195 && hue <= 240) {
  //   colorTone = "blue";
  // } else if (hue > 240 && hue <= 285) {
  //   colorTone = "purple";
  // } else if (hue > 285 && hue <= 360) {
  //   colorTone = "magenta";
  // }

  return colorTone;
};

const isNoCharacters = (year) => {
  return (
    colorsByYear.value[`villain_${year}`] === undefined &&
    colorsByYear.value[`hero_${year}`] === undefined
  );
};

const hoverYear = (year) => {
  yearFocused.value = year;
};
const unHoverYear = () => {
  yearFocused.value = 0;
};
const selectYear = (year) => {
  yearSelected.value = year;
};
const selectCategory = (category) => {
  categorySelected.value = category;
};

const closePopup = () => {
  yearSelected.value = 0;
};
</script>

<template>
  <div
    class="relative pt-8 md:pt-12 pb-6 min-h-screen"
    style="
      background-attachment: fixed;
      background-color: white;
      opacity: 1;
      background-image:
        linear-gradient(
          #26aaf6 1.2000000000000002px,
          transparent 1.2000000000000002px
        ),
        linear-gradient(
          90deg,
          #26aaf6 1.2000000000000002px,
          transparent 1.2000000000000002px
        ),
        linear-gradient(
          #26aaf6 0.6000000000000001px,
          transparent 0.6000000000000001px
        ),
        linear-gradient(
          90deg,
          #26aaf6 0.6000000000000001px,
          transparent 0.6000000000000001px
        );
      background-size:
        30px 30px,
        30px 30px,
        6px 6px,
        6px 6px;
      background-position:
        -1.2000000000000002px -1.2000000000000002px,
        -1.2000000000000002px -1.2000000000000002px,
        -0.6000000000000001px -0.6000000000000001px,
        -0.6000000000000001px -0.6000000000000001px;
    "
  >
    <InfoDetailPopup
      :year="yearSelected"
      :categorySelected="categorySelected"
      :closePopup="closePopup"
      :heros="
        colorsByYear[`hero_${yearSelected}`]
          ? colorsByYear[`hero_${yearSelected}`]
          : []
      "
      :villains="
        colorsByYear[`villain_${yearSelected}`]
          ? colorsByYear[`villain_${yearSelected}`]
          : []
      "
      v-if="yearSelected !== 0"
    />
    <div :class="`transition duration-100 ${yearSelected !== 0 && 'blur-lg'}`">
      <div class="fixed inset-0">
        <!-- <Mickey class="top-[3%] left-1/2 -translate-x-1/2" /> -->

        <Mickey class="rotate-12 top-[5%] left-[5%]" />
        <Mickey class="-rotate-12 top-[5%] right-[5%]" />

        <Mickey class="-rotate-12 top-[12.5%] left-[24%]" />
        <Mickey class="rotate-12 top-[12.5%] right-[24%]" />

        <Mickey class="rotate-3 top-[28%] left-[12%]" />
        <Mickey class="-rotate-3 top-[28%] right-[12%]" />

        <Mickey class="-rotate-6 top-[38%] left-[32%]" />
        <Mickey class="rotate-6 top-[38%] right-[32%]" />

        <Mickey class="-rotate-3 top-[60%] left-[5%]" />
        <Mickey class="rotate-3 top-[60%] right-[5%]" />

        <Mickey class="rotate-6 -bottom-[6%] left-[2%]" />
        <Mickey class="-rotate-6 -bottom-[6%] right-[2%]" />

        <Mickey class="-rotate-6 -bottom-[9%] left-[30%]" />
        <Mickey class="rotate-6 -bottom-[9%] right-[30%]" />
      </div>
      <div class="relative flex flex-col items-center">
        <div
          class="bg-[#26aaf6] border-[2px] border-black rounded-full py-[6px] md:py-2 px-7 md:px-10 mb-5 md:mb-7"
        >
          <h1
            class="typo-h4 font-bold text-center text-black leading-none"
            style="
              text-shadow:
                1px 1px 0 #fff,
                -1px 1px 0 #fff,
                1px -1px 0 #fff,
                -1px -1px 0 #fff,
                0px 1px 0 #fff,
                0px -1px 0 #fff,
                -1px 0px 0 #fff,
                1px 0px 0 #fff,
                2px 2px 0 #fff,
                -2px 2px 0 #fff,
                2px -2px 0 #fff,
                -2px -2px 0 #fff,
                0px 2px 0 #fff,
                0px -2px 0 #fff,
                -2px 0px 0 #fff,
                2px 0px 0 #fff,
                1px 2px 0 #fff,
                -1px 2px 0 #fff,
                1px -2px 0 #fff,
                -1px -2px 0 #fff,
                2px 1px 0 #fff,
                -2px 1px 0 #fff,
                2px -1px 0 #fff,
                -2px -1px 0 #fff;
            "
          >
            Disney in Colors
          </h1>
        </div>
        <div
          class="bg-white border-[2px] border-black flex justify-center px-4 py-3 md:px-5 md:py-4 rounded-[10px] w-[85%] md:w-[580px]"
        >
          <p class="typo-b5 text-center">
            This project compiles visual data of Disney characters from 1937 to
            2024 to analyze and compare the color schemes of hero and villain
            characters. It aims to observe color trends and diversity over the
            years, revealing which colors are associated with good and evil from
            the perspective of Disney's creative storytellers.
          </p>
        </div>
      </div>
      <div
        class="relative bg-white mt-9 md:mt-16 mb-4 md:mb-5 md:my-10 w-[94%] max-w-[1600px] mx-auto border-[2px] border-black rounded-xl"
      >
        <div
          class="sticky top-0 bg-white w-full rounded-t-xl z-20 shadow-lg shadow-[#26aaf6]/50 border-b-[2px] border-black"
        >
          <div
            class="md:absolute md:top-1/2 md:right-5 md:-translate-y-1/2 flex justify-end gap-1 md:gap-3 pt-1 md:py-5 px-1 md:px-0"
          >
            <div
              @click="viewSimplifiedColor = true"
              :class="`border-[2px] py-1 px-2 md:px-3 rounded-full cursor-pointer ${!viewSimplifiedColor ? 'bg-[#26aaf6]/50 border-black/0 text-black/50' : 'bg-[#26aaf6] border-black text-black'}`"
            >
              <p class="typo-b6 md:typo-b5 font-bold">Simplified Color</p>
            </div>
            <div
              @click="viewSimplifiedColor = false"
              :class="`border-[2px] py-1 px-2 md:px-3 rounded-full cursor-pointer ${viewSimplifiedColor ? 'bg-[#26aaf6]/50 border-black/0 text-black/50' : 'bg-[#26aaf6] border-black text-black'}`"
            >
              <p class="typo-b6 md:typo-b5 font-bold">Original Color</p>
            </div>
          </div>
          <div class="flex gap-3 items-baseline">
            <div class="flex-1 flex justify-end pt-1">
              <p class="typo-b1 font-bold">Villain</p>
            </div>
            <div class="w-[40px] typo-b5 text-center opacity-50">
              <p>year</p>
            </div>
            <div class="flex-1"><p class="typo-b1 font-bold">Hero</p></div>
          </div>
        </div>
        <div class="flex flex-col gap-1 p-3 md:p-5">
          <div
            v-for="year in allYears"
            :key="year"
            :class="`flex gap-1 md:gap-3 items-center cursor-pointer ${isNoCharacters(year) && 'pointer-events-none'} transition duration-300 ${yearFocused === year || yearFocused === 0 ? 'opacity-100' : 'opacity-30'}`"
            @mouseover="hoverYear(year)"
            @mouseout="unHoverYear()"
          >
            <StackedBarChart
              @click="
                () => {
                  selectYear(year);
                  selectCategory('villain');
                }
              "
              :isVillain="true"
              :data="
                colorsByYear[`villain_${year}`]
                  ? colorsByYear[`villain_${year}`]
                  : []
              "
              :viewSimplifiedColor="viewSimplifiedColor"
              :class="`${!colorsByYear[`villain_${year}`] && 'pointer-events-none'} transition duration-500 ${yearFocused === year && 'scale-y-[1.6]'} ${yearFocused !== year && yearFocused !== 0 && 'scale-y-75'}`"
            />
            <div
              class="relative w-[35px] md:w-[40px] flex-none flex text-center"
              @click="
                () => {
                  selectYear(year);
                  selectCategory('hero');
                }
              "
            >
              <div
                :class="`absolute inset-[-2px] md:inset-[-5px] rounded-full transition duration-300 ${yearFocused === year ? 'opacity-100 bg-black' : 'opacity-0 bg-white'}`"
              ></div>
              <p
                :class="`z-10 w-full ${colorsByYear[`villain_${year}`] || colorsByYear[`hero_${year}`] ? 'typo-b6' : 'text-[8px] opacity-20'} transition duration-300 ${yearFocused === year ? 'text-white' : 'text-black'} `"
              >
                {{ year }}
              </p>
            </div>
            <StackedBarChart
              @click="
                () => {
                  selectYear(year);
                  selectCategory('hero');
                }
              "
              :data="
                colorsByYear[`hero_${year}`] ? colorsByYear[`hero_${year}`] : []
              "
              :viewSimplifiedColor="viewSimplifiedColor"
              :class="`transition duration-500 ${yearFocused === year && 'scale-y-[1.6]'} ${yearFocused !== year && yearFocused !== 0 && 'scale-y-75'}`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
