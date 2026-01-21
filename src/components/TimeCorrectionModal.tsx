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
import { Clock, Send } from "lucide-react";
import { useSubmitSuggestion } from "@/hooks/useEvents";

interface TimeCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  currentTime: string;
  parishName: string;
}

const TimeCorrectionModal = ({
  isOpen,
  onClose,
  eventId,
  currentTime,
  parishName,
}: TimeCorrectionModalProps) => {
  const [suggestedTime, setSuggestedTime] = useState("");
  const submitSuggestion = useSubmitSuggestion();

  const handleSubmit = () => {
    if (!suggestedTime) return;

    submitSuggestion.mutate(
      {
        eventId,
        suggestionType: "time_correction",
        suggestedValue: suggestedTime,
      },
      {
        onSuccess: () => {
          setSuggestedTime("");
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
            <Clock className="h-5 w-5 text-primary" />
            Corrigir Horário
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Informe o horário correto para o evento em {parishName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Horário atual exibido
            </Label>
            <div className="p-3 bg-secondary rounded-lg">
              <span className="text-lg font-bold text-foreground">{currentTime}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suggested-time" className="text-foreground">
              Qual o horário correto?
            </Label>
            <Input
              id="suggested-time"
              type="time"
              value={suggestedTime}
              onChange={(e) => setSuggestedTime(e.target.value)}
              className="bg-secondary border-border text-foreground"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!suggestedTime || submitSuggestion.isPending}
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

export default TimeCorrectionModal;
