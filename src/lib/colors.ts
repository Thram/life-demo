export type Color = { red: number, green: number, blue: number, alpha: number }
export const hex2rgba = (hex: string, alpha = 1) => {
    const [red, green, blue] = hex.match(/\w\w/g)!.map(x => parseInt(x, 16));
    return { red, green, blue, alpha: 255 * alpha };
};

export const alive = { red: 255, green: 255, blue: 255, alpha: 255 }
export const dead = { red: 0, green: 0, blue: 0, alpha: 255 }
export const empty = { red: 0, green: 0, blue: 0, alpha: 0 }

const COLORS_HEX = {
    red: ["#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336", "#E53935", "#D32F2F", "#C62828", "#B71C1C"],
    pink: ["#FCE4EC", "#F8BBD0", "#F48FB1", "#F06292", "#EC407A", "#E91E63", "#D81B60", "#C2185B", "#AD1457", "#880E4F",],
    purple: ["#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#9C27B0", "#8E24AA", "#7B1FA2", "#6A1B9A", "#4A148C"],
    deepPurple: ["#EDE7F6", "#D1C4E9", "#B39DDB", "#9575CD", "#7E57C2", "#673AB7", "#5E35B1", "#512DA8", "#4527A0", "#311B92"],
    indigo: ["#E8EAF6", "#C5CAE9", "#9FA8DA", "#7986CB", "#5C6BC0", "#3F51B5", "#3949AB", "#303F9F", "#283593", "#1A237E"],
    blue: ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1565C0", "#0D47A1"],
    lightBlue: ["#E1F5FE", "#B3E5FC", "#81D4FA", "#4FC3F7", "#29B6F6", "#03A9F4", "#039BE5", "#0288D1", "#0277BD", "#01579B"],
    cyan: ["#E0F7FA", "#B2EBF2", "#80DEEA", "#4DD0E1", "#26C6DA", "#00BCD4", "#00ACC1", "#0097A7", "#00838F", "#006064"],
    teal: ["#E0F2F1", "#B2DFDB", "#80CBC4", "#4DB6AC", "#26A69A", "#009688", "#00897B", "#00796B", "#00695C", "#004D40"],
    green: ["#E8F5E9", "#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#43A047", "#388E3C", "#2E7D32", "#1B5E20"],
    lightGreen: ["#F1F8E9", "#DCEDC8", "#C5E1A5", "#AED581", "#9CCC65", "#8BC34A", "#7CB342", "#689F38", "#558B2F", "#33691E"],
    lime: ["#F9FBE7", "#F0F4C3", "#E6EE9C", "#DCE775", "#D4E157", "#CDDC39", "#C0CA33", "#AFB42B", "#9E9D24", "#827717"],
    yellow: ["#FFFDE7", "#FFF9C4", "#FFF59D", "#FFF176", "#FFEE58", "#FFEB3B", "#FDD835", "#FBC02D", "#F9A825", "#F57F17"],
    amber: ["#FFF8E1", "#FFECB3", "#FFE082", "#FFD54F", "#FFCA28", "#FFC107", "#FFB300", "#FFA000", "#FF8F00", "#FF6F00"],
    orange: ["#FFF3E0", "#FFE0B2", "#FFCC80", "#FFB74D", "#FFA726", "#FF9800", "#FB8C00", "#F57C00", "#EF6C00", "#E65100"],
    deepOrange: ["#FBE9E7", "#FFCCBC", "#FFAB91", "#FF8A65", "#FF7043", "#FF5722", "#F4511E", "#E64A19", "#D84315", "#BF360C"],
    brown: ["#EFEBE9", "#D7CCC8", "#BCAAA4", "#A1887F", "#8D6E63", "#795548", "#6D4C41", "#5D4037", "#4E342E", "#3E2723"],
    grey: ["#FAFAFA", "#F5F5F5", "#EEEEEE", "#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575", "#616161", "#424242", "#212121"],
    blueGrey: ["#ECEFF1", "#CFD8DC", "#B0BEC5", "#90A4AE", "#78909C", "#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"]
}
const colorsKeys = Object.keys(COLORS_HEX);

const COLORS_RGBA = colorsKeys.reduce((res, color) => {
    const shadesHex = COLORS_HEX[color];
    return { ...res, [color]: shadesHex.map(hex => hex2rgba(hex)) }
}, {});

export const getColors = () => colorsKeys;
export const getTotalColors = (key: string) => COLORS_HEX[key].length
export const getColorKey = (index: number) => colorsKeys[index]

export const getPixelColor = (key: string, intensity = 9) => COLORS_RGBA[key][intensity]
export const getPixelColorByIndex = (index: number, intensity = 9) => getPixelColor(getColorKey(index), intensity)
export const changeOpacity = (color: Color, opacity = 1) => ({ ...color, alpha: color.alpha * opacity }) as Color
/**
 * 
 * TODO: RESEARCH THIS ERROR:
 * Uncaught (in promise) TypeError: COLORS_HEX[key] is undefined
    getTotalColors colors.ts:40
    calculateIntensity life.ts:70
    applyRulesOfLife life.ts:153
    update_handler Life.svelte:80
    createEventDispatcher index.mjs:1049
    createEventDispatcher index.mjs:1048
    updateImage Renderer.svelte:36
    id Renderer.svelte:61
    animate Renderer.svelte:57
    instance Renderer.svelte:81
    run index.mjs:18
    mount_component index.mjs:1939
    flush index.mjs:1175
    init index.mjs:2034
    App App.svelte:434
    createProxiedComponent svelte-hooks.js:341
    ProxyComponent proxy.js:242
    Proxy<App> proxy.js:349
    <anonymous> main.ts:4

    export const getHexColor = (key: string, intensity = 9) => COLORS_HEX[key][intensity]
    
    */

export const getHexColor = (key: string, intensity = 9) => COLORS_HEX[key || 0][intensity]
