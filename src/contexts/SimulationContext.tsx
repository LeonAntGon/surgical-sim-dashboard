import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";

interface SimulationState {
  // Timer
  elapsedSeconds: number;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  resetTimer: () => void;
  skipForward: () => void;

  // View tools
  activeViewTool: string;
  setActiveViewTool: (tool: string) => void;
  resetView: () => void;
  viewResetCounter: number;

  // Instruments
  activeInstrument: string;
  setActiveInstrument: (id: string) => void;
}

const SimulationContext = createContext<SimulationState | null>(null);

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be inside SimulationProvider");
  return ctx;
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeViewTool, setActiveViewTool] = useState("move");
  const [activeInstrument, setActiveInstrument] = useState("scalpel");
  const [viewResetCounter, setViewResetCounter] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);
  const resetTimer = useCallback(() => {
    setIsPlaying(false);
    setElapsedSeconds(0);
  }, []);
  const skipForward = useCallback(() => setElapsedSeconds((s) => s + 30), []);
  const resetView = useCallback(() => setViewResetCounter((c) => c + 1), []);

  return (
    <SimulationContext.Provider
      value={{
        elapsedSeconds,
        isPlaying,
        play,
        pause,
        togglePlay,
        resetTimer,
        skipForward,
        activeViewTool,
        setActiveViewTool,
        resetView,
        viewResetCounter,
        activeInstrument,
        setActiveInstrument,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}
