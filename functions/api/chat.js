// ─── Cloudflare Pages Function: POST /api/chat ───────────────────────────────
// Streams a reply from Groq's OpenAI-compatible API as plain text, matching what
// components/AskSolarLogic.tsx reads. This is what actually runs the chatbot in
// production on Cloudflare (the static export drops Next.js route handlers).
//
// Required: set GROQ_API_KEY in the Cloudflare Pages project
//   → Settings → Variables and Secrets → add GROQ_API_KEY (encrypted).
//
// The persona prompt is shared with local dev via lib/askSolarLogicPrompt.js.

import { SYSTEM_PROMPT } from "../../lib/askSolarLogicPrompt.js";

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.GROQ_API_KEY) {
    return json({ error: "AI service is not configured. Please try again later." }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const { messages, context: pageContext } = body || {};
  if (!Array.isArray(messages)) {
    return json({ error: "Messages are required." }, 400);
  }

  const contextBlock = pageContext ? `\n\nCurrent page context: ${pageContext}` : "";
  const fullSystemPrompt = `${SYSTEM_PROMPT}${contextBlock}`;

  let groqRes;
  try {
    groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
        messages: [{ role: "system", content: fullSystemPrompt }, ...messages],
      }),
    });
  } catch {
    return json({ error: "Something went wrong. Please try again." }, 500);
  }

  if (!groqRes.ok || !groqRes.body) {
    return json({ error: "Something went wrong. Please try again." }, 500);
  }

  // Parse Groq's SSE stream ("data: {json}\n\n" ... "data: [DONE]") and emit the
  // plain-text content deltas the frontend appends directly.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = groqRes.body.getReader();
  let buffer = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIndex;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 1);
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const text = parsed.choices?.[0]?.delta?.content;
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // ignore keep-alives / partial JSON lines
            }
          }
        }
        controller.close();
      } catch {
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
