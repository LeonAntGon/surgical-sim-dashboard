import { InstrumentToolbar } from "@/components/surgical/InstrumentToolbar";
import { TopToolbar } from "@/components/surgical/TopToolbar";
import { BodyRegionNav } from "@/components/surgical/BodyRegionNav";
import { VitalStats } from "@/components/surgical/VitalStats";
import { SurgicalViewport } from "@/components/surgical/SurgicalViewport";
import { SimulationProvider } from "@/contexts/SimulationContext";

const Index = () => {
  return (
    <SimulationProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-background p-2 gap-2">
        <TopToolbar />

        <div className="flex flex-1 gap-2 min-h-0">
          <InstrumentToolbar />

          <div className="flex flex-col flex-1 gap-2 min-h-0">
            <SurgicalViewport />
            <BodyRegionNav />
          </div>

          <div className="flex flex-col gap-2">
            <VitalStats />
          </div>
        </div>
      </div>
    </SimulationProvider>
  );
};

export default Index;
