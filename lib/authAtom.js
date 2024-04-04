import { atom } from 'jotai'

const tokenInitialValue = localStorage.getItem('userToken') || null;

export const tokenAtom = atom(tokenInitialValue);

export const tokenWithPersistenceAtom = atom(
  (get) => get(tokenAtom),
  (get, set, update) => {
    set(tokenAtom, update);
    localStorage.setItem('userToken', update);
  },
);

