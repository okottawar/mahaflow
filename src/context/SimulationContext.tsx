"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { SimulationState, createInitialState, simulateTick } from "@/lib/engine/simulationEngine";
import { Language, translations, TranslationStrings } from "@/lib/data/translations";

interface SimulationContextType {
  state: SimulationState;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
  isPaused: boolean;
  togglePause: () => void;
  isReady: boolean;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  // Start with deterministic initial state (no randomness) for SSR consistency
  const [state, setState] = useState<SimulationState>(() => createInitialState());
  const [language, setLanguage] = useState<Language>("en");
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const pausedRef = useRef(false);

  const togglePause = useCallback(() => {
    setIsPaused((p) => {
      pausedRef.current = !p;
      return !p;
    });
  }, []);

  // Run initial simulation ticks on client mount only (avoids hydration mismatch)
  useEffect(() => {
    let s = state;
    for (let i = 0; i < 3; i++) s = simulateTick(s);
    setState(s);
    setIsReady(true);

    const interval = setInterval(() => {
      if (!pausedRef.current) {
        setState((prev) => simulateTick(prev));
      }
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = translations[language];

  return (
    <SimulationContext.Provider value={{ state, language, setLanguage, t, isPaused, togglePause, isReady }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used within SimulationProvider");
  return ctx;
}
