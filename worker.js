export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const method = req.method.toUpperCase();

    if (!isAllowedRequest(req)) {
      return cors(req, json({ ok: false, error: "Request not allowed" }, 403));
    }

    if (method === "OPTIONS") return cors(req, new Response(null, { status: 204 }));

    if (path === "/health") {
      const checks = {
        ASK_LIMITS_binding: !!env.ASK_LIMITS,
        gemini_api_secret: !!(env.GEMINI_API_KEY || env.gemini_api),
        QUESTION_LIMIT_var: env.QUESTION_LIMIT !== undefined,
        GEMINI_MODEL_var: env.GEMINI_MODEL !== undefined,
      };
      const missing = Object.entries(checks)
        .filter(([, ok]) => !ok)
        .map(([name]) => name);
      return cors(
        req,
        json(
          {
            ok: missing.length === 0,
            checks,
            missing,
            note: "ASK_LIMITS must be a KV binding. Secret can be GEMINI_API_KEY or gemini_api.",
          },
          missing.length === 0 ? 200 : 500
        )
      );
    }

    if (!env.ASK_LIMITS) {
      return cors(req, json({ ok: false, error: "Missing KV binding: ASK_LIMITS" }, 500));
    }

    const apiKey = env.GEMINI_API_KEY || env.gemini_api;
    if (!apiKey) {
      return cors(req, json({ ok: false, error: "Missing secret: GEMINI_API_KEY (or gemini_api)" }, 500));
    }

    if (path === "/status") {
      if (method !== "GET") return cors(req, json({ ok: false, error: "Method not allowed" }, 405));
      const ip = req.headers.get("CF-Connecting-IP") || "unknown";
      const isOwner = isOwnerIp(ip);
      if (isOwner) {
        return cors(req, json({ ok: true, unlimited: true, limit: null, used: 0, remaining: null }));
      }
      const key = limitKey(ip);
      const used = Number((await env.ASK_LIMITS.get(key)) || 0);
      const limit = Number(env.QUESTION_LIMIT || 5);
      return cors(req, json({ ok: true, limit, used, remaining: Math.max(0, limit - used) }));
    }

    if (path === "/ask") {
      if (method !== "POST") return cors(req, json({ ok: false, error: "Method not allowed" }, 405));

      const ip = req.headers.get("CF-Connecting-IP") || "unknown";
      const isOwner = isOwnerIp(ip);
      const key = limitKey(ip);
      const used = Number((await env.ASK_LIMITS.get(key)) || 0);
      const limit = Number(env.QUESTION_LIMIT || 5);

      if (!isOwner && used >= limit) {
        return cors(req, json({ ok: false, error: "Limit reached", limit, used, remaining: 0 }, 429));
      }

      const body = await req.json().catch(() => ({}));
      const question = String(body.question || "").trim();
      const persona= `
You are “Abdullah’s AI” – a personal, friendly AI assistant living inside Abdullah Magdy Elbarrany’s retro Windows-style portfolio website.

Think of yourself as Abdullah’s digital sidekick:
- You help visitors learn about Abdullah.
- You guide them around the portfolio like a cool tour guide.
- You sound human, natural, and chill — not like a stiff corporate chatbot.

You’re helpful, confident, and straight to the point.
No over-explaining. No robotic vibes. Just clean, friendly answers.

========================
🔒 SAFETY & SCOPE RULES
========================
- You ONLY answer questions about Abdullah and what’s available in this portfolio.
  (His background, skills, experience, projects, CV, links, hobbies, fun facts, publications, portfolio content, etc.)
- If the user asks about politics, religion, news, coding help, random knowledge, opinions, or anything NOT about Abdullah — you must refuse.
- If the question is vague or not clearly about Abdullah, respond with:
  "I can only help with questions about Abdullah and what’s inside this portfolio. Try asking about his work, projects, or background."
- Never make things up. If the info isn’t in this profile or the portfolio, say you don’t have that info.
- No opinions, no advice outside Abdullah’s profile.

========================
👤 WHO IS ABDULLAH?
========================
Name: Abdullah Magdy Elbarrany  
Title: Senior Machine Learning Engineer  
Location: Egypt  

Quick intro:
Abdullah is a Senior Machine Learning Engineer who builds real-world AI systems — not just demos.
He works on production-grade ML, especially in healthcare and computer vision.
He’s into LLMs, deep learning, MLOps, and taking models all the way from research to deployed products on cloud (GCP & AWS).

========================
🔗 LINKS
========================
GitHub: <https://github.com/Abdullahelbarrany
LinkedIn: https://www.linkedin.com/in/abdullah-elbarrany-8a300822a/
ResarchGate:https://www.researchgate.net/profile/Abdullah-Elbarrany
Email: abdullah.elbarrany@gmail.com  
CV: Available through the CV window (assets/cv.pdf if present)

========================
🧠 SKILLS
========================
Languages: Python, C++, C#, PHP, Dart  
ML/AI: TensorFlow, Keras, Scikit-learn, YOLO, OpenCV, Pandas, NumPy  
Cloud & MLOps: GCP, AWS, Docker, Firebase  
Frameworks: Flutter, .NET  
Databases: MySQL, SQLite  

========================
💼 EXPERIENCE
========================
- Machine Learning Engineer – mDoc (2024 – Present)
  - Built AI-powered health coach systems
  - Designed LLM-based components with safety alignment
  - Deployed scalable ML services on GCP

- Machine Learning Engineer – Zedzag (2023 – 2024)
  - Led HomeIoT smart home platform
  - Built real-time YOLO-based computer vision systems

========================
🚀 PROJECTS
========================
- AI-powered health coach  
- YOLO-based statue recognition system for museums  
- Poultry farm abnormal behavior detection (computer vision)  
- BuckTracker: multi-banknote tracking system  
- HomeIoT smart home automation app  

========================
🏆 ACHIEVEMENTS
========================
- First Place – 6th UGRF Special Edition (2024)  
- Best Paper Award – IMSA Conference (2023)  
- Innov8 Hackathon Finalist (2023)  

========================
🎯 HOBBIES
========================
- Exploring new AI models & tools  
- Building side projects  
- Reading tech blogs & research papers  
- Experimenting with product ideas  

========================
🎉 FUN FACTS
========================
- Enjoys turning research into real products  
- Worked across healthcare AI & computer vision  
- Likes experimenting with new ML frameworks  

========================
🖥️ PORTFOLIO ENVIRONMENT AWARENESS
========================
You live inside a retro Windows-style portfolio with:
- Desktop apps (Ask Me.exe, MazeGame.exe)
- Folders (Publications, pics, projects)
- CV window (optional assets/cv.pdf)

If the user asks about something that exists on the site, guide them naturally:
- "You can open MazeGame.exe from the desktop to try the pathfinding demo."
- "Check the Publications folder to see Abdullah’s papers and blogs."
- "You’ll find project screenshots inside the projects folder."
- "You can download the CV from the CV window."

Never send users outside this website.

========================
🗣️ RESPONSE STYLE
========================
- Friendly, natural, slightly casual
- Confident but not arrogant
- Short, clear answers
- Feel like a human guide, not a bot
- Stay strictly within Abdullah + this portfolio

========================
❌ REFUSAL TEMPLATE
========================
If the user asks about anything outside Abdullah or this portfolio:
"I’m here just to answer questions about Abdullah and what’s inside this portfolio. I can’t help with that topic."
`;

      const history = extractHistory(body);

      if (!question) return cors(req, json({ ok: false, error: "Missing question" }, 400));

      const model = env.GEMINI_MODEL || "gemini-2.5-flash";
      const maxOutputTokensRaw = Number(env.ANSWER_MAX_TOKENS);
      const maxOutputTokens =
        Number.isFinite(maxOutputTokensRaw) && maxOutputTokensRaw > 0
          ? Math.floor(maxOutputTokensRaw)
          : 520;
      const contents = buildContents(history, persona, question);

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              maxOutputTokens,
              temperature: 0.6,
            },
          }),
        }
      );

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        return cors(req, json({ ok: false, error: "Gemini request failed", details: errText }, 502));
      }

      const geminiJson = await geminiRes.json();
      const answer =
        geminiJson?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n").trim() ||
        "No answer returned.";

      let newUsed = used;
      if (!isOwner) {
        newUsed = used + 1;
        await env.ASK_LIMITS.put(key, String(newUsed), { expirationTtl: secondsUntilUtcMidnight() });
      }

      return cors(
        req,
        json({
          ok: true,
          answer,
          userTurns: extractUserTurns(history, question),
          unlimited: isOwner,
          limit: isOwner ? null : limit,
          used: newUsed,
          remaining: isOwner ? null : Math.max(0, limit - newUsed),
        })
      );
    }

    return cors(req, json({ ok: false, error: "Not found", path, method }, 404));
  },
};

function buildContents(history, persona, question) {
  const contents = [];

  if (persona) {
    contents.push({
      role: "user",
      parts: [{ text: `System instruction:\n${persona}` }],
    });
  }

  for (const msg of history) {
    if (!msg || typeof msg !== "object") continue;
    const text = String(msg.content || "").trim();
    if (!text) continue;
    const role = normalizeRole(msg.role);
    contents.push({ role, parts: [{ text }] });
  }

  contents.push({
    role: "user",
    parts: [{ text: question }],
  });

  return contents;
}

function extractHistory(body) {
  if (!body || typeof body !== "object") return [];
  if (Array.isArray(body.history)) return normalizeHistory(body.history);
  if (Array.isArray(body.userTurns)) return normalizeHistory(body.userTurns);
  if (Array.isArray(body.turns)) return normalizeHistory(body.turns);
  return [];
}

function normalizeHistory(history) {
  const out = [];
  for (const msg of history) {
    if (typeof msg === "string") {
      const text = msg.trim();
      if (text) out.push({ role: "user", content: text });
      continue;
    }
    if (!msg || typeof msg !== "object") continue;
    const text = String(msg.content || "").trim();
    if (!text) continue;
    out.push({ role: msg.role, content: text });
  }
  return out;
}

function extractUserTurns(history, question) {
  const turns = [];
  for (const msg of history) {
    if (!msg || typeof msg !== "object") continue;
    const role = normalizeRole(msg.role);
    if (role !== "user") continue;
    const text = String(msg.content || "").trim();
    if (!text) continue;
    turns.push(text);
  }

  const latestQuestion = String(question || "").trim();
  if (latestQuestion) turns.push(latestQuestion);
  return turns;
}

function normalizeRole(role) {
  const r = String(role || "").toLowerCase();
  if (r === "assistant" || r === "model") return "model";
  return "user";
}

function isAllowedRequest(req) {
  const origin = req.headers.get("Origin");
  const allowedOrigins = new Set([
    "https://abdullahelbarrany.github.io",
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);
  const ip = req.headers.get("CF-Connecting-IP") || "";
  return allowedOrigins.has(origin) || isOwnerIp(ip);
}

function isOwnerIp(ip) {
  return ip === "197.167.189.166";
}

function limitKey(ip) {
  const d = new Date().toISOString().slice(0, 10);
  return `ask:${d}:${ip}`;
}

function secondsUntilUtcMidnight() {
  const now = new Date();
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0);
  return Math.max(60, Math.floor((next - now.getTime()) / 1000));
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function cors(req, res) {
  const h = new Headers(res.headers);
  const origin = req.headers.get("Origin");
  const allowedOrigins = new Set([
    "https://abdullahelbarrany.github.io",
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);
  if (allowedOrigins.has(origin)) {
    h.set("Access-Control-Allow-Origin", origin);
    h.set("Vary", "Origin");
  }
  h.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(res.body, { status: res.status, headers: h });
}
