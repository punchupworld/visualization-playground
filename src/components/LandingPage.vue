<template>
  <div class="text-center px-3 py-5 xl:py-16 rainbow min-h-screen">
    <h1 class="typo-h3 font-bold heading text-white pb-5">
      Visualization Playground
    </h1>

    <div
      class="flex gap-5 flex-wrap items-center justify-center max-w-6xl mx-auto"
    >
      <div class="w-full lg:w-2/5">
        <a href="/a-decade-of-genre">
          <div class="rounded-xl mb-5 aspect-video flex items-center">
            <img src="/pui.png" alt="" class="rounded-xl" />
          </div>
          <p class="typo-h8 font-bold uppercase">A DECADE of GENRE DIVERSITY</p>
        </a>
      </div>
      <div class="w-full lg:w-2/5">
        <a href="/how-anime-popular-in-the-world">
          <div class="rounded-xl mb-5 aspect-video">
            <img src="/poppap.png" alt="" class="rounded-xl" />
          </div>
          <p class="typo-h8 font-bold uppercase">
            how anime popular in the world
          </p>
        </a>
      </div>
      <div class="w-full lg:w-2/5">
        <div class="comingsoon rounded-xl text-white typo-h6 font-bold mb-5">
          Coming Soon..
        </div>
        <p class="typo-h8 font-bold uppercase">(P'Bas Work)</p>
      </div>
      <div class="w-full lg:w-2/5">
        <div class="comingsoon rounded-xl text-white typo-h6 font-bold mb-5">
          Coming Soon..
        </div>
        <p class="typo-h8 font-bold uppercase">(Key Work)</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.comingsoon {
  background: linear-gradient(45deg, #21d4fd, #2afebf);
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.comingsoon::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 15px;
  left: 0;
  right: 0;
  background: linear-gradient(45deg, #21d4fd, #2afebf);
  z-index: -1;
  transform: scale3d(0.75, 0.75, 0.75);
  filter: blur(25px);
}

.heading {
  text-shadow:
    #fff 0px 0px 5px,
    #fff 0px 0px 10px,
    #fff 0px 0px 15px,
    #ff2d95 0px 0px 20px,
    #ff2d95 0px 0px 30px,
    #ff2d95 0px 0px 40px,
    #ff2d95 0px 0px 50px,
    #ff2d95 0px 0px 75px;
}

.rainbow {
  background: black;
  color: white;
  /* background: linear-gradient(45deg, #40e0d0, #fbd786, #f7797d); */
}
</style>
