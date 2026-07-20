import Groq from "groq-sdk";
import { NextRequest } from "next/server";
import { SYSTEM_PROMPT } from "../../../lib/askSolarLogicPrompt";

let groqClient: Groq | undefined;

function getGroqClient(): Groq {
  if (groqClient) {
    return groqClient;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  groqClient = new Groq({ apiKey });
  return groqClient;
}

// ─── Rate limiting (in-memory, per IP) ───────────────────────
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  if (record.count >= RATE_LIMIT) return true;
  record.count++;
  return false;
}

// ─── Persona prompt lives in lib/askSolarLogicPrompt.js (shared with the Cloudflare Pages Function) ───

// ─── POST handler ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many messages. Please wait a moment." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const contextBlock = context
      ? `\n\nCurrent page context: ${context}`
      : "";

    const fullSystemPrompt = `${SYSTEM_PROMPT}${contextBlock}`;

    const groq = getGroqClient();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: fullSystemPrompt },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatCompletion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);

    if (error instanceof Error && error.message === "GROQ_API_KEY is not configured") {
      return new Response(
        JSON.stringify({ error: "AI service is not configured. Please try again later." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}