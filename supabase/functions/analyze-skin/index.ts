import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FALLBACK_RESULT = {
  skin_type: "Unable to determine",
  concerns: ["Could not fully analyze the image — please try a clearer, well-lit face photo"],
  overall_score: 0,
  recommendations: [
    "Take a photo in natural daylight facing a window",
    "Ensure your full face is visible and in focus",
    "Remove sunglasses or anything covering your skin",
    "Try again with a front-facing selfie",
  ],
  recommended_services: ["Premium Skincare Consultation"],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { image_base64 } = await req.json();

    if (!image_base64) {
      throw new Error("No image provided");
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      return new Response(
        JSON.stringify(FALLBACK_RESULT),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a professional skin analysis AI assistant for Zehra Glam beauty salon. You will receive a photo. Analyze the skin visible in the photo and respond with ONLY a JSON object.

IMPORTANT: Always return valid JSON regardless of image quality. If the image is unclear, blurry, or not a face, still return the JSON structure with your best assessment or general skincare advice.

JSON schema:
{
  "skin_type": string (one of: "Oily", "Dry", "Combination", "Normal", "Sensitive"),
  "concerns": string[] (3-5 specific observations about the skin),
  "overall_score": number (1-100, skin health estimate),
  "recommendations": string[] (4-5 personalized skincare tips),
  "recommended_services": string[] (1-3 from: "Classic Facial Treatment", "Deep Cleansing Facial", "Full Body Laser Epilation", "Bikini Laser Epilation", "Classic Lash Extensions", "Volume Lash Extensions", "Premium Skincare Consultation")
}`,
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this photo for skin type, concerns, and recommendations. Return JSON only." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image_base64}`, detail: "low" } },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`OpenAI API error (${response.status}):`, errBody);
      return new Response(
        JSON.stringify(FALLBACK_RESULT),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("OpenAI returned empty content:", JSON.stringify(data));
      return new Response(
        JSON.stringify(FALLBACK_RESULT),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;
    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse OpenAI response as JSON:", content);
      return new Response(
        JSON.stringify(FALLBACK_RESULT),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!result.skin_type || !result.concerns || !result.recommendations) {
      console.error("OpenAI response missing required fields:", content);
      return new Response(
        JSON.stringify({ ...FALLBACK_RESULT, ...result }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("analyze-skin error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
