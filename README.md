# College Application Tracker

A self-contained page (`index.html`) tracking Logan's 23 college applications plus baseball recruiting notes. Data lives in `data.json` in this repo, so it's the same on every device.

Repo: `github.com/jcphilly/college-tracker`

## How it works

- **Viewing** works for anyone with the link — no login needed, reads `data.json` straight from GitHub's public API.
- **Editing** requires the shared edit password (click "Connect to edit"). Once connected on a device, text fields become click-to-edit and the status badge cycles Not Started → In Progress → Submitted → Decision In → Waitlisted → Denied on click.
- Edits don't talk to GitHub directly. They go to a small Cloudflare Worker (`worker/`) which checks the password server-side, then uses its own private GitHub token to commit the change to `data.json`. The real GitHub token never touches the browser — only the shared password does.
- Every edit commits straight to `data.json` in the repo — so it's also your edit history if you ever want to see what changed and when.
- **Baseball Recruiting** section: add coach contact rows, plus a free-text notes box for camps/showcases/film sent.

## Deploying to GitHub Pages

1. Create a new **public** repo on GitHub named `college-tracker` under your account (jcphilly).
2. From this folder:
   ```bash
   git init
   git add index.html data.json README.md worker/
   git commit -m "Add college application tracker"
   git branch -M main
   git remote add origin https://github.com/jcphilly/college-tracker.git
   git push -u origin main
   ```
3. On GitHub: repo → **Settings → Pages** → under "Build and deployment", set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. After a minute, the page is live at `https://jcphilly.github.io/college-tracker/`.

The page is not password-protected for *viewing* — anyone with the exact URL can see it, but it's not indexed by search engines (`robots: noindex, nofollow` is set) and won't appear in search if the repo isn't linked from anywhere public. *Editing* is password-gated as described above.

## The Cloudflare Worker (`worker/`)

This is what makes password-based editing possible without exposing a GitHub token in the page.

- `worker/wrangler.toml` / `worker/src/index.js` — the proxy itself. Deployed at `https://college-tracker-proxy.joecamp.workers.dev`.
- Two secrets are configured on the Worker (not in any file — set via `wrangler secret put`):
  - `EDIT_PASSWORD` — the shared password checked against what the page sends.
  - `GITHUB_TOKEN` — a fine-grained PAT scoped to just this repo, Contents: Read and write. Used server-side only to commit to `data.json`.
- To redeploy after changing `worker/src/index.js`: `cd worker && npx wrangler deploy`.
- To rotate the password or the GitHub token: `npx wrangler secret put EDIT_PASSWORD` or `npx wrangler secret put GITHUB_TOKEN` from the `worker/` folder, then no redeploy needed — secrets update independently.
- To change which browsers can call the Worker, edit `ALLOWED_ORIGIN` in `worker/src/index.js` (currently locked to `https://jcphilly.github.io`).
