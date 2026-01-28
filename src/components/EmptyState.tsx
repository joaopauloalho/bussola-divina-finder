import { SearchX, Church } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onSuggestClick?: () => void;
}

const EmptyState = ({ onSuggestClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Nenhum evento encontrado
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        Nenhum evento encontrado com estes filtros. Tente ajustar os critérios de busca.
      </p>
      {onSuggestClick && (
        <Button variant="outline" onClick={onSuggestClick} className="gap-2">
          <Church className="h-4 w-4" />
          Não encontrou sua paróquia? Sugira aqui
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
