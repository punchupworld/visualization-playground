<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<script lang="ts" setup>
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
    original_language: "he",
    fullname: "Hebrew",
    color: "#ADD495",
  },
  {
    original_language: "zh",
    fullname: "Mandarin",
    color: "#6cc5b0",
  },
  {
    original_language: "es",
    fullname: "Spanish",
    color: "#9467bd",
  },
  {
    original_language: "uk",
    fullname: "Ukrainian",
    color: "#17becf",
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
      <img src="/2024/horizontal-scroll.png" alt="" class="inline-block w-6" />
    </p>

    <div class="flex z-20 flex-col absolute -left-20 xl:-left-12 top-0 h-full">
      <div class="film" v-for="item in 20" :key="item"></div>
    </div>

    <div
      class="flex z-20 flex-col absolute -right-20 xl:-right-12 top-0 h-full"
    >
      <div class="film" v-for="item in 20" :key="item"></div>
    </div>

    <div class="overflow-x-auto relative overflow-y-hidden">
      <div
        class="mt-5 relative z-20 w-[1000px] mx-auto border-4 border-white rounded-xl"
      >
        <div class="flex flex-row p-3">
          <div class="w-2/5 rounded-2xl relative">
            <p class="typo-b6 font-bold text-white">User Score</p>
            <JapanChart client:only class="relative z-[11]" />

            <div class="flex items-center gap-2 justify-center">
              <h1 class="text-center font-bold typo-h8 sm:ml-12 text-white">
                Japan
              </h1>
              <img src="/2024/japan.png" alt="" class="inline-block w-6" />
            </div>

            <p class="text-center typo-b6 sm:ml-12 text-white">
              (65 Animations)
            </p>

            <div
              class="left-14 xl:left-10 inset-x-0 absolute top-[130px] m-auto text-white text-right typo-b5 pointer-events-none"
            >
              <p>7.5935</p>
              <div class="h-[1px] border border-white border-dashed"></div>
            </div>
          </div>
          <div class="w-3/5 rounded-2xl mt-5 relative">
            <GlobalChart client:only class="relative z-[11]" />

            <div class="flex items-center gap-2 justify-center">
              <h1 class="text-center font-bold typo-h8 sm:ml-12 text-white">
                Other Countries
              </h1>
              <img src="/2024/global.png" alt="" class="inline-block w-6" />
            </div>

            <p class="text-center typo-b6 sm:ml-12 text-white">
              (395 Animations)
            </p>

            <div
              class="left-14 xl:left-10 inset-x-0 absolute top-[125px] m-auto text-white text-right typo-b5 pointer-events-none"
            >
              <p>7.007</p>
              <div class="h-[1px] border border-white border-dashed"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute top-7 inset-x-0 h-[600px] z-10 pointer-events-none">
        <div
          v-for="(item, i) in 11"
          :key="i"
          class="h-[1px] border border-white w-[920px] mx-auto my-[45px] opacity-10"
        ></div>
      </div>
    </div>

    <div class="text-white max-w-4xl mx-auto my-4 px-3">
      <p class="typo-b4 font-bold">How to read</p>
      <div class="flex gap-5 flex-col lg:flex-row">
        <div class="text-white text-right typo-b5">
          <div class="flex flex-wrap gap-2">
            <div class="flex gap-2" v-for="(item, i) in colorList" :key="i">
              <div
                :style="{ backgroundColor: item.color }"
                class="w-[10px] h-[10px] mt-1.5 rounded-full flex-1"
              ></div>
              <div class="flex-1">{{ item.fullname }}</div>
            </div>
          </div>
        </div>
        <div class="flex gap-5 items-center lg:border-l lg:pl-5">
          <div class="h-[1px] border border-white border-dashed w-40"></div>
          <p class="typo-b5">Median line</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-border {
  border-bottom: 10px solid hsl(0, 100%, 50%);
  animation: rainbow 5s infinite alternate;
}

@keyframes rainbow {
  0% {
    border-color: hsl(224, 60%, 54%);
  }
  20% {
    border-color: hsl(43, 87%, 52%);
  }
  40% {
    border-color: hsl(97, 42%, 71%);
  }
  60% {
    border-color: hsl(166, 43%, 60%);
  }
  080% {
    border-color: hsl(271, 39%, 57%);
  }
  100% {
    border-color: hsl(186, 80%, 45%);
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
