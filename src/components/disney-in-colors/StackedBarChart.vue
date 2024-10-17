<script setup>
defineProps({
  data: Array,
  isVillain: Boolean,
  viewSimplifiedColor: Boolean,
});
</script>

<template>
  <div
    :class="`h-4 w-full flex items-center ${isVillain && 'flex-row-reverse'}`"
  >
    <div class="w-full h-full flex items-center">
      <div
        :class="`flex ${isVillain && 'flex-row-reverse'} w-full border-[0.5px] ${data.length > 0 ? 'h-full border-solid border-black' : 'h-[1px] border-dashed border-black/20'}`"
      >
        <div
          v-for="(d, index) in data"
          :key="index"
          class="flex-1 h-full"
          :style="{
            backgroundColor: !viewSimplifiedColor
              ? `hsl(${d.hslColor[0]}, ${d.hslColor[1]}%, ${d.hslColor[2]}%)`
              : d.isBlack
                ? 'black'
                : d.isWhite
                  ? 'white'
                  : d.isGrey
                    ? 'grey'
                    : `hsl(${d.hue}, 100%, 50%)`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
