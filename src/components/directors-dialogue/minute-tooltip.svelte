<script lang="ts">
  import TooltipContainer from "./tooltip-container.svelte";

  export let minute: number;
  export let positive: number;
  export let neutral: number;
  export let negative: number;
  export let style = "";
</script>

<TooltipContainer class="-top-1" {style}>
  <span class="font-bold">{minute}'</span>
  <table>
    <tr class="text-green-400">
      <td>Positive</td>
      <td>{positive}</td>
    </tr>
    <tr class="text-neutral-200">
      <td>Neutral</td>
      <td>{neutral}</td>
    </tr>
    <tr class="text-red-400">
      <td>Negative</td>
      <td>{negative}</td>
    </tr>
    <tr class="font-bold">
      <td>Total</td>
      <td>{positive + neutral + negative}</td>
    </tr>
  </table>
</TooltipContainer>

<style lang="postcss">
  table > tr > :nth-child(2) {
    @apply text-right pl-1;
  }
</style>
