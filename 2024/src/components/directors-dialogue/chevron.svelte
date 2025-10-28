<script lang="ts">
  export let isOpened: boolean;
</script>

<svg
  class="size-7 fill-current transition-transform {isOpened
    ? 'rotate-90'
    : '-rotate-90'}"
  viewBox="0 0 24 24"
  ><path d="M14 17.308L8.692 12L14 6.692l.708.708l-4.6 4.6l4.6 4.6z" /></svg
>
