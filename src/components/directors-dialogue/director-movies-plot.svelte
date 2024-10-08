<script lang="ts">
  import { fade } from "svelte/transition";
  import type { Movie } from "./model";

  export let movies: Movie[];
  export let averageWordsPerMinute: number;
  export let x: (value: number) => number;
  export let isOtherOpened: boolean;

  let focusedMovie: Movie | null = null;
</script>

<div
  class="md:flex-1 w-full md:h-full relative overflow-hidden transition-all duration-200 {isOtherOpened
    ? 'pointer-events-none h-0'
    : 'h-16'}"
>
  <div
    class="absolute inset-y-1 border-l text-blue-500 border-blue-600 border-dashed p-1 typo-b7"
    style="left: {x(averageWordsPerMinute)}%"
  >
    Average {averageWordsPerMinute}
  </div>
  {#each movies as movie (movie.id)}
    <div
      role="tooltip"
      class="size-3 bg-neutral-100 absolute rounded-full -translate-y-1/2 -translate-x-1/2 top-1/2 border border-neutral-400"
      style="left: {x(movie.wordsPerMinute)}%"
      on:mouseover={() => (focusedMovie = movie)}
      on:focus={() => (focusedMovie = movie)}
      on:mouseleave={() =>
        focusedMovie?.id === movie.id && (focusedMovie = null)}
    >
      {#if focusedMovie?.id === movie.id}
        <div
          class="typo-b7 absolute left-1/2 bottom-3 whitespace-nowrap -translate-x-1/2"
          transition:fade={{ duration: 100 }}
        >
          {movie.name} ({movie.year})
        </div>
      {/if}
    </div>
  {/each}
</div>
