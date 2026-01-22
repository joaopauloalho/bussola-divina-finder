import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Parish {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  instagram_url: string | null;
  instagram_username: string | null;
  pix_key: string | null;
  is_official: boolean;
  image_url: string | null;
  description: string | null;
  website_url: string | null;
  whatsapp: string | null;
  created_at: string;
  updated_at: string;
}

export interface ParishEvent {
  id: string;
  parish_id: string;
  type: "Missa" | "Confissão" | "Adoração" | "Terço";
  day_of_week: number;
  time: string;
  verification_score: number;
}

export interface Pastoral {
  id: string;
  parish_id: string;
  name: string;
  description: string | null;
  leader_name: string | null;
  whatsapp: string | null;
  email: string | null;
  icon: string;
  schedules: PastoralSchedule[];
}

export interface PastoralSchedule {
  id: string;
  pastoral_id: string;
  day_of_week: number;
  start_time: string;
  location: string | null;
}

export interface ParishImage {
  id: string;
  parish_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
}

const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const getDayName = (dayOfWeek: number): string => {
  return dayNames[dayOfWeek] || "";
};

export const formatTime = (time: string): string => {
  return time.slice(0, 5); // "08:00:00" -> "08:00"
};

export const useParish = (parishId: string | undefined) => {
  return useQuery({
    queryKey: ["parish", parishId],
    queryFn: async () => {
      if (!parishId) throw new Error("Parish ID is required");

      const { data, error } = await supabase
        .from("parishes")
        .select("*")
        .eq("id", parishId)
        .single();

      if (error) throw error;
      return data as Parish;
    },
    enabled: !!parishId,
  });
};

export const useParishEvents = (parishId: string | undefined) => {
  return useQuery({
    queryKey: ["parish-events", parishId],
    queryFn: async () => {
      if (!parishId) throw new Error("Parish ID is required");

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("parish_id", parishId)
        .order("day_of_week", { ascending: true })
        .order("time", { ascending: true });

      if (error) throw error;
      return data as ParishEvent[];
    },
    enabled: !!parishId,
  });
};

export const useParishPastorals = (parishId: string | undefined) => {
  return useQuery({
    queryKey: ["parish-pastorals", parishId],
    queryFn: async () => {
      if (!parishId) throw new Error("Parish ID is required");

      // Fetch pastorals using raw query since types may not be updated yet
      const { data: pastorals, error: pastoralsError } = await supabase
        .from("pastorals" as any)
        .select("*")
        .eq("parish_id", parishId)
        .order("name", { ascending: true });

      if (pastoralsError) throw pastoralsError;

      const typedPastorals = pastorals as unknown as Array<{
        id: string;
        parish_id: string;
        name: string;
        description: string | null;
        leader_name: string | null;
        whatsapp: string | null;
        email: string | null;
        icon: string;
      }>;

      // Fetch schedules for all pastorals
      const pastoralIds = typedPastorals?.map((p) => p.id) || [];
      
      if (pastoralIds.length === 0) {
        return [] as Pastoral[];
      }

      const { data: schedules, error: schedulesError } = await supabase
        .from("pastoral_schedules" as any)
        .select("*")
        .in("pastoral_id", pastoralIds)
        .order("day_of_week", { ascending: true });

      if (schedulesError) throw schedulesError;

      const typedSchedules = schedules as unknown as PastoralSchedule[];

      // Combine pastorals with their schedules
      const pastoralsWithSchedules: Pastoral[] = typedPastorals.map((pastoral) => ({
        ...pastoral,
        icon: pastoral.icon || "users",
        schedules: (typedSchedules || []).filter((s) => s.pastoral_id === pastoral.id),
      }));

      return pastoralsWithSchedules;
    },
    enabled: !!parishId,
  });
};

export const useParishImages = (parishId: string | undefined) => {
  return useQuery({
    queryKey: ["parish-images", parishId],
    queryFn: async () => {
      if (!parishId) throw new Error("Parish ID is required");

      const { data, error } = await supabase
        .from("parish_images" as any)
        .select("*")
        .eq("parish_id", parishId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as unknown as ParishImage[];
    },
    enabled: !!parishId,
  });
};
