<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let isPlaying = false;
</script>

<div class="row actions" style="flex: .1 ">
  <button
    class="cell success"
    on:click={() => {
      dispatch("play", { isPlaying });
      isPlaying = !isPlaying;
    }}
    >{isPlaying ? "Pause" : "Play"}
  </button>
</div>
