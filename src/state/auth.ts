// src/state/auth.ts
import { atom } from "jotai";

export type LoggedInRole = "user" | "admin" | "questioner" | null;

/** main role atom: "user" | "admin" | "questioner" | null */
export const loggedInUserAtom = atom<LoggedInRole>(null);

/** simple derived booleans */
export const isLoggedInAtom = atom((get) => get(loggedInUserAtom) !== null);
export const isUserAtom = atom((get) => get(loggedInUserAtom) === "user");
export const isAdminAtom = atom((get) => get(loggedInUserAtom) === "admin");
export const isQuestionerAtom = atom((get) => get(loggedInUserAtom) === "questioner");

export const authHydratedAtom = atom(false);