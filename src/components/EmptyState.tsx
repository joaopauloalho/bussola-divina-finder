import { SearchX } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Nenhum evento encontrado
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Nenhum evento encontrado com estes filtros. Tente ajustar os critérios de busca.
      </p>
    </div>
  );
};

export default EmptyState;
