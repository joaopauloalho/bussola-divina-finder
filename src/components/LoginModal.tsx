import { useState } from "react";
import { Cross, LogIn } from "lucide-react";
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

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For prototype purposes, just close the modal
    console.log("Login attempt:", { email, password });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Cross className="h-5 w-5 text-primary-foreground" />
            </div>
            Login da Paróquia
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Acesse o painel administrativo da sua paróquia
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              E-mail da Secretaria
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="secretaria@paroquia.org.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-0 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary border-0 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Entrar no Painel
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Ainda não tem acesso?{" "}
            <a href="#" className="text-primary hover:underline">
              Cadastre sua paróquia
            </a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
