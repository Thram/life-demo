<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let label = "Button";
  let color = "red";
</script>

<button on:click={() => dispatch("click")}>{label}</button>
