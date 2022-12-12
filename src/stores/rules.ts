import { writable } from 'svelte/store';



export const store = writable(0);

export const update = () => {
    store.update(n => n + 1);
}