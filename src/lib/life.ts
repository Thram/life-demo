import * as Colors from "./colors";
import * as Canvas from "./canvas";

type Coordinates = { x: number; y: number; index?: number };
type Status = string;
type Info = {
  x: number;
  y: number;
  status: Status;
  race?: number;
  gen?: number;
};
type State = {
  universe: { maxPopulation: number; width: number; height: number };
  info: Array<Info>;
  size: { width: number; height: number };
  born: number;
  alive: number;
  death: number;
};

const initialState = () => ({
  universe: { maxPopulation: 0, width: 0, height: 0 },
  info: [],
  size: { width: 0, height: 0 },
  born: 0,
  alive: 0,
  death: 0,
});

let state: State = initialState();

export const getState = () => state;

const getEntityInfo = (index: number) => state.info[index];

const calcPixelXY = (pixelIndex: number) => ({
  x: pixelIndex % state.universe.width,
  y: Math.floor(pixelIndex / state.universe.width),
});

type CalculateStatus = (index: number) => {
  status: Status;
  race?: number;
  gen?: number;
};
export const renderRules = (
  image: ImageData,
  calculateStatus: CalculateStatus
) => {
  for (let index = 0; index < state.universe.maxPopulation; index++) {
    const { status, race, gen } = calculateStatus(index);
    const isAlive = status === "alive";
    const intensity = calculateIntensity(race, gen);
    const pixelColor = getGenColor({ color: race, intensity, gen });
    setEntityState({ index, status, race, gen });
    Canvas.setImagePixel(image, index, isAlive ? pixelColor : Colors.empty);
  }
  return image;
};

export const gameOver = () => state.alive === 0;

export const addEntity = async ({ x, y, color }) => {
  const index = Canvas.getIndex({ x, y });
  const status = "alive";
  const gen = 0;
  const intensity = calculateIntensity(color, gen);
  const pixelColor = getGenColor({ color, intensity, gen });
  setEntityState({ index, race: color, gen, status });
  Canvas.paint({ index, color: pixelColor });
};

type EntityState = {
  index: number;
  race?: number;
  gen?: number;
  status: Status;
};

export const setEntityState = ({ index, race, gen, status }: EntityState) => {
  const { x, y } = calcPixelXY(index);
  state.info[index] = { x, y, status, race: race, gen };
};

export const die = () => {
  state.death++;
  state.alive--;
};

export const birth = () => {
  state.born++;
  state.alive++;
};

export const calculateIntensity = (race: number, gen: number) => {
  const totalColors = Colors.getTotalColors(Colors.getColorKey(race));
  const nextColor = totalColors - gen - 1;
  const latestColor = 3;
  return nextColor < latestColor ? latestColor : nextColor;
};

type RandomRules = { population?: number; factor?: number; race?: number };
export const generateRandomSeed = (
  image: ImageData,
  options: RandomRules = {}
) => {
  const { population = 100, factor = 0.5, race = 0 } = options;
  console.log(`Creating ${population} entities`);
  state.born = population;
  state.alive = population;
  const firstGeneration = Canvas.getRandomPixels(population, factor);
  for (let person = 0; person < population; person++) {
    const index = firstGeneration[person];
    const status = "alive";
    const gen = 0;
    const intensity = calculateIntensity(race, gen);
    const pixelColor = getGenColor({ color: race, intensity, gen });
    setEntityState({ index, race, gen, status });
    Canvas.setImagePixel(image, index, pixelColor);
  }
  return image;
};

const getPixelXYInfo = ({ x, y }: Coordinates) => {
  const pixelIndex = Canvas.getIndex({ x, y });
  const info = getEntityInfo(pixelIndex);
  return info;
};

const getAliveNeighbours = ({ x, y }: Coordinates) =>
  [
    getPixelXYInfo({ x: x + 1, y }),
    getPixelXYInfo({ x: x - 1, y }),
    getPixelXYInfo({ x, y: y - 1 }),
    getPixelXYInfo({ x: x + 1, y: y - 1 }),
    getPixelXYInfo({ x: x - 1, y: y - 1 }),
    getPixelXYInfo({ x, y: y + 1 }),
    getPixelXYInfo({ x: x + 1, y: y + 1 }),
    getPixelXYInfo({ x: x - 1, y: y + 1 }),
  ].filter(
    (neighbourInfo) => neighbourInfo && neighbourInfo.status === "alive"
  );

const getNewBornRace = (aliveNeighbours = []) => {
  let count: any = {};
  let max;
  for (let index = 0; index < aliveNeighbours.length; index++) {
    const info = aliveNeighbours[index];
    count[info.race] =
      count[info.race] === undefined ? 1 : count[info.race] + 1;
    max =
      max === undefined
        ? info.race
        : count[max] > count[info.race]
        ? max
        : info.race;
  }
  return max;
};
export const getGenColor = ({ color, intensity, gen }) => {
  const pixelColor = Colors.getPixelColorByIndex(color, intensity);
  const lastColorIndex = Colors.getTotalColors(Colors.getColorKey(color)) / 2;
  const opacity = 255 - gen / 255;
  return gen > lastColorIndex
    ? Colors.changeOpacity(pixelColor, opacity > 0 ? opacity : 0.1)
    : pixelColor;
};

export const applyRulesOfLife = (imageData, { generations, neighbours }) => {
  for (let index = 0; index < state.universe.maxPopulation; index++) {
    // debugger
    const { x, y, race, status } = getEntityInfo(index);
    const aliveNeighbours = getAliveNeighbours({ x, y });
    if (
      status !== "alive" &&
      aliveNeighbours.length > neighbours.min &&
      aliveNeighbours.length < neighbours.max
    ) {
      const gen = 0;
      const status = "alive";
      const race = getNewBornRace(aliveNeighbours);
      const intensity = calculateIntensity(race, gen);
      const pixelColor = getGenColor({ color: race, intensity, gen });
      setEntityState({ index, race, gen, status });
      Canvas.setImagePixel(imageData, index, pixelColor);
      birth();
    }

    if (status === "alive") {
      const survivor = getEntityInfo(index);
      if (
        aliveNeighbours.length <= neighbours.min ||
        aliveNeighbours.length >= neighbours.max ||
        survivor.gen >= generations
      ) {
        const status = "dead";
        setEntityState({ index, status });
        Canvas.setImagePixel(imageData, index, Colors.dead);
        die();
      } else {
        const nextGen = survivor.gen + 1;
        const intensity = calculateIntensity(race, nextGen);
        const pixelColor = getGenColor({
          color: race,
          intensity,
          gen: nextGen,
        });
        setEntityState({ index, race, gen: nextGen, status });
        Canvas.setImagePixel(imageData, index, pixelColor);
      }
    }
  }
  return imageData;
};

export const init = (imageData: ImageData) => {
  resetState();
  state.universe.width = imageData.width;
  state.universe.height = imageData.height;
  state.universe.maxPopulation = imageData.width * imageData.height;
  for (let index = 0; index < state.universe.maxPopulation; index++) {
    const status = "void";
    setEntityState({ index, status });
    Canvas.setImagePixel(imageData, index, Colors.empty);
  }
  return imageData;
};

export const resetState = () => {
  state = initialState();
};
