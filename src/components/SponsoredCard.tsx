import { ExternalLink, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SponsoredCard = () => {
  return (
    <article className="bg-sponsored rounded-xl overflow-hidden card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1 border border-accent/20">
      <div className="p-4">
        {/* Sponsored Badge */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-xs bg-card/50 border-accent/30 text-muted-foreground">
            Patrocinado
          </Badge>
        </div>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-14 h-14 bg-accent/20 rounded-lg shrink-0">
            <BookOpen className="h-7 w-7 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Livraria Católica
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Bíblias e livros religiosos em promoção especial. Frete grátis para Londrina.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          variant="outline" 
          className="w-full mt-3 border-accent/50 text-accent-foreground hover:bg-accent/20"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Conhecer Ofertas
        </Button>
      </div>
    </article>
  );
};

export default SponsoredCard;
