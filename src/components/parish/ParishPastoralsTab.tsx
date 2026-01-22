import { Pastoral, getDayName, formatTime } from "@/hooks/useParish";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Heart, 
  Music, 
  BookOpen, 
  Baby, 
  HandHeart, 
  Cross,
  MessageCircle,
  Mail,
  Clock,
  MapPin
} from "lucide-react";

interface ParishPastoralsTabProps {
  pastorals: Pastoral[];
}

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  heart: Heart,
  music: Music,
  book: BookOpen,
  baby: Baby,
  handHeart: HandHeart,
  cross: Cross,
};

const ParishPastoralsTab = ({ pastorals }: ParishPastoralsTabProps) => {
  if (pastorals.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium text-foreground mb-1">
          Nenhuma pastoral cadastrada
        </h3>
        <p className="text-muted-foreground">
          Esta paróquia ainda não possui pastorais registradas.
        </p>
      </div>
    );
  }

  const handleWhatsApp = (whatsapp: string, pastoralName: string) => {
    const phone = whatsapp.replace(/\D/g, "");
    const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre a ${pastoralName}.`);
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, "_blank");
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pastorals.map((pastoral) => {
        const IconComponent = iconMap[pastoral.icon] || Users;
        
        return (
          <Card key={pastoral.id} className="card-shadow hover:card-shadow-hover transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{pastoral.name}</CardTitle>
                  {pastoral.leader_name && (
                    <CardDescription className="mt-1">
                      Coordenador: {pastoral.leader_name}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pastoral.description && (
                <p className="text-sm text-muted-foreground">
                  {pastoral.description}
                </p>
              )}

              {/* Schedules */}
              {pastoral.schedules.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Reuniões:</h4>
                  <div className="space-y-1">
                    {pastoral.schedules.map((schedule) => (
                      <div 
                        key={schedule.id}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Badge variant="secondary" className="font-normal">
                          <Clock className="h-3 w-3 mr-1" />
                          {getDayName(schedule.day_of_week)} às {formatTime(schedule.start_time)}
                        </Badge>
                        {schedule.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {schedule.location}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {pastoral.whatsapp && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleWhatsApp(pastoral.whatsapp!, pastoral.name)}
                    className="text-xs"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    WhatsApp
                  </Button>
                )}
                {pastoral.email && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEmail(pastoral.email!)}
                    className="text-xs"
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ParishPastoralsTab;
