<script setup>
defineProps({
  languages: Array,
  activeLang: String,
  selectLang: Function,
});

const scrollTopTop = () => {
  window.scrollTo(0, 0);
};
</script>

<template>
  <div class="fixed w-full top-0 p-1 md:p-2 flex justify-between z-40">
    <div
      @click="scrollTopTop()"
      class="cursor-pointer border-[1px] border-black shadow-xl"
    >
      <img class="w-[25px] md:w-[40px]" src="/landing/pu_logo.png" alt="" />
    </div>

    <div class="flex gap-1 md:gap-2">
      <button
        v-for="lang in languages"
        :key="lang"
        :class="`${activeLang === lang ? 'bg-[#FFFC71] font-bold' : 'bg-white'} w-9 h-7 md:w-12 md:h-9 rounded-[20px] border-[1px] border-black cursor-pointer`"
        @click="selectLang(lang)"
      >
        <p class="typo-b5 md:typo-b4 translate-y-[1px]">{{ lang }}</p>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
