import { Settings, Save, Undo2, Redo2, Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { useSimulation } from "@/contexts/SimulationContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function formatTime(totalSeconds: number) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hrs > 0
    ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    : `${pad(mins)}:${pad(secs)}`;
}

export function TopToolbar() {
  const { isPlaying, togglePlay, resetTimer, skipForward, elapsedSeconds } = useSimulation();

  return (
    <div className="glass-panel rounded-xl px-4 py-2 flex items-center justify-between animate-slide-up">
      {/* Left: sim info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-success animate-pulse-glow" : "bg-muted-foreground"}`} />
          <span className="text-mono text-xs text-muted-foreground">
            {isPlaying ? "En curso" : "Pausado"}
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5 text-primary">
          <span className="text-mono text-sm font-semibold tracking-wider">
            {formatTime(elapsedSeconds)}
          </span>
        </div>
      </div>

      {/* Center: playback */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={resetTimer} className="instrument-btn w-8 h-8">
              <RotateCcw className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="glass-panel">Reiniciar</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={togglePlay} className={`instrument-btn w-9 h-9 ${isPlaying ? "active" : ""}`}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </TooltipTrigger>
          <TooltipContent className="glass-panel">
            {isPlaying ? "Pausar" : "Iniciar"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={skipForward} className="instrument-btn w-8 h-8">
              <SkipForward className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="glass-panel">+30s</TooltipContent>
        </Tooltip>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="instrument-btn w-8 h-8">
              <Save className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="glass-panel">Guardar</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="instrument-btn w-8 h-8">
              <Settings className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="glass-panel">Ajustes</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
