# Admin dashboard setup

The `/admin` dashboard lets you log in and create/edit/delete blog posts,
which are committed directly to this repo as markdown files (published
posts in `src/content/posts/`, drafts in `content/drafts/`). Cloudflare
Pages rebuilds automatically on every commit, so a newly published post
appears on `/blog` within a minute or two of hitting "Save".

## 1. Create a GitHub token

The dashboard needs write access to this repo to commit post files.

1. GitHub → Settings → Developer settings → **Fine-grained personal access
   tokens** → Generate new token.
2. Repository access: **only this repository**.
3. Permissions: **Contents → Read and write**. Nothing else is needed.
4. Copy the token — you'll paste it into Cloudflare in step 3.

## 2. Generate your admin credentials

Your password is never stored in plain text anywhere — only a SHA-256
hash of it lives in Cloudflare's environment variables. Generate the hash
yourself (don't paste your real password into any AI chat or third-party
tool to do this):

```bash
# macOS / Linux
printf '%s' 'your-password-here' | shasum -a 256

# or with Node
node -e "console.log(require('crypto').createHash('sha256').update('your-password-here').digest('hex'))"
```

Also generate a random session secret (used to sign login cookies):

```bash
openssl rand -hex 32
```

## 3. Set environment variables in Cloudflare

Cloudflare dashboard → Workers & Pages → **rubisco-tech** → Settings →
Environment variables → add these (mark the token and hash/secret as
**Secret**, not plain text variables):

| Variable | Type | Value |
|---|---|---|
| `ADMIN_EMAIL` | Variable | your admin login email |
| `ADMIN_PASSWORD_HASH` | Secret | the SHA-256 hash from step 2 |
| `SESSION_SECRET` | Secret | the random hex string from step 2 |
| `GITHUB_TOKEN` | Secret | the fine-grained PAT from step 1 |
| `GITHUB_OWNER` | Variable | your GitHub username or org |
| `GITHUB_REPO` | Variable | this repo's name |
| `GITHUB_BRANCH` | Variable | `main` (or whatever branch Pages deploys from) |

Redeploy after adding these (or they'll apply on the next deploy
automatically).

## 4. Log in

Visit `https://your-site.pages.dev/admin/login` (or your custom domain),
sign in, and create a post. Toggle "Published" on to commit it to
`src/content/posts/` and trigger a rebuild, or leave it off to save as a
draft in `content/drafts/` without publishing.

## Notes & limitations

- This is a single-admin system — there's one email/password pair, not a
  user table. Fine for a small team; if you need multiple editors with
  separate accounts later, that's a bigger change.
- Every save is a real git commit. You'll see the full history of edits
  in the repo's commit log.
- The dashboard itself (`/admin/*`) doesn't get crawled or listed
  anywhere (`robots.txt` disallows it and it's marked `noindex`), but it
  is still reachable by anyone who knows the URL — the login screen is
  what protects it, so keep your password strong and don't share it in
  chat, email, or docs.
