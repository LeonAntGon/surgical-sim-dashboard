import { Activity, Heart, Thermometer, Timer } from "lucide-react";

const stats = [
  { icon: Heart, label: "FC", value: "72", unit: "bpm", color: "text-destructive" },
  { icon: Activity, label: "SpO₂", value: "98", unit: "%", color: "text-success" },
  { icon: Thermometer, label: "Temp", value: "36.5", unit: "°C", color: "text-warning" },
  { icon: Timer, label: "Tiempo", value: "04:32", unit: "min", color: "text-primary" },
];

export function VitalStats() {
  return (
    <div className="glass-panel rounded-xl p-3 flex flex-col gap-3 w-40 animate-slide-up">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
        Signos vitales
      </span>

      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2">
          <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
          <div className="flex-1">
            <span className="text-[10px] text-muted-foreground">{stat.label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-mono text-sm font-semibold text-foreground">{stat.value}</span>
              <span className="text-[10px] text-muted-foreground">{stat.unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
