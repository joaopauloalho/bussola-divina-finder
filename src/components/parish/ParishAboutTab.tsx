import { Parish, ParishImage } from "@/hooks/useParish";
import { MapPin, Phone, Globe, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ParishAboutTabProps {
  parish: Parish;
  images: ParishImage[];
}

const ParishAboutTab = ({ parish, images }: ParishAboutTabProps) => {
  const handleNavigate = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${parish.lat},${parish.lng}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-8">
      {/* Description */}
      {parish.description && (
        <div className="bg-card rounded-lg card-shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Sobre a Paróquia</h3>
          <p className="text-muted-foreground whitespace-pre-line">
            {parish.description}
          </p>
        </div>
      )}

      {/* Photo Gallery */}
      {images.length > 0 && (
        <div className="bg-card rounded-lg card-shadow p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Galeria de Fotos</h3>
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.caption || "Foto da paróquia"}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {image.caption && (
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        {image.caption}
                      </p>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 3 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* Location & Map */}
      <div className="bg-card rounded-lg card-shadow p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Localização</h3>
        
        {/* Google Maps Embed */}
        <div className="aspect-video rounded-lg overflow-hidden mb-4">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${parish.lat},${parish.lng}&zoom=16`}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              {parish.address}
            </p>
          </div>
          <Button onClick={handleNavigate} className="shrink-0">
            <MapPin className="h-4 w-4 mr-2" />
            Como Chegar
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-card rounded-lg card-shadow p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Contato</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {parish.phone && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="h-5 w-5 text-primary" />
              <span>{parish.phone}</span>
            </div>
          )}
          {parish.whatsapp && (
            <a
              href={`https://wa.me/55${parish.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-5 w-5 text-primary" />
              <span>WhatsApp: {parish.whatsapp}</span>
            </a>
          )}
          {parish.instagram_username && (
            <a
              href={`https://instagram.com/${parish.instagram_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5 text-primary" />
              <span>@{parish.instagram_username}</span>
            </a>
          )}
          {parish.website_url && (
            <a
              href={parish.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <Globe className="h-5 w-5 text-primary" />
              <span>Site Oficial</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParishAboutTab;
