import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();

    if (!username) {
      return new Response(
        JSON.stringify({ error: "Username is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Fetching Instagram posts for @${username}`);

    // Note: Instagram Basic Display API requires a valid access token
    // For now, we'll return an empty array with a helpful message
    // The parish admin will need to connect their Instagram account
    
    // In production, you would:
    // 1. Store the Instagram access token per parish (after OAuth flow)
    // 2. Use the token to fetch posts from the Instagram Graph API
    // 3. Cache results for 1 hour to avoid rate limits
    
    // Example API call (when access token is available):
    // const response = await fetch(
    //   `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}`
    // );
    
    // For demo purposes, return mock data or empty array
    const mockPosts: InstagramPost[] = [];
    
    // You can add mock data for testing:
    // const mockPosts: InstagramPost[] = [
    //   {
    //     id: "1",
    //     media_url: "https://picsum.photos/400/400?random=1",
    //     permalink: `https://instagram.com/${username}`,
    //     caption: "Post da paróquia #fé #igreja",
    //     timestamp: new Date().toISOString(),
    //     media_type: "IMAGE"
    //   },
    //   ...
    // ];

    return new Response(
      JSON.stringify({ 
        posts: mockPosts,
        message: "Instagram integration requires OAuth setup. Visit the Instagram profile directly.",
        profile_url: `https://instagram.com/${username}`
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in fetch-instagram:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch Instagram posts",
        posts: []
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});