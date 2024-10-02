<script lang="ts">
  import { fade } from "svelte/transition";

  export let xAxisLabel: string;
  export let axes: number[];
  export let scale: (value: number) => number;
  export let upperBound: number;
</script>

<div
  class="absolute inset-0 flex typo-b7 {$$restProps.class || ''}"
  transition:fade={{ duration: 200 }}
>
  <p class="w-full text-center">{xAxisLabel}</p>
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
