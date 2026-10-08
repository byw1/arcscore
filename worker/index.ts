import { Hono } from "hono";

type Env = {
  ASSETS: Fetcher;
  DB?: D1Database;
};

const AUDIENCES = ["athlete", "brand", "school", "investor"] as const;
type Audience = (typeof AUDIENCES)[number];

const app = new Hono<{ Bindings: Env }>().basePath("/api");

app.get("/health", (c) => c.json({ ok: true, db: Boolean(c.env.DB) }));

app.post("/leads", async (c) => {
  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const str = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";

  const email = str(body.email, 254).toLowerCase();
  const audience = str(body.audience, 16) as Audience;
  // Honeypot: real users never fill this hidden field.
  if (str(body.company_website, 200)) return c.json({ ok: true });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ ok: false, error: "Please enter a valid email." }, 422);
  }
  if (!AUDIENCES.includes(audience)) {
    return c.json({ ok: false, error: "Unknown audience." }, 422);
  }

  const lead = {
    id: crypto.randomUUID(),
    audience,
    name: str(body.name, 120),
    email,
    org: str(body.org, 160),
    message: str(body.message, 2000),
    source: str(body.source, 120),
    user_agent: (c.req.header("user-agent") ?? "").slice(0, 300),
  };

  if (c.env.DB) {
    await c.env.DB.prepare(
      `INSERT INTO leads (id, audience, name, email, org, message, source, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(lead.id, lead.audience, lead.name, lead.email, lead.org, lead.message, lead.source, lead.user_agent)
      .run();
  } else {
    // No D1 bound yet: keep the request visible in Workers logs.
    console.log("lead", JSON.stringify(lead));
  }

  return c.json({ ok: true, id: lead.id });
});

app.notFound((c) => c.json({ ok: false, error: "Not found" }, 404));

export default {
  fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return app.fetch(request, env, ctx);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
