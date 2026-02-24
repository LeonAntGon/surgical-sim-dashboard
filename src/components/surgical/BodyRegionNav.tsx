import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const regions = [
  { id: "head", label: "Cabeza", icon: "🧠" },
  { id: "thorax", label: "Tórax", icon: "🫁" },
  { id: "abdomen", label: "Abdomen", icon: "🫀" },
  { id: "pelvis", label: "Pelvis", icon: "🦴" },
  { id: "extremities", label: "Extremidades", icon: "🦵" },
];

export function BodyRegionNav() {
  const [active, setActive] = useState("abdomen");

  return (
    <div className="glass-panel rounded-xl px-3 py-2 flex items-center gap-2 animate-slide-up">
      <button className="instrument-btn w-7 h-7 shrink-0">
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1 overflow-x-auto">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => setActive(region.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-200 ${
              active === region.id
                ? "bg-primary/20 text-primary border border-primary/40"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
            }`}
          >
            <span className="text-sm">{region.icon}</span>
            <span>{region.label}</span>
          </button>
        ))}
      </div>

      <button className="instrument-btn w-7 h-7 shrink-0">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
