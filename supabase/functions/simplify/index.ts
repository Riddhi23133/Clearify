import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, level } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a concept simplifier. You take complex topics and explain them in a simple, friendly, human way.

Based on the difficulty level, adjust your language:
- "Like I'm 10": Use very simple words, fun comparisons, short sentences
- "Like I'm 15": Use simple language with slightly more detail
- "Beginner": Clear explanations assuming no prior knowledge
- "Expert": Concise but thorough, using proper terminology

You MUST respond with a valid JSON object (no markdown, no code fences) with exactly this structure:
{
  "simple": "A clear, friendly explanation in 2-3 sentences",
  "steps": ["Step 1 explanation", "Step 2 explanation", "Step 3 explanation", "Step 4 explanation"],
  "example": "A real-life example that makes this concept relatable",
  "analogy": "A creative analogy comparing this to something everyday",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Simplify this topic (level: ${level}): ${topic}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "simplify_topic",
              description: "Return a simplified explanation of a complex topic",
              parameters: {
                type: "object",
                properties: {
                  simple: { type: "string", description: "Simple 2-3 sentence explanation" },
                  steps: { type: "array", items: { type: "string" }, description: "Step-by-step breakdown" },
                  example: { type: "string", description: "Real-life example" },
                  analogy: { type: "string", description: "Creative analogy" },
                  keyPoints: { type: "array", items: { type: "string" }, description: "Key bullet points" },
                },
                required: ["simple", "steps", "example", "analogy", "keyPoints"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "simplify_topic" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try parsing content as JSON
    const content = data.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(content);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
