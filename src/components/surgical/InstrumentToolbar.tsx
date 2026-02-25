import {
  Scissors,
  Pen,
  Move,
  ZoomIn,
  RotateCcw,
  Pipette,
  Grip,
  Slice,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSimulation } from "@/contexts/SimulationContext";

const instruments = [
  { id: "scalpel", icon: Pen, label: "Bisturí", shortcut: "1" },
  { id: "scissors", icon: Scissors, label: "Tijeras", shortcut: "2" },
  { id: "forceps", icon: Grip, label: "Pinzas", shortcut: "3" },
  { id: "retractor", icon: Slice, label: "Retractor", shortcut: "4" },
  { id: "suction", icon: Pipette, label: "Succión", shortcut: "5" },
];

const viewTools = [
  { id: "move", icon: Move, label: "Mover" },
  { id: "zoom", icon: ZoomIn, label: "Zoom" },
  { id: "reset", icon: RotateCcw, label: "Resetear vista" },
];

export function InstrumentToolbar() {
  const { activeInstrument, setActiveInstrument, activeViewTool, setActiveViewTool, resetView } =
    useSimulation();

  const handleViewTool = (id: string) => {
    if (id === "reset") {
      resetView();
    } else {
      setActiveViewTool(id);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-2 flex flex-col gap-1 animate-slide-up">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground text-center mb-1 px-1">
        Instrumentos
      </span>

      {instruments.map((inst) => (
        <Tooltip key={inst.id}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setActiveInstrument(inst.id)}
              className={`instrument-btn w-11 h-11 ${
                activeInstrument === inst.id ? "active" : ""
              }`}
            >
              <inst.icon className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="glass-panel">
            <span>{inst.label}</span>
            <kbd className="ml-2 text-mono text-xs text-muted-foreground">{inst.shortcut}</kbd>
          </TooltipContent>
        </Tooltip>
      ))}

      <div className="h-px bg-border my-2" />

      <span className="text-[10px] uppercase tracking-widest text-muted-foreground text-center mb-1 px-1">
        Vista
      </span>

      {viewTools.map((tool) => (
        <Tooltip key={tool.id}>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleViewTool(tool.id)}
              className={`instrument-btn w-11 h-11 ${
                tool.id !== "reset" && activeViewTool === tool.id ? "active" : ""
              }`}
            >
              <tool.icon className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="glass-panel">
            {tool.label}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
