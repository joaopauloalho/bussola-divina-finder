import { useState } from "react";
import { z } from "zod";
import { Church, Users, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSubmitNewSuggestion } from "@/hooks/useNewSuggestion";

const newSuggestionSchema = z.object({
  type: z.enum(["new_parish", "new_pastoral"]),
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  address: z.string().trim().max(200, "Endereço muito longo").optional(),
  phone: z.string().trim().max(20, "Telefone muito longo").optional(),
  notes: z.string().trim().max(500, "Observações muito longas").optional(),
}).refine(
  data => data.type !== "new_parish" || (data.address && data.address.length > 0),
  { message: "Endereço é obrigatório para paróquias", path: ["address"] }
);

type FormData = z.infer<typeof newSuggestionSchema>;

interface NewSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewSuggestionModal = ({ isOpen, onClose }: NewSuggestionModalProps) => {
  const [type, setType] = useState<"new_parish" | "new_pastoral">("new_parish");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitMutation = useSubmitNewSuggestion();

  const resetForm = () => {
    setType("new_parish");
    setName("");
    setAddress("");
    setPhone("");
    setNotes("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData: FormData = {
      type,
      name,
      address: address || undefined,
      phone: phone || undefined,
      notes: notes || undefined,
    };

    const result = newSuggestionSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const validatedData = {
      type: result.data.type,
      name: result.data.name,
      address: result.data.address,
      phone: result.data.phone,
      notes: result.data.notes,
    };

    submitMutation.mutate(validatedData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "new_parish" ? (
              <Church className="h-5 w-5 text-primary" />
            ) : (
              <Users className="h-5 w-5 text-primary" />
            )}
            Sugerir Nova {type === "new_parish" ? "Paróquia" : "Pastoral"}
          </DialogTitle>
          <DialogDescription>
            Não encontrou sua paróquia ou pastoral? Sugira para adicionarmos ao sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label>O que deseja sugerir?</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as "new_parish" | "new_pastoral")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new_parish" id="new_parish" />
                <Label htmlFor="new_parish" className="flex items-center gap-1 cursor-pointer">
                  <Church className="h-4 w-4" />
                  Paróquia
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new_pastoral" id="new_pastoral" />
                <Label htmlFor="new_pastoral" className="flex items-center gap-1 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Pastoral
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome {type === "new_parish" ? "da Paróquia" : "da Pastoral"} *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "new_parish" ? "Ex: Paróquia São João Batista" : "Ex: Pastoral da Juventude"}
              maxLength={100}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">
              Endereço {type === "new_parish" ? "*" : "(opcional)"}
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Rua das Flores, 123 - Centro"
              maxLength={200}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone (opcional)</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: (43) 3XXX-XXXX"
              maxLength={20}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informações adicionais que possam ajudar..."
              maxLength={500}
              rows={3}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              {submitMutation.isPending ? "Enviando..." : "Enviar Sugestão"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewSuggestionModal;
