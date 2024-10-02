<script lang="ts">
  import { fade } from "svelte/transition";

  export let minute: number;
  export let positive: number;
  export let neutral: number;
  export let negative: number;
  export let style = "";
</script>

<div
  class="absolute rounded pt-1 px-2 border border-neutral-500 typo-b7 bg-neutral-900 shadow -translate-x-1/2 -translate-y-full -top-1"
  {style}
  transition:fade={{ duration: 100 }}
>
  <span class="font-bold">{minute}'</span>
  <table>
    <tr>
      <td>Positive</td>
      <td>{positive}</td>
    </tr>
    <tr>
      <td>Neutral</td>
      <td>{neutral}</td>
    </tr>
    <tr>
      <td>Negative</td>
      <td>{negative}</td>
    </tr>
    <tr class="font-bold">
      <td>Total</td>
      <td>{positive + neutral + negative}</td>
    </tr>
  </table>
</div>

<style lang="postcss">
  table > tr > :nth-child(2) {
    @apply text-right pl-1;
  }
</style>
