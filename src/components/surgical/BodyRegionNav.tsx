import { Link, useLocation } from "react-router-dom";
import kidneyImg from "@/assets/organ-kidney.png";
import liverImg from "@/assets/organ-liver.png";

const simulations = [
  { id: "kidney", label: "Riñón", image: kidneyImg, path: "/simulation/kidney" },
  { id: "liver", label: "Hígado", image: liverImg, path: "/simulation/liver" },
];

export function BodyRegionNav() {
  const location = useLocation();

  return (
    <div className="glass-panel rounded-xl px-3 py-2 flex items-center gap-3 animate-slide-up">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold shrink-0">
        Simulaciones
      </span>

      <div className="flex items-center gap-2 overflow-x-auto">
        {simulations.map((sim) => {
          const isActive = location.pathname === sim.path;
          return (
            <Link
              key={sim.id}
              to={sim.path}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
              }`}
            >
              <img
                src={sim.image}
                alt={sim.label}
                className="w-7 h-7 rounded-md object-cover"
                draggable={false}
              />
              <span className="font-medium">{sim.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
