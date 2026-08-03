const ALLOWED_ORIGIN = "https://jcphilly.github.io";
const OWNER = "jcphilly";
const REPO = "college-tracker";
const PATH = "data.json";
const BRANCH = "main";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== "POST") {
      return json({ error: "method not allowed" }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid json body" }, 400);
    }

    const { password, data, message } = body;
    if (!password || password !== env.EDIT_PASSWORD) {
      return json({ error: "unauthorized" }, 401);
    }
    if (!data || typeof data !== "object") {
      return json({ error: "missing data" }, 400);
    }

    const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;
    const ghHeaders = {
      "Authorization": `token ${env.GITHUB_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "college-tracker-worker",
    };

    const getRes = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers: ghHeaders });
    if (!getRes.ok) {
      return json({ error: "failed to read current file from github" }, 502);
    }
    const current = await getRes.json();

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: { ...ghHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message || "Update tracker",
        content,
        sha: current.sha,
        branch: BRANCH,
      }),
    });

    if (!putRes.ok) {
      const errBody = await putRes.json().catch(() => ({}));
      return json({ error: "github save failed", detail: errBody.message || null }, 502);
    }

    return json({ ok: true });
  },
};
