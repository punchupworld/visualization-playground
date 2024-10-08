<script lang="ts">
  import { createTooltip, melt } from "@melt-ui/svelte";
  import { fade } from "svelte/transition";
  import TooltipContainer from "./tooltip-container.svelte";

  export let text: string;

  const {
    elements: { trigger, content, arrow },
    states: { open },
  } = createTooltip({
    positioning: {
      placement: "top",
    },
    openDelay: 0,
    closeDelay: 0,
    closeOnPointerDown: false,
    forceVisible: true,
  });
</script>

<div class={$$restProps.class} use:melt={$trigger} role="tooltip">
  <slot />
</div>

{#if $open}
  <div use:melt={$content} class="bg-neutral-500 z-50">
    <div use:melt={$arrow} transition:fade={{ duration: 100 }} />
    <TooltipContainer class="min-w-48">{text}</TooltipContainer>
  </div>
{/if}
