import { Settings, Save, Undo2, Redo2, Play, Pause, SkipForward } from "lucide-react";
import { useState } from "react";

export function TopToolbar() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="glass-panel rounded-xl px-4 py-2 flex items-center justify-between animate-slide-up">
      {/* Left: sim info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
          <span className="text-mono text-xs text-muted-foreground">v1.1.0</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-mono">mm</span>
          <span className="text-foreground font-medium text-mono">0</span>
        </div>
      </div>

      {/* Center: playback */}
      <div className="flex items-center gap-1">
        <button className="instrument-btn w-8 h-8">
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="instrument-btn w-9 h-9 active"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button className="instrument-btn w-8 h-8">
          <Redo2 className="w-4 h-4" />
        </button>
        <button className="instrument-btn w-8 h-8">
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button className="instrument-btn w-8 h-8">
          <Save className="w-4 h-4" />
        </button>
        <button className="instrument-btn w-8 h-8">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
