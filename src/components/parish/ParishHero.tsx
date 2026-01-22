import { MapPin, Phone, Globe, Instagram, Heart, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Parish } from "@/hooks/useParish";
import { cn } from "@/lib/utils";

interface ParishHeroProps {
  parish: Parish;
  onDonateClick: () => void;
}

const ParishHero = ({ parish, onDonateClick }: ParishHeroProps) => {
  const handleNavigate = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${parish.lat},${parish.lng}`,
      "_blank"
    );
  };

  const handleWhatsApp = () => {
    if (parish.whatsapp) {
      const phone = parish.whatsapp.replace(/\D/g, "");
      window.open(`https://wa.me/55${phone}`, "_blank");
    }
  };

  const handleInstagram = () => {
    if (parish.instagram_url) {
      window.open(parish.instagram_url, "_blank");
    } else if (parish.instagram_username) {
      window.open(`https://instagram.com/${parish.instagram_username}`, "_blank");
    }
  };

  const handleWebsite = () => {
    if (parish.website_url) {
      window.open(parish.website_url, "_blank");
    }
  };

  return (
    <section className="relative">
      {/* Hero Image/Gradient Background */}
      <div 
        className={cn(
          "h-48 md:h-64 bg-gradient-to-br from-primary/20 via-primary/10 to-background",
          parish.image_url && "bg-cover bg-center"
        )}
        style={parish.image_url ? { backgroundImage: `url(${parish.image_url})` } : undefined}
      >
        {parish.image_url && (
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        )}
      </div>

      {/* Parish Info Card */}
      <div className="container relative -mt-20 md:-mt-24 pb-6">
        <div className="bg-card rounded-xl card-shadow p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {parish.name}
                </h1>
                {parish.is_official && (
                  <Badge className="bg-accent/20 text-accent-foreground border-accent shrink-0">
                    <Star className="h-3 w-3 mr-1" />
                    Oficial
                  </Badge>
                )}
              </div>

              {/* Address */}
              <button
                onClick={handleNavigate}
                className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-colors text-left group"
              >
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="group-hover:underline">{parish.address}</span>
                <ExternalLink className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Contact Links */}
              <div className="flex flex-wrap gap-3">
                {(parish.phone || parish.whatsapp) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={parish.whatsapp ? handleWhatsApp : undefined}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {parish.whatsapp || parish.phone}
                  </Button>
                )}

                {(parish.instagram_url || parish.instagram_username) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleInstagram}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    {parish.instagram_username ? `@${parish.instagram_username}` : "Instagram"}
                  </Button>
                )}

                {parish.website_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWebsite}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Site
                  </Button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:min-w-48">
              <Button
                onClick={handleNavigate}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Como Chegar
              </Button>
              {parish.pix_key && (
                <Button
                  variant="outline"
                  onClick={onDonateClick}
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Doar via Pix
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParishHero;
