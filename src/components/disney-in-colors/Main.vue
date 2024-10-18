<script setup>
import * as d3 from "d3";
import { prominent } from "color.js";
import { onMounted, ref } from "vue";
import StackedBarChart from "./StackedBarChart.vue";
import InfoDetailPopup from "./InfoDetailPopup.vue";

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
      d.imageLink = d.wikiImageLink.trim();
      d.name = d.name.trim();
      d.featuredFilm = d.featuredFilm.replaceAll('"', "").trim();
      d.palettes = await getPalettes(
        d.wikiImageLink.replace("/revision/latest", ""),
      );
      return d;
    }),
  );
};

const seperateColors = (data) => {
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
        tone:
          colorTone === "black"
            ? 1
            : colorTone === "grey"
              ? 2
              : colorTone === "white"
                ? 4
                : 3,
        isBlack: colorTone === "black" ? true : false,
        isGrey: colorTone === "grey" ? true : false,
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
  } else if (sat === 0 && light >= 20 && light <= 90) {
    colorTone = "grey";
  } else if (sat <= 50 && light >= 90) {
    colorTone = "white";
  }
  return colorTone;
};

const getPalettes = async (image) => {
  const colors = await prominent(image, { amount: 3 });
  return colors.map((color) => {
    const [r, g, b] = color;
    return rgbToHsl(r, g, b);
  });
};

const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
    : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
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
    class="py-5 min-h-screen"
    style="
      background-color: white;
      opacity: 1;
      background-image: linear-gradient(
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
      <div class="flex flex-col items-center">
        <h1 class="typo-h2 font-bold text-center mb-3">Disney in Colors</h1>
        <div
          class="bg-white/80 flex justify-center px-5 py-3 rounded-[10px] w-[520px]"
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
      <div class="bg-white m-10">
        <div
          class="sticky top-0 flex gap-3 items-baseline bg-white z-20 shadow-xl"
        >
          <div class="flex-1 flex justify-end pt-1">
            <p class="typo-b1 font-bold">Villain</p>
          </div>
          <div class="w-[40px] typo-b5 text-center opacity-50"><p>year</p></div>
          <div class="flex-1"><p class="typo-b1 font-bold">Hero</p></div>
          <div
            class="absolute top-1/2 right-5 -translate-y-1/2 flex justify-end gap-3 py-5"
          >
            <div
              @click="viewSimplifiedColor = true"
              :class="`bg-black text-white py-1 px-3 rounded-full cursor-pointer ${!viewSimplifiedColor && 'opacity-50'}`"
            >
              <p class="typo-b5">Simplified Color</p>
            </div>
            <div
              @click="viewSimplifiedColor = false"
              :class="`bg-black text-white py-1 px-3 rounded-full cursor-pointer ${viewSimplifiedColor && 'opacity-50'}`"
            >
              <p class="typo-b5">Precise Color</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-1 p-5">
          <div
            v-for="year in allYears"
            :key="year"
            :class="`flex gap-3 items-center cursor-pointer ${isNoCharacters(year) && 'pointer-events-none'} transition duration-300 ${yearFocused === year || yearFocused === 0 ? 'opacity-100' : 'opacity-30'}`"
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
              :class="`transition duration-500 ${yearFocused === year && 'scale-y-150'} ${yearFocused !== year && yearFocused !== 0 && 'scale-y-75'}`"
            />
            <div
              class="relative w-[40px] flex-none flex text-center"
              @click="
                () => {
                  selectYear(year);
                  selectCategory('hero');
                }
              "
            >
              <div
                :class="`absolute inset-[-5px] rounded-full transition duration-300 ${yearFocused === year ? 'opacity-100 bg-black' : 'opacity-0 bg-white'}`"
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
              :class="`transition duration-500 ${yearFocused === year && 'scale-y-150'} ${yearFocused !== year && yearFocused !== 0 && 'scale-y-75'}`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
