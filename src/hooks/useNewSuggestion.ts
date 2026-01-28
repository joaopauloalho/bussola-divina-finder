import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewSuggestionData {
  type: "new_parish" | "new_pastoral";
  name: string;
  address?: string;
  phone?: string;
  notes?: string;
}

// Get user identifier for suggestions (using localStorage for anonymous users)
const getUserIdentifier = (): string => {
  let identifier = localStorage.getItem("user_identifier");
  if (!identifier) {
    identifier = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem("user_identifier", identifier);
  }
  return identifier;
};

export const useSubmitNewSuggestion = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: NewSuggestionData) => {
      const userIdentifier = getUserIdentifier();

      // Stringify the data as JSON for suggested_value
      const suggestedValue = JSON.stringify({
        type: data.type,
        name: data.name,
        address: data.address || "",
        phone: data.phone || "",
        notes: data.notes || "",
      });

      const { error } = await supabase.from("suggestions").insert({
        user_identifier: userIdentifier,
        suggestion_type: data.type,
        suggested_value: suggestedValue,
        // parish_id and event_id remain null for new suggestions
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Sugestão enviada com sucesso!",
        description: "Obrigado por ajudar a expandir nossa comunidade. Analisaremos sua sugestão em breve.",
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
