# College Application Tracker

A self-contained page (`index.html`) tracking Logan's 23 college applications plus baseball recruiting notes. Data lives in `data.json` in this repo, so it's the same on every device — the page reads and writes it directly via the GitHub API. No backend, no build step.

Repo: `github.com/jcphilly/college-tracker`

## How it works

- **Viewing** works for anyone with the link — no login needed, reads `data.json` straight from GitHub.
- **Editing** requires connecting a GitHub personal access token (see below). Once connected on a device, text fields become click-to-edit and the status badge cycles Not Started → In Progress → Submitted → Decision In → Waitlisted → Denied on click.
- Every edit commits straight to `data.json` in the repo — so it's also your edit history if you ever want to see what changed and when.
- **Baseball Recruiting** section: add coach contact rows, plus a free-text notes box for camps/showcases/film sent.

## Deploying to GitHub Pages

1. Create a new **public** repo on GitHub named `college-tracker` under your account (jcphilly).
2. From this folder:
   ```bash
   git init
   git add index.html data.json README.md
   git commit -m "Add college application tracker"
   git branch -M main
   git remote add origin https://github.com/jcphilly/college-tracker.git
   git push -u origin main
   ```
3. On GitHub: repo → **Settings → Pages** → under "Build and deployment", set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. After a minute, the page is live at `https://jcphilly.github.io/college-tracker/`.

The page is not password-protected — anyone with the exact URL can view it, but it's not indexed by search engines (`robots: noindex, nofollow` is set) and won't appear in search if the repo isn't linked from anywhere public.

## Enabling edits on a device

1. On GitHub: **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Set **Repository access** to "Only select repositories" → `college-tracker`.
3. Under **Permissions → Repository permissions**, set **Contents** to **Read and write**.
4. Generate, copy the token.
5. On the tracker page, click **"Connect to edit"** (top right) and paste it in. It's stored only in that browser's local storage — you'll need to repeat this on each device you want to edit from.
6. To revoke access later, delete the token from GitHub's token settings page, or click **"Disconnect"** on the page.
