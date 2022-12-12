<script>
  // check https://macr.ae/article/canvas-to-gif
  import Actions from "./components/Actions.svelte";
  import Input from "./components/Input.svelte";
  import Life from "./components/Life.svelte";
  import RacePicker from "./components/RacePicker.svelte";
  import Rules from "./components/Rules.svelte";
  import Zoom from "./components/Zoom.svelte";
  import * as Colors from "./lib/colors";
  let life;
  let isPlaying;
  let isEditing = true;
  let scale = 5;
  let fps = 10;
  // let maxGenerations = 5;
  // let maxGenerations = Colors.getTotalColors(Colors.getColorKey(0));
  let maxGenerations = 30;
  let neighboursMin = 1;
  let neighboursMax = 6;
  let width = 100;
  let height = 100;
  const races = Colors.getColors().map((v) =>
    v.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
  );
  let selectedRace = 0;
  console.log({ maxGenerations });
</script>

<main class="cell">
  <div class="row" style="height: 60px;">
    <h1 style="flex: 1; text-align: center;">Life Demo</h1>
    <Zoom on:scale:up={() => scale++} on:scale:down={() => scale--} />
  </div>
  <div class="row" style="flex: 3">
    <div class="cell">
      <div class="row" style="flex: 10;">
        <section class="card" style="width: 400px;">
          <div class="row">
            <h2 style="flex: 1">Rules of Life</h2>
            <div style="width: 100px">
              <Input
                type="number"
                label="FPS"
                placeholder="frames/sec"
                value={fps}
                on:change={({ detail: v }) => {
                  life.changeFPS(v);
                  fps = v;
                }}
              />
            </div>
          </div>
          <div class="row">
            <RacePicker
              {races}
              selected={selectedRace}
              on:select={({ detail: v }) => (selectedRace = v.index)}
            />
          </div>
          <Rules
            {maxGenerations}
            {neighboursMin}
            {neighboursMax}
            on:change:maxGenerations={({ detail: g }) => (maxGenerations = g)}
            on:change:neighboursMin={({ detail: min }) => (neighboursMin = min)}
            on:change:neighboursMax={({ detail: max }) => (neighboursMax = max)}
          />
          <Actions {isPlaying} on:play={() => life.togglePlay()} />
        </section>
      </div>
    </div>
    <div class="cell" style="flex: 4; overflow-y: auto; height: 100%; ">
      <Life
        bind:this={life}
        {isPlaying}
        {isEditing}
        {scale}
        {width}
        {height}
        {maxGenerations}
        {fps}
        {neighboursMin}
        {neighboursMax}
        {selectedRace}
      />
    </div>
  </div>
  <div class="row">
    Made by
    <a href="https://github.com/Thram" target="_blank" rel="noreferrer">
      Thram
    </a>
  </div>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: flex;
  }
</style>
