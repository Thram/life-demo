<script>
  import { onMount, createEventDispatcher } from "svelte";
  import Renderer from "./Renderer.svelte";
  import * as Life from "../lib/life";
  import * as Canvas from "../lib/canvas";

  let renderer;
  const dispatch = createEventDispatcher();

  export let scale;
  export let width;
  export let height;
  export let fps;
  export let isPlaying = false;
  export let isEditing = false;
  export let selectedRace = 0;
  export let maxGenerations;
  export let neighboursMin = 2;
  export let neighboursMax = 3;
  export const scaleUp = () => renderer.scaleUp();
  export const scaleDown = () => renderer.scaleDown();
  export const reset = () =>
    new Promise(async (resolve) => {
      renderer.reset();
      Life.init(Canvas.getImage());
      await Canvas.render();
      resolve();
    });
  export const play = () => (isPlaying = true);
  export const pause = () => (isPlaying = false);
  export const edit = () => (isEditing = true);
  export const save = async () => {
    isEditing = false;
    await Canvas.render();
  };
  export const togglePlay = () => {
    isPlaying = !isPlaying;
  };
  export const toggleEdit = () => (isEditing ? save() : edit());
  export const changeFPS = (fps) => renderer.changeFPS(fps);

  const updateUniverse = async (image) => {
    const rules = {
      generations: maxGenerations,
      neighbours: { min: neighboursMin, max: neighboursMax },
    };
    const updatedImage = Life.applyRulesOfLife(image, rules);
    if (Life.gameOver()) dispatch("gameover");
    await Canvas.render(updatedImage);
  };

  const createEntity = async ({ index, color }) => {
    const status = "alive";
    const gen = 0;
    Life.setEntityState({ index, race: color, gen, status });
  };

  onMount(() => Life.init(Canvas.getImage()));
</script>

<Renderer
  bind:this={renderer}
  play={isPlaying}
  edit={isEditing}
  {width}
  {height}
  {scale}
  {fps}
  selectedColor={selectedRace}
  on:paint={({ detail }) => createEntity(detail)}
  on:tick={({ detail }) => updateUniverse(detail)}
/>
