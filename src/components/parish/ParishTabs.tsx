import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Info, Instagram } from "lucide-react";
import { Parish, ParishEvent, Pastoral, ParishImage } from "@/hooks/useParish";
import ParishEventsTab from "./ParishEventsTab";
import ParishPastoralsTab from "./ParishPastoralsTab";
import ParishAboutTab from "./ParishAboutTab";
import ParishInstagramTab from "./ParishInstagramTab";

interface ParishTabsProps {
  parish: Parish;
  events: ParishEvent[];
  pastorals: Pastoral[];
  images: ParishImage[];
}

const ParishTabs = ({ parish, events, pastorals, images }: ParishTabsProps) => {
  const hasInstagram = parish.instagram_username || parish.instagram_url;

  return (
    <div className="container pb-8">
      <Tabs defaultValue="eventos" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger 
            value="eventos" 
            className="data-[state=active]:bg-background data-[state=active]:text-primary"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Eventos
          </TabsTrigger>
          <TabsTrigger 
            value="pastorais"
            className="data-[state=active]:bg-background data-[state=active]:text-primary"
          >
            <Users className="h-4 w-4 mr-2" />
            Pastorais
          </TabsTrigger>
          <TabsTrigger 
            value="sobre"
            className="data-[state=active]:bg-background data-[state=active]:text-primary"
          >
            <Info className="h-4 w-4 mr-2" />
            Sobre
          </TabsTrigger>
          {hasInstagram && (
            <TabsTrigger 
              value="instagram"
              className="data-[state=active]:bg-background data-[state=active]:text-primary"
            >
              <Instagram className="h-4 w-4 mr-2" />
              Instagram
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="eventos" className="mt-6">
          <ParishEventsTab events={events} />
        </TabsContent>

        <TabsContent value="pastorais" className="mt-6">
          <ParishPastoralsTab pastorals={pastorals} />
        </TabsContent>

        <TabsContent value="sobre" className="mt-6">
          <ParishAboutTab parish={parish} images={images} />
        </TabsContent>

        {hasInstagram && (
          <TabsContent value="instagram" className="mt-6">
            <ParishInstagramTab 
              instagramUsername={parish.instagram_username || ""} 
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ParishTabs;
