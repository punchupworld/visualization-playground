<script lang="ts">
  import { fade } from "svelte/transition";
  import HintTooltip from "./hint-tooltip.svelte";
  import InfoIcon from "./info-icon.svelte";

  export let xAxisLabel: string;
  export let xAxisHint: string = "";
  export let axes: number[];
  export let scale: (value: number) => number;
  export let upperBound: number;
</script>

<div
  class="absolute inset-0 flex flex-col typo-b7 {$$restProps.class || ''}"
  transition:fade={{ duration: 200 }}
>
  {#if xAxisHint}
    <HintTooltip class="mx-auto" text={xAxisHint}>
      {xAxisLabel}
      <InfoIcon />
    </HintTooltip>
  {:else}
    <span class="mx-auto">{xAxisLabel}</span>
  {/if}

  {#each axes as axe}
    <div
      class="absolute top-8 bottom-0 w-[1px] bg-neutral-800"
      style="left: {scale(axe)}%;"
    >
      <span
        class="text-neutral-600 absolute {axe === upperBound
          ? 'right-1'
          : 'left-1'}">{axe}</span
      >
    </div>
  {/each}
</div>
