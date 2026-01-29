import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the map to avoid SSR issues and React 18 strict mode conflicts
const ParishMapContent = lazy(() => import("./ParishMapContent"));

const ParishMap = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg bg-muted flex items-center justify-center">
          <div className="text-center">
            <Skeleton className="h-8 w-32 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Carregando mapa...</p>
          </div>
        </div>
      }
    >
      <ParishMapContent />
    </Suspense>
  );
};

export default ParishMap;
