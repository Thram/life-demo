<script>
  import { onMount, createEventDispatcher } from "svelte";

  import * as Colors from "../lib/colors";
  import * as Canvas from "../lib/canvas";

  let canvas = null;
  let editing = false;
  let cancelAnimation = null;
  const dispatch = createEventDispatcher();
  export let width = 100;
  export let height = 100;
  export let scale = 1;
  export let play = false;
  export let edit = false;
  export let fps = 10;
  export let selectedColor = 0;

  export const getSize = () => ({ width, height });
  export const scaleUp = () => (scale = scale + 1);
  export const scaleDown = () => (scale = scale > 1 ? scale - 1 : 1);
  export const reset = async () => {
    Canvas.setSize({ width, height });
    Canvas.loadCanvas(canvas);
    const imageData = Canvas.getImage();
    for (let index = 0; index < width * height; index++) {
      Canvas.setImagePixel(imageData, index, Colors.empty);
    }
    await Canvas.render(imageData);
  };

  const animate = (fps) => {
    const id = setInterval(async () => {
      if (!canvas) return;
      if (play && !editing) dispatch("tick", Canvas.getImage());
    }, 1000 / fps);
    cancelAnimation = () => {
      clearInterval(id);
      cancelAnimation = null;
    };
  };

  export const changeFPS = (fps) => {
    cancelAnimation();
    animate(fps);
  };

  const paint = async ({ x, y }) => {
    const index = Canvas.getIndex({ x, y });
    const color = Colors.getColorKey(selectedColor);
    const pixelColor = Colors.getPixelColor(color, 9);
    await Canvas.paint({ index, color: pixelColor });
    dispatch("paint", { x, y, index, color: selectedColor });
  };

  onMount(async () => {
    canvas.width = width;
    canvas.height = height;
    Canvas.loadCanvas(canvas);
    dispatch("init");
    animate(fps);
    await Canvas.render();
    return () => cancelAnimation();
  });

  const onMouseDown = (ev) => {
    editing = true;
    paint({ x: ev.layerX, y: ev.layerY });
  };
  const onMouseUp = () => {
    editing = false;
  };
  const onMouseMove = async (ev) => {
    if (editing) paint({ x: ev.layerX, y: ev.layerY });
  };
</script>

<div class="renderer">
  <div
    class="universe"
    style="width: {width}px; height: {height}px; transform: scale({scale});"
  >
    <canvas
      class="life"
      bind:this={canvas}
      on:mousedown={edit && onMouseDown}
      on:mousemove={edit && onMouseMove}
      on:mouseup={edit && onMouseUp}
    />
  </div>
</div>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
