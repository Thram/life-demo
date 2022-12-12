import * as Colors from "./colors";
import type { Color } from "./colors";

let canvas: HTMLCanvasElement;
let indexes: { [k: string]: number } = {};

export const getContext = () => canvas.getContext("2d");
export const getImage = () =>
    getContext().getImageData(0, 0, canvas.width, canvas.height);

export const loadImage = (imageData?: ImageData) =>
    getContext().putImageData(imageData ? imageData : getImage(), 0, 0);
;

type CanvasSize = { width: number, height: number }
export const setSize = ({ width, height }: CanvasSize) => {
    canvas.width = width;
    canvas.height = height;
};

const getOffset = (pixelIndex: number) => pixelIndex === 0 ? 0 : pixelIndex * 4;

export const calcPixelXY = (pixelIndex: number) => ({
    x: pixelIndex % canvas.width,
    y: Math.floor(pixelIndex / canvas.width),
})

export const setImagePixel = (image: ImageData, pixelIndex: number, { red, green, blue, alpha }: Color) => {
    const pixels = image.data
    const offset = getOffset(pixelIndex);
    pixels[offset + 0] = red;
    pixels[offset + 1] = green;
    pixels[offset + 2] = blue;
    pixels[offset + 3] = alpha;
}

export const requestFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
export const render = async (image?: ImageData) => {
    await requestFrame();
    loadImage(image);
}

export const loadCanvas = (c: HTMLCanvasElement) => {
    canvas = c;
    const totalPixels = canvas.width * canvas.height;
    for (let index = 0; index < totalPixels; index++) {
        const { x, y } = calcPixelXY(index);
        indexes[`${x}|${y}`] = index
    }
}

export const getIndex = ({ x, y }) => indexes[`${x}|${y}`]

export const getRandomPixels = (size = 10, factor = .5) => Object
    .values(indexes)
    .sort(() => Math.random() > factor ? 1 : 0)
    .slice(0, size);


export const paint = async ({ index, color }) => {
    const image = getImage();
    setImagePixel(image, index, color);
    await render(image);
};

export const reset = async ({ width, height }) => {
    const imageData = getImage();
    for (let index = 0; index < width * height; index++) {
        setImagePixel(imageData, index, Colors.empty);
    }
    await render(imageData);
};