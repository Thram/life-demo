import { writable } from 'svelte/store';
import type { LifeState } from '../types';

const initialState = () => ({
    universe: { maxPopulation: 0, width: 0, height: 0 },
    info: [],
    size: { width: 0, height: 0 },
    born: 0,
    alive: 0,
    death: 0
}) as LifeState

export const store = writable(initialState());
export const update = (data: Partial<LifeState>) => store.update(s => ({ ...s, ...data }))
export const set = (data: LifeState) => store.set(data)
export const reset = () => store.set(initialState())
