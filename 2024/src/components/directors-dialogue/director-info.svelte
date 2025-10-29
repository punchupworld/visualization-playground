<script lang="ts">
  import { slide } from "svelte/transition";
  import Chevron from "./chevron.svelte";
  import HintTooltip from "./hint-tooltip.svelte";
  import InfoIcon from "./info-icon.svelte";

  export let name: string;
  export let nationality: string;
  export let moviesCount: number;
  export let isOpened: boolean;
  export let isOtherOpened: boolean;

  $: [firstName, ...lastName] = name.split(" ");
</script>

<div
  class="flex flex-row items-start text-left w-full md:w-72 py-3 pl-1 bg-contain bg-no-repeat bg-right"
  style="background-image: url(/2024/directors-dialogue/directors/{name
    .toLowerCase()
    .replaceAll(' ', '-')}.webp);"
>
  <Chevron {isOpened} />
  <div class="flex-1 flex flex-col items-start place-self-center">
    <h2 class="font-kondolar font-semibold typo-h9 bg-neutral-900">
      {firstName}&nbsp;<br class="hidden md:inline" />{lastName.join(" ")}
    </h2>
    {#if !isOtherOpened}
      <p transition:slide>
        {nationality}
        <span class="mx-1 text-neutral-500">|</span>
        <HintTooltip
          class="inline"
          text="Include only movies with English subtitles, available on opensubtitles.org and marked with trusted sources."
        >
          <span class="typo-b6 text-neutral-300 bg-neutral-900">
            {moviesCount} movies</span
          >
          <InfoIcon />
        </HintTooltip>
      </p>
    {/if}
  </div>
</div>
