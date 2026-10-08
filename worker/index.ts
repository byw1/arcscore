type Env = { ASSETS: Fetcher };

// Only the production domain may be indexed; previews (workers.dev, branch
// previews, pitch subdomains) are served with noindex.
const INDEXABLE_HOSTS = new Set(["arcscore.ai", "www.arcscore.ai"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let res = await env.ASSETS.fetch(request);
    // Link-preview scrapers need absolute URLs; fill them in for whichever host served the page.
    if ((res.headers.get("content-type") ?? "").includes("text/html")) {
      const abs = (v: string | null) => (v && v.startsWith("/") ? url.origin + v : v);
      const page = url.origin + url.pathname;
      res = new HTMLRewriter()
        .on('meta[property="og:image"], meta[name="twitter:image"]', {
          element(e) {
            const v = abs(e.getAttribute("content"));
            if (v) e.setAttribute("content", v);
          },
        })
        .on('meta[property="og:url"]', {
          element(e) {
            e.setAttribute("content", page);
          },
        })
        .transform(res);
    }
    const out = new Response(res.body, res);
    out.headers.set("X-Content-Type-Options", "nosniff");
    out.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    // HTML always revalidates so a deploy shows up immediately; assets are hashed.
    if ((out.headers.get("content-type") ?? "").includes("text/html")) out.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    if (!INDEXABLE_HOSTS.has(url.hostname)) out.headers.set("X-Robots-Tag", "noindex, nofollow");
    return out;
  },
} satisfies ExportedHandler<Env>;
