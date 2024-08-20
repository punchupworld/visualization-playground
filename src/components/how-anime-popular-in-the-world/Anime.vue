<script lang="ts" setup>
import { ref } from "vue";

import JapanChart from "../../components/how-anime-popular-in-the-world/JapanChart.vue";
import GlobalChart from "../../components/how-anime-popular-in-the-world/GlobalChart.vue";

const colorList = [
  {
    original_language: "en",
    fullname: "English",
    color: "#4269d0",
  },
  {
    original_language: "fr",
    fullname: "French",
    color: "#efb118",
  },
  {
    original_language: "es",
    fullname: "Spanish",
    color: "#ff725c",
  },
  {
    original_language: "zh",
    fullname: "Mandarin",
    color: "#6cc5b0",
  },
  {
    original_language: "uk",
    fullname: "Ukrainian",
    color: "#9498a0",
  },
  {
    original_language: "he",
    fullname: "Hebrew",
    color: "#ADD495",
  },
];
</script>

<template>
  <div class="bg-black min-h-screen p-5 relative overflow-x-hidden">
    <div class="logo-holder">
      <h1
        class="font-head font-bold text-center typo-h4 tracking-tighter uppercase mx-auto gradient-border w-fit mt-5 px-3 text-white"
      >
        how anime popular in the world
      </h1>
    </div>
    <p class="typo-b5 text-center text-white mt-5 max-w-2xl mx-auto">
      The visualization displays comparison between anime and other countries
      animation that have a release year between 2000-2024 with more than 500
      votes on the TMDB website.
    </p>

    <p class="sm:hidden typo-b5 text-white mt-5 text-center font-bold">
      Scroll horizontally to explore
      <img src="/horizontal-scroll.png" alt="" class="inline-block w-6" />
    </p>

    <div class="flex z-20 flex-col absolute -left-20 xl:-left-12 top-0 h-full">
      <div class="film" v-for="item in 20" :key="item"></div>
    </div>

    <div
      class="flex z-20 flex-col absolute -right-20 xl:-right-12 top-0 h-full"
    >
      <div class="film" v-for="item in 20" :key="item"></div>
    </div>

    <div class="overflow-auto relative">
      <div
        class="mt-5 relative z-10 w-[1000px] mx-auto border-4 border-white rounded-xl"
      >
        <div class="flex flex-row p-3">
          <div class="w-2/5 rounded-2xl">
            <p class="typo-b6 font-bold text-white">Vote Average</p>
            <JapanChart client:only />
            <div class="flex items-center gap-2 justify-center">
              <h1 class="text-center font-bold typo-h8 sm:ml-12 text-white">
                Japan
              </h1>
              <img src="/japan.png" alt="" class="inline-block w-6" />
            </div>
            <p class="text-center typo-b6 sm:ml-12 text-white">(65 records)</p>
          </div>
          <div class="w-3/5 rounded-2xl mt-5 relative">
            <GlobalChart client:only />
            <div class="flex items-center gap-2 justify-center">
              <h1 class="text-center font-bold typo-h8 sm:ml-12 text-white">
                Other Countries
              </h1>
              <img src="/global.png" alt="" class="inline-block w-6" />
            </div>
            <p class="text-center typo-b6 sm:ml-12 text-white">(395 records)</p>

            <div
              class="z-20 w-[90%] inset-x-0 absolute bottom-[55px] m-auto text-white text-right typo-b5 pointer-events-none"
            >
              <div class="flex flex-wrap gap-2 justify-center">
                <div class="flex gap-2" v-for="(item, i) in colorList" :key="i">
                  <div
                    :style="{ backgroundColor: item.color }"
                    class="w-[10px] h-[10px] mt-1.5 rounded-full flex-1"
                  ></div>
                  <div class="flex-1">{{ item.fullname }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="w-[900px] left-14 xl:left-10 inset-x-0 absolute opacity-50 top-[185px] m-auto text-white text-right typo-b5 pointer-events-none"
      >
        <p>Avg. 7.05</p>
        <div class="h-[1px] border border-white border-dashed"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-border {
  border-bottom: 10px solid hsl(0, 100%, 50%);
  animation: rainbow 7s infinite alternate;
}

@keyframes rainbow {
  0% {
    border-color: hsl(0, 100%, 50%);
  }
  14% {
    border-color: hsl(30, 100%, 50%);
  }
  28% {
    border-color: hsl(60, 100%, 50%);
  }
  42% {
    border-color: hsl(120, 100%, 50%);
  }
  56% {
    border-color: hsl(240, 100%, 50%);
  }
  70% {
    border-color: hsl(280, 100%, 50%);
  }
  84% {
    border-color: hsl(320, 100%, 50%);
  }
  100% {
    border-color: hsl(255, 100%, 50%);
  }
}

.film {
  border: 3px solid #000;
  box-sizing: border-box;
  border-radius: 10px;
  flex: 1;
  width: 100px;
  height: 100px;
  margin: 10% 0;
  background: #fff;

  @media only screen and (max-width: 600px) {
    margin: 10% 0;
  }
}
</style>
