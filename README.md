# Personal site — design engineer portfolio

A single-page personal site built with Vite, React and TypeScript. No UI framework, no tracking,
no backend: the GitHub section reads `api.github.com` directly from the browser.

## Make it yours (2 minutes)

Everything textual lives in **`src/config.ts`**:

| Field | What it controls |
| --- | --- |
| `site.github.username` | Handle the live GitHub panel loads. **Change this first.** |
| `site.name`, `initials`, `location`, `timezone` | Nav, hero, footer |
| `site.headline`, `intro`, `bio`, `roleWords` | Hero copy, about paragraphs, marquee |
| `site.email`, `socials` | Contact block and mail links |
| `projects` | Work cards + the case-study modal |
| `skills`, `timeline`, `stats` | Capability rows, CV list, counters |
| `palettes` | Colour presets offered in the palette lab |

Colours are CSS variables: add a block in `src/styles.css` keyed by `:root[data-palette='your-id']`
and a matching entry in `config.ts`.

## Run it locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # typecheck + production build into dist/
npm run preview # serve dist/ locally
```

## Launch it on GitHub

1. Create an empty repository on GitHub — **any name** works; for a personal site use
   `<username>.github.io` if you want the root URL.
2. Push this project to it:

   ```bash
   git init -b main
   git add .
   git commit -m "Personal site"
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```

3. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) builds on every push to `main` and
   publishes `dist/`. Watch it under the **Actions** tab; the site appears at
   `https://<username>.github.io/<repo>/` (or `https://<username>.github.io/` for a
   `<username>.github.io` repo).

`vite.config.ts` uses `base: './'`, so asset paths stay relative and the same build works at a
repository subpath, on a custom domain, or on localhost. `public/.nojekyll` stops Pages from
filtering files that start with an underscore.

### Notes on the GitHub API

- The panel calls `GET /users/{handle}` and `GET /users/{handle}/repos?per_page=100`. Public,
  unauthenticated requests are limited to **60 per hour per IP**; responses are cached in
  `sessionStorage` for 10 minutes, so normal browsing stays well under it.
- If you hit the limit the panel says so and recovers by itself — no key or secret is needed,
  and none should ever be committed to a static site.
- Optional next step: swap the `fetch` calls in `src/hooks.ts` for a serverless proxy if you want
  a higher rate limit or private repos. That requires a backend; this project deliberately has none.
