<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<div class="zoom">
  <button class="secondary" on:click={() => dispatch("scale:down")}
    ><span>-</span></button
  >
  <button class="warning" on:click={() => dispatch("scale:up")}
    ><span>+</span></button
  >
</div>
