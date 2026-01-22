import { useState, useEffect } from "react";
import { Instagram, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface ParishInstagramTabProps {
  instagramUsername: string;
}

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
}

const ParishInstagramTab = ({ instagramUsername }: ParishInstagramTabProps) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      if (!instagramUsername) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("fetch-instagram", {
          body: { username: instagramUsername },
        });

        if (error) throw error;

        if (data?.posts) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error("Error fetching Instagram posts:", err);
        setError("Não foi possível carregar os posts do Instagram.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramPosts();
  }, [instagramUsername]);

  const handleOpenInstagram = () => {
    window.open(`https://instagram.com/${instagramUsername}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        {error ? (
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        ) : (
          <Instagram className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        )}
        <h3 className="text-lg font-medium text-foreground mb-1">
          {error || "Nenhum post encontrado"}
        </h3>
        <p className="text-muted-foreground mb-4">
          Visite o perfil do Instagram para ver as publicações.
        </p>
        <Button onClick={handleOpenInstagram} variant="outline">
          <Instagram className="h-4 w-4 mr-2" />
          @{instagramUsername}
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with link to profile */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Últimas Publicações</h3>
        <Button onClick={handleOpenInstagram} variant="outline" size="sm">
          <Instagram className="h-4 w-4 mr-2" />
          Ver perfil completo
        </Button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
          >
            <img
              src={post.media_url}
              alt={post.caption?.slice(0, 100) || "Post do Instagram"}
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ParishInstagramTab;
