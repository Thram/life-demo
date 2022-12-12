<script>
  import { createEventDispatcher } from "svelte";
  import * as Colors from "../lib/colors";
  const dispatch = createEventDispatcher();
  export let races = [];
  export let selected;
  const select = (race, index) => {
    selected = index;
    dispatch("select", { race, index });
  };
  const getColor = (index) => Colors.getHexColor(Colors.getColorKey(index));
</script>

<div class="race-picker">
  <h4>Colors</h4>
  <div class="grid">
    {#each races as race, index}
      <div
        class="race {race.toLowerCase().replace(/ /g, '-')} {selected === index
          ? 'active'
          : ''}"
        style="background-color: {getColor(index)};"
        on:click={() => select(race, index)}
        on:keyup={() => select(race, index)}
      >
        {race}
      </div>
    {/each}
  </div>
</div>
