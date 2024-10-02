<script lang="ts">
  import { createAccordion, melt } from "@melt-ui/svelte";
  import { slide } from "svelte/transition";
  import { scaleLinear } from "d3";
  import Chevron from "./chevron.svelte";
  import DirectorMoviesPlot from "./director-movies-plot.svelte";
  import type { Director } from "./model";
  import MoviesFrequency from "./movies-frequency.svelte";
  import ChartBackground from "./chart-background.svelte";

  const WPM_AXIS_STEP = 25;
  const MINUTE_AXIS_STEP = 30;

  export let directors: Director[];
  export let maxWordsPerMinute: number;
  export let maxMinutes: number;
  export let maxFrequency: number;

  const wordsPerMinuteAxis = getAxisInformation(
    maxWordsPerMinute,
    WPM_AXIS_STEP,
  );
  const minutesAxis = getAxisInformation(maxMinutes, MINUTE_AXIS_STEP);
  const frequencyAxis = getAxisInformation(maxFrequency, maxFrequency);

  function getAxisInformation(maxValue: number, axisStep: number) {
    const upperBound = axisStep * Math.ceil(maxValue / axisStep);
    const axes = new Array(upperBound / axisStep + 1)
      .fill(null)
      .map((_, i) => i * axisStep);
    const scale = scaleLinear([0, upperBound], [0, 100]);

    return { upperBound, axes, scale };
  }

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
          class="flex flex-row border border-neutral-500 rounded transition-opacity {isOtherOpened
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
          <DirectorMoviesPlot
            {movies}
            x={wordsPerMinuteAxis.scale}
            isTooltipDisabled={isOtherOpened}
          />
        </button>
        {#if isOpened}
          <div
            use:melt={$content(name)}
            transition:slide
            class="m-6 pt-16 relative"
          >
            <MoviesFrequency
              {movies}
              x={minutesAxis.scale}
              y={frequencyAxis.scale}
            />
            <ChartBackground
              class="left-72"
              xAxisLabel="Minutes"
              {...minutesAxis}
            />
          </div>
        {/if}
      </div>
    {/each}
  </div>
  {#if !$value}
    <ChartBackground
      class="left-64"
      xAxisLabel="Average Words Per Minute (WPM)"
      {...wordsPerMinuteAxis}
    />
  {/if}
</div>
