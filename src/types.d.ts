export type Coordinates = { x: number, y: number, index?: number }
export enum EntityStatus { alive, dead, void }
export type EntityInfo = { x: number, y: number, status: Status, race?: number, gen?: number }
export type Size = { width: number, height: number }
export type Universe = { maxPopulation: number, width: number, height: number }
export type LifeState = {
    universe: Universe,
    info: Array<Info>,
    size: Size
    born: number,
    alive: number,
    death: number,
}