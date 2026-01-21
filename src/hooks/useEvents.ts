import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Parish {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  instagram_url: string | null;
  pix_key: string | null;
  is_official: boolean;
  image_url: string | null;
}

export interface Event {
  id: string;
  parish_id: string;
  type: "Missa" | "Confissão" | "Adoração" | "Terço";
  day_of_week: number;
  time: string;
  verification_score: number;
  parish: Parish;
}

export interface EventWithDetails extends Event {
  formattedTime: string;
  distance: string;
  status: "official" | "community" | "unverified";
  minutesUntil?: number;
}

// Get user identifier for voting (using localStorage for anonymous users)
const getUserIdentifier = (): string => {
  let identifier = localStorage.getItem("user_identifier");
  if (!identifier) {
    identifier = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem("user_identifier", identifier);
  }
  return identifier;
};

// Calculate distance (simplified - in a real app you'd use actual geolocation)
const calculateDistance = (lat: number, lng: number): string => {
  // Simulated distance calculation
  const baseDistance = Math.abs(lat + 23.3) * 100 + Math.abs(lng + 51.17) * 100;
  if (baseDistance < 1) return `${Math.round(baseDistance * 1000)}m`;
  return `${baseDistance.toFixed(1)}km`;
};

// Calculate minutes until event
const calculateMinutesUntil = (eventTime: string): number | undefined => {
  const now = new Date();
  const [hours, minutes] = eventTime.split(":").map(Number);
  const eventDate = new Date();
  eventDate.setHours(hours, minutes, 0, 0);
  
  const diff = eventDate.getTime() - now.getTime();
  const minutesUntil = Math.round(diff / 60000);
  
  if (minutesUntil > 0 && minutesUntil <= 60) {
    return minutesUntil;
  }
  return undefined;
};

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          parish:parishes(*)
        `)
        .order("time", { ascending: true });

      if (error) throw error;

      // Transform data to include computed fields
      const eventsWithDetails: EventWithDetails[] = (data || []).map((event: any) => {
        const parish = event.parish as Parish;
        const formattedTime = event.time.substring(0, 5); // HH:MM format
        const distance = calculateDistance(parish.lat, parish.lng);
        
        // Determine status based on is_official and verification_score
        let status: "official" | "community" | "unverified";
        if (parish.is_official) {
          status = "official";
        } else if (event.verification_score >= 5) {
          status = "community";
        } else {
          status = "unverified";
        }

        return {
          ...event,
          parish,
          formattedTime,
          distance,
          status,
          minutesUntil: calculateMinutesUntil(formattedTime),
        };
      });

      return eventsWithDetails;
    },
  });
};

export const useVoteEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ eventId, voteType }: { eventId: string; voteType: "up" | "down" }) => {
      const userIdentifier = getUserIdentifier();
      
      const { error } = await supabase
        .from("validations")
        .insert({
          event_id: eventId,
          user_identifier: userIdentifier,
          vote_type: voteType,
        });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Você já votou neste evento!");
        }
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      if (variables.voteType === "up") {
        toast({
          title: "Obrigado por confirmar este horário!",
          description: "Sua validação ajuda outros fiéis a encontrarem eventos.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao votar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSubmitSuggestion = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      eventId,
      parishId,
      suggestionType,
      suggestedValue,
    }: {
      eventId?: string;
      parishId?: string;
      suggestionType: "time_correction" | "address_correction" | "phone_correction" | "other";
      suggestedValue: string;
    }) => {
      const userIdentifier = getUserIdentifier();

      const { error } = await supabase.from("suggestions").insert({
        event_id: eventId || null,
        parish_id: parishId || null,
        user_identifier: userIdentifier,
        suggestion_type: suggestionType,
        suggested_value: suggestedValue,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Sugestão enviada!",
        description: "Obrigado por ajudar a manter as informações atualizadas.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar sugestão",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });
};
