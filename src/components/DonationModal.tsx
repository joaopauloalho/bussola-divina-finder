import { useState } from "react";
import { QrCode, Copy, Check, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  parishName: string;
  pixKey: string;
}

const DonationModal = ({ isOpen, onClose, parishName, pixKey }: DonationModalProps) => {
  const [copied, setCopied] = useState(false);
  const displayPixKey = pixKey || "00.000.000/0001-99";

  const handleCopyPix = async () => {
    await navigator.clipboard.writeText(displayPixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Heart className="h-5 w-5 text-accent" />
            Doar para {parishName}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Escaneie o QR Code ou copie a chave Pix abaixo
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* QR Code Placeholder */}
          <div className="w-48 h-48 bg-secondary rounded-xl flex items-center justify-center border-2 border-dashed border-border">
            <QrCode className="h-24 w-24 text-muted-foreground" />
          </div>

          {/* Pix Key */}
          <div className="w-full p-3 bg-secondary rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">Chave Pix (CNPJ)</p>
            <p className="font-mono text-foreground font-medium">{displayPixKey}</p>
          </div>

          {/* Copy Button */}
          <Button
            onClick={handleCopyPix}
            className={`w-full ${
              copied
                ? "bg-success hover:bg-success text-success-foreground"
                : "bg-accent hover:bg-accent/90 text-accent-foreground"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Chave Pix
              </>
            )}
          </Button>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground text-center">
            100% do valor vai direto para a conta da paróquia.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
