<script lang="ts" context="module">
  import directors from "../../../scripts/subtitles/out/directors.json";

  export type Movie = (typeof directors)[number]["movies"][number];
</script>

<script lang="ts">
  import { createAccordion, melt } from "@melt-ui/svelte";
  import { fade, slide } from "svelte/transition";
  import { scaleLinear } from "d3";
  import Chevron from "./chevron.svelte";
  import DirectorMoviesPlot from "./director-movies-plot.svelte";

  const X_AXIS_STEP = 25;

  const maxWordsPerMinute = Math.max(
    ...directors.flatMap(({ movies }) => movies.map((m) => m.wordsPerMinute)),
  );

  const upperBoundX = X_AXIS_STEP * Math.ceil(maxWordsPerMinute / X_AXIS_STEP);
  const xAxes = new Array(upperBoundX / X_AXIS_STEP + 1)
    .fill(null)
    .map((_, i) => i * X_AXIS_STEP);

  const x = scaleLinear([0, upperBoundX], [0, 100]);

  const {
    states: { value },
    elements: { content, item, trigger, root },
    helpers: { isSelected },
  } = createAccordion();
</script>

<div class="relative flex flex-col w-full">
  <div class="flex flex-col gap-2 z-10 mt-14 mb-2" {...$root}>
    {#each directors as { name, nationality, movies } (name)}
      {@const isOpened = $isSelected(name)}
      {@const isOtherOpened = !!$value && !isOpened}
      <div use:melt={$item(name)} class="flex flex-col flex-1">
        <button
          use:melt={$trigger(name)}
          class="flex flex-row border border-neutral-500 rounded-sm transition-opacity {isOtherOpened
            ? 'opacity-30'
            : 'opacity-100'}"
        >
          <div class="flex flex-row items-start text-left w-64 py-3">
            <Chevron {isOpened} />
            <div class="flex-1 flex flex-col">
              <h2 class="font-kondolar font-semibold typo-h8">{name}</h2>
              {#if !isOtherOpened}
                <p transition:slide>{nationality}</p>
              {/if}
            </div>
          </div>
          <div class="h-full flex-1">
            <DirectorMoviesPlot
              {movies}
              {x}
              isTooltipDisabled={isOtherOpened}
            />
          </div>
        </button>
        {#if isOpened}
          <div use:melt={$content(name)} transition:slide>
            {JSON.stringify(movies)}
          </div>
        {/if}
      </div>
    {/each}
  </div>
  {#if !$value}
    <div
      class="absolute inset-0 left-64 flex typo-b6"
      transition:fade={{ duration: 200 }}
    >
      <p class="w-full text-center">Average Words Per Minute (WPM)</p>
      {#each xAxes as axe}
        <div
          class="absolute top-8 bottom-0 w-[1px] bg-neutral-800"
          style="left: {x(axe)}%;"
        >
          <span
            class="text-neutral-600 absolute {axe === upperBoundX
              ? 'right-1'
              : 'left-1'}">{axe}</span
          >
        </div>
      {/each}
    </div>
  {/if}
</div>
