import { Heart, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const SubscriptionFooter = () => {
  const handleSupport = () => {
    // For now, open a dummy checkout - in production this would be Stripe
    window.open("https://buy.stripe.com/test_example", "_blank");
  };

  return (
    <div className="bg-gradient-to-r from-accent/20 via-accent/30 to-accent/20 border-t-2 border-accent/50">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Message */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="hidden md:flex items-center justify-center w-12 h-12 bg-accent/30 rounded-full">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
                <Star className="h-4 w-4 text-accent" />
                Ajude a manter a Bússola Católica no ar
              </h3>
              <p className="text-sm text-muted-foreground">
                Seja um <span className="font-semibold text-accent">Guardião</span> por apenas{" "}
                <span className="font-bold text-foreground">R$ 9,90/mês</span> e apoie nossa missão.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleSupport}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Heart className="h-5 w-5 mr-2" />
            Apoiar Agora
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-4 pt-4 border-t border-accent/20 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            ✓ Pagamento seguro via Stripe
          </span>
          <span className="flex items-center gap-1">
            ✓ Cancele quando quiser
          </span>
          <span className="flex items-center gap-1">
            ✓ 100% revertido para a plataforma
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFooter;
