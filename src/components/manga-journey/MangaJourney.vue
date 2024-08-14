<script lang="ts" setup>
import JapanChart from "../../components/manga-journey/JapanChart.vue";
import GlobalChart from "../../components/manga-journey/GlobalChart.vue";
</script>

<template>
  <div class="bg-black min-h-screen p-5 relative overflow-x-hidden">
    <div class="logo-holder">
      <h1
        class="font-head font-bold text-center typo-h4 tracking-tighter uppercase mx-auto gradient-border w-fit mt-5 px-3 text-white"
      >
        TMDB Anime Popularity
      </h1>
    </div>

    <div class="flex flex-col absolute -left-20 md:-left-12 top-0 h-full">
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
    </div>

    <div class="flex flex-col absolute -right-20 md:-right-12 top-0 h-full">
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
      <div class="film"></div>
    </div>

    <div
      class="mt-10 relative z-10 max-w-2xl lg:max-w-6xl mx-auto border-4 border-white rounded-xl"
    >
      <div class="flex flex-col lg:flex-row gap-5 p-3">
        <div class="w-full rounded-2xl">
          <p class="typo-b6 font-bold text-white">Vote Count</p>
          <JapanChart />
          <div class="flex items-center gap-2 justify-center">
            <h1 class="text-center font-bold typo-h8 ml-12 text-white">
              Japan
            </h1>
            <img src="../../assets/japan.png" alt="" class="inline-block w-6" />
          </div>
        </div>
        <div class="w-full rounded-2xl ml">
          <p class="typo-b6 font-bold text-white">Vote Count</p>
          <GlobalChart />
          <div class="flex items-center gap-2 justify-center">
            <h1 class="text-center font-bold typo-h8 ml-12 text-white">
              Global
            </h1>
            <img
              src="../../assets/global.png"
              alt=""
              class="inline-block w-6"
            />
          </div>
        </div>
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
