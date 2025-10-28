<script setup>
defineProps({
  clapperboardIsOpened: Boolean,
});
</script>

<template>
  <div class="relative -translate-y-[6px] scale-75 md:scale-100">
    <div
      class="absolute z-10 -translate-x-1 translate-y-[2.25px] bg-[#26AAF6] border-[2px] border-black w-3 h-3 rounded-full"
    />
    <div
      :class="`relative overflow-hidden bg-black border-[2px] border-black w-10 h-2 rounded-sm flex items-center justify-center translate-y-[1px] transition duration-300 origin-bottom-left ${clapperboardIsOpened ? '-rotate-[15deg]' : 'rotate-0'} `"
    >
      <div class="flex absolute inset-[-5px]">
        <div
          v-for="i in 9"
          :key="i"
          :class="`flex-1 -rotate-45 ${i % 2 == 0 ? 'bg-black' : 'bg-white'}`"
        />
      </div>
    </div>
    <div
      class="relative rounded-b-[5px] bg-white border-[2px] border-black w-10 h-[30px] rounded-sm flex justify-center items-center overflow-hidden"
    >
      <div
        class="absolute top-0 left-0 bg-black border-b-[2px] border-black w-10 h-[6px] flex overflow-hidden"
      >
        <div class="flex absolute inset-[-5px]">
          <div
            v-for="i in 9"
            :key="i"
            :class="`flex-1 rotate-45 ${i % 2 == 0 ? 'bg-black' : 'bg-white'}`"
          />
        </div>
      </div>
      <div
        :class="`translate-y-[3px] translate-x-[1px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[10px] border-black transition duration-300 ${clapperboardIsOpened ? 'rotate-[90deg]' : 'rotate-0'}`"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
