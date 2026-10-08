type Env = { ASSETS: Fetcher };

// Only the production domain may be indexed; previews (workers.dev, branch
// previews, pitch subdomains) are served with noindex.
const INDEXABLE_HOSTS = new Set(["arcscore.ai", "www.arcscore.ai"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const res = await env.ASSETS.fetch(request);
    if (INDEXABLE_HOSTS.has(url.hostname)) return res;
    const out = new Response(res.body, res);
    out.headers.set("X-Robots-Tag", "noindex, nofollow");
    return out;
  },
} satisfies ExportedHandler<Env>;
