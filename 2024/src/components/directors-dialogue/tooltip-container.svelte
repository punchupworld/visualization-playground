<script lang="ts">
  import { fade } from "svelte/transition";

  export let style = "";
</script>

<div
  class="absolute z-50 rounded p-2 pb-1 border border-neutral-500 typo-b7 bg-neutral-900 text-neutral-50 shadow -translate-x-1/2 -translate-y-full {$$restProps.class}"
  {style}
  transition:fade={{ duration: 100 }}
>
  <slot />
</div>
