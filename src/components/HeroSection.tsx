import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="hero-gradient py-12 md:py-16">
      <div className="container text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in">
          Encontre paz e oração perto de você
        </h1>
        <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto animate-fade-in">
          Descubra missas, confissões e momentos de adoração em paróquias verificadas da sua região.
        </p>
        
        {/* Location Chip */}
        <div className="inline-flex items-center gap-2 bg-card rounded-full px-4 py-2 card-shadow animate-fade-in">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground">Localização atual</p>
            <p className="text-sm font-medium text-foreground">Gleba Palhano, Londrina</p>
          </div>
          <Button variant="link" size="sm" className="text-primary p-0 h-auto ml-2">
            Alterar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
