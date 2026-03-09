import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MOCK_RESULT = {
  skin_type: "Combination",
  concerns: ["Mild dehydration in cheek area", "Slight oiliness in T-zone", "Minor sun damage spots"],
  overall_score: 78,
  recommendations: [
    "Use a gentle hydrating cleanser morning and evening",
    "Apply SPF 50 daily to prevent further sun damage",
    "Consider a vitamin C serum for brightening",
    "Weekly exfoliation with AHA/BHA would benefit your skin",
  ],
  recommended_services: ["Classic Facial Treatment", "Premium Skincare Consultation"],
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
      // Return mock data when no API key is configured
      return new Response(
        JSON.stringify(MOCK_RESULT),
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
        messages: [
          {
            role: "system",
            content: `You are a professional skin analysis AI for Zehra Glam beauty salon. Analyze the uploaded face photo and return a JSON object with:
- skin_type: string (e.g., "Oily", "Dry", "Combination", "Normal", "Sensitive")
- concerns: string[] (list of 3-5 specific skin concerns observed)
- overall_score: number (1-100, overall skin health score)
- recommendations: string[] (4-5 personalized skincare recommendations)
- recommended_services: string[] (1-3 services from: "Classic Facial Treatment", "Deep Cleansing Facial", "Full Body Laser Epilation", "Bikini Laser Epilation", "Classic Lash Extensions", "Volume Lash Extensions", "Premium Skincare Consultation")
Return ONLY valid JSON, no markdown.`,
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Please analyze this face photo for skin type and concerns." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image_base64}` } },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No analysis returned from AI");
    }

    const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const result = JSON.parse(cleaned);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
