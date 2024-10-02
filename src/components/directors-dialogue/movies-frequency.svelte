<script lang="ts">
  import LegendItem from "./legend-item.svelte";
  import type { Movie } from "./model";

  export let movies: Movie[];
  export let x: (value: number) => number;
  export let y: (value: number) => number;

  const barWidth = x(1);
</script>

<div class="flex flex-col gap-3">
  {#each movies as { name, year, wordsPerMinute, image, wordFrequency }}
    <div class="flex flex-row">
      <div class="w-72 flex flex-row gap-2">
        <img
          src={image}
          width="64"
          height="95"
          class="object-cover w-[64px] h-[95px]"
          alt=""
        />
        <div class="space-y-2">
          <h3><span class="font-bold">{name}</span> ({year})</h3>
          <p class="typo-b7">~{Math.round(wordsPerMinute)} WPM</p>
        </div>
      </div>
      <div class="flex-1 relative">
        {#each wordFrequency as { minute, positive, neutral, negative }}
          <div
            class="absolute inset-y-0 flex flex-col justify-center"
            style="width: calc({barWidth}% - 1px); left: {x(minute)}%;"
          >
            <div class="bg-green-500" style="height: {y(positive)}%;" />
            <div class="bg-neutral-300" style="height: {y(neutral)}%;" />
            <div class="bg-red-500" style="height: {y(negative)}%;" />
          </div>
        {/each}
      </div>
    </div>
  {/each}

  <div class="flex flex-row flex-wrap gap-4 typo-b7 justify-center ml-72">
    <LegendItem class="bg-green-500">Positive</LegendItem>
    <LegendItem class="bg-neutral-300">Neutral</LegendItem>
    <LegendItem class="bg-red-500">Negative</LegendItem>
  </div>
</div>
