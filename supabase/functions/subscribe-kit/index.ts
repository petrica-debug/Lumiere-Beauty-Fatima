import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, name, source } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Save to Supabase subscribers table
    await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "resolution=ignore-duplicates",
      },
      body: JSON.stringify({ email, name: name || null, source: source || "website" }),
    });

    // Sync with Kit (ConvertKit) if API key is set
    const kitKey = Deno.env.get("KIT_API_KEY");
    if (kitKey) {
      try {
        await fetch("https://api.convertkit.com/v3/forms", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // Subscribe to Kit
        await fetch(`https://api.convertkit.com/v3/subscribers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: kitKey,
            email,
            first_name: name || "",
          }),
        });
      } catch (e) {
        console.error("Kit sync failed:", e);
      }
    } else {
      console.log("KIT_API_KEY not set — subscriber saved to Supabase only");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
