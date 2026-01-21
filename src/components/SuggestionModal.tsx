import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquarePlus, Send } from "lucide-react";
import { useSubmitSuggestion } from "@/hooks/useEvents";

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  parishId: string;
  parishName: string;
}

const SuggestionModal = ({
  isOpen,
  onClose,
  parishId,
  parishName,
}: SuggestionModalProps) => {
  const [suggestionType, setSuggestionType] = useState<string>("");
  const [suggestedValue, setSuggestedValue] = useState("");
  const submitSuggestion = useSubmitSuggestion();

  const handleSubmit = () => {
    if (!suggestionType || !suggestedValue) return;

    submitSuggestion.mutate(
      {
        parishId,
        suggestionType: suggestionType as "address_correction" | "phone_correction" | "other",
        suggestedValue,
      },
      {
        onSuccess: () => {
          setSuggestionType("");
          setSuggestedValue("");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <MessageSquarePlus className="h-5 w-5 text-primary" />
            Sugerir Correção
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ajude a manter as informações de {parishName} atualizadas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="suggestion-type" className="text-foreground">
              O que deseja corrigir?
            </Label>
            <Select value={suggestionType} onValueChange={setSuggestionType}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="address_correction">Endereço</SelectItem>
                <SelectItem value="phone_correction">Telefone</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suggested-value" className="text-foreground">
              {suggestionType === "phone_correction"
                ? "Qual o telefone correto?"
                : suggestionType === "address_correction"
                ? "Qual o endereço correto?"
                : "Descreva a correção"}
            </Label>
            {suggestionType === "other" ? (
              <Textarea
                id="suggested-value"
                value={suggestedValue}
                onChange={(e) => setSuggestedValue(e.target.value)}
                placeholder="Descreva a correção que gostaria de sugerir..."
                className="bg-secondary border-border text-foreground min-h-[100px]"
              />
            ) : (
              <Input
                id="suggested-value"
                type={suggestionType === "phone_correction" ? "tel" : "text"}
                value={suggestedValue}
                onChange={(e) => setSuggestedValue(e.target.value)}
                placeholder={
                  suggestionType === "phone_correction"
                    ? "(43) 3XXX-XXXX"
                    : "Rua, número, bairro..."
                }
                className="bg-secondary border-border text-foreground"
              />
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!suggestionType || !suggestedValue || submitSuggestion.isPending}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="h-4 w-4 mr-2" />
            {submitSuggestion.isPending ? "Enviando..." : "Enviar Sugestão"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionModal;
