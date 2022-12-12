<script>
  import { createEventDispatcher } from "svelte";
  import Input from "./Input.svelte";

  const dispatch = createEventDispatcher();
  export let maxGenerations;
  export let neighboursMin = 2;
  export let neighboursMax = 3;
</script>

<div class="rules">
  <h4>Generations</h4>
  <div class="row">
    <Input
      type="number"
      label="Max Generations"
      placeholder=""
      value={maxGenerations}
      on:change={({ detail: value }) =>
        dispatch("change:maxGenerations", value)}
    />
  </div>
  <h4>Neighbours Rules</h4>
  <div class="row">
    <Input
      type="number"
      label="Min Neighbours"
      placeholder="Min"
      value={neighboursMin}
      on:change={({ detail: value }) => dispatch("change:neighboursMin", value)}
    />
    <Input
      type="number"
      label="Max Neighbours"
      placeholder="Max"
      value={neighboursMax}
      on:change={({ detail: value }) => dispatch("change:neighboursMax", value)}
    />
  </div>
</div>
