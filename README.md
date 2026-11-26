# Chanda Persaud — personal site

A single-page personal site built with Vite, React and TypeScript. No UI framework, no tracking,
no backend. Your work section and stats are **generated from your GitHub**, and the GitHub panel
reads `api.github.com` live in the browser.

## Contact details — what is real

| Field | Value | Status |
| --- | --- | --- |
| Email | `chanda.persaud@gmail.com` | **Real** — recovered from the author/committer email on this repository's commit objects (`GET /repos/chanda-jpeg/personal-site/commits`). Your public profile hides its email, so swap this if you'd rather not publish that address. |
| Phone | `+1 (555) 010-0000` | **Placeholder** — no phone number exists in your GitHub profile, repos or commit metadata. `555-01xx` is the reserved fictional range, so it cannot ring anyone. The site labels it "placeholder"; replace `PHONE` in `src/config.ts` and set `PHONE_IS_PLACEHOLDER = false` to remove the tag. |

Both values are defined once at the top of `src/config.ts`. The visible text, the `mailto:` /
`tel:` links, the copy buttons beside each row and the `⌘K` "Copy email address" / "Copy phone
number" commands all read from those constants, so they stay in sync automatically.

## Fill in the rest of the template

Everything lives in **`src/config.ts`**, and every remaining slot is marked with `TODO`:

| Slot | What it controls |
| --- | --- |
| `site.socials` | The links list on the right of Contact (GitHub + Email are wired; add LinkedIn / X / Instagram) |
| `site.location`, `site.timezone` | Hero meta line and the live footer clock |
| `site.availability` | The pill above the hero headline |
| `site.intro`, `site.bio`, `site.headline` | Hero paragraph, About paragraphs, big headline |
| `site.now` | The three "Currently" rows in the hero card |
| `timeline` | About → your roles (currently placeholder entries) |
| `skills` | Capability rows and their bars |
| `manualProjects` | Case studies that are **not** GitHub repos |
| `palettes` | The three colour schemes in the Colour section |

## Your GitHub work

`src/projects.generated.ts` is produced by the scraper, not written by hand:

```bash
npm run scrape                  # uses the handle in scripts/scrape-github.mjs
GITHUB_USER=someone npm run scrape
GITHUB_TOKEN=ghp_… npm run scrape   # optional, avoids the 60 req/hour limit
```

It reads the public profile and repositories, drops forks and archived repos, and writes one work
card per repo (title prettified from the repo name, real language, stars, last push date, link to
the homepage or repo) plus four real stats for the About section. Re-run it whenever your
repositories change, then commit the regenerated file.

Currently it renders two cards: **Personal Site** and **Motion Flow System**. The `paperclip`
repository is excluded because it is a fork. Motion Flow System has no description or language yet,
so its card is intentionally a labelled placeholder — add a description and topics on GitHub, then
re-run `npm run scrape` to fill it in.

## Run it locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # typecheck + production build into dist/
npm run preview # serve dist/ locally
```

## Publish

The repo is wired to GitHub Pages through `.github/workflows/deploy.yml`: every push to `main`
builds `dist/` and publishes it. The live site is
**https://chanda-jpeg.github.io/personal-site/**.

`vite.config.ts` uses `base: './'`, so asset paths stay relative and the same build works at a
repository subpath, on a custom domain, or on localhost. `public/.nojekyll` stops Pages from
filtering files that start with an underscore.

Note: the repository has no `package-lock.json`, so CI uses `npm install`. Commit your lockfile and
switch the workflow to `npm ci` when you want reproducible builds.

## Notes on the GitHub API

- The live panel calls `GET /users/{handle}` and `GET /users/{handle}/repos?per_page=100`. Public,
  unauthenticated requests are limited to **60 per hour per IP**; responses are cached in
  `sessionStorage` for 10 minutes, so normal browsing stays well under it.
- If the limit is hit the panel says so and recovers by itself — no key or secret belongs in a
  static site.
- For a higher limit or private repos you would need a server-side proxy; this project deliberately
  has no backend.
