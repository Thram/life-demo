<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let label;
  export let placeholder;
  export let value;
  export let type = "text";
</script>

<span class="input">
  <input
    class="balloon"
    id={label}
    {type}
    {value}
    on:change={(ev) => dispatch("change", ev.currentTarget.value)}
    {placeholder}
  /><label for={label}>{label}</label>
</span>
