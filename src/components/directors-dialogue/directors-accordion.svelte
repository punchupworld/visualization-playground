<script lang="ts">
  import { createAccordion, melt } from "@melt-ui/svelte";
  import { slide } from "svelte/transition";
  import directors from "../../../scripts/subtitles/out/directors.json";
  import Chevron from "./chevron.svelte";

  const {
    elements: { content, item, trigger, root },
    helpers: { isSelected },
  } = createAccordion();
</script>

<div class="flex w-full flex-col gap-2" {...$root}>
  {#each directors as { name, nationality, movies } (name)}
    {@const isOpened = $isSelected(name)}
    <div use:melt={$item(name)} class="flex flex-col flex-1">
      <button
        use:melt={$trigger(name)}
        class="flex flex-row flex-1 border border-neutral-100 rounded-sm"
      >
        <div class="py-3 pl-1">
          <Chevron {isOpened} />
        </div>
        <div class="flex flex-col items-start text-left w-full max-w-64 py-3">
          <h2 class="font-kondolar font-semibold typo-h8">{name}</h2>
          <p>{nationality}</p>
        </div>
        <div class="h-full flex-1">
          <div>TODO: scatter plot</div>
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
