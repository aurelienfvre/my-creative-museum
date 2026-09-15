"use client";
import { create } from "zustand";

// État d’interface uniquement : aucune donnée de visiteur stockée côté serveur.
export const useMuseumStore = create((set) => ({
  isFirstRender: true,
  isTransitionActive: false,
  setIsFirstRender: (value) => set({ isFirstRender: value }),
  setIsTransitionActive: (value) => set({ isTransitionActive: value }),
}));
