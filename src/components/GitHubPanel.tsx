import { useMemo, useState, type CSSProperties } from 'react'
import { site } from '../config'
import { timeAgo, useGitHub, type GhRepo } from '../hooks'
import { Arrow, Fork, Refresh, SectionHead, Star } from './ui'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  Rust: '#dea584',
  Go: '#00add8',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Lua: '#000080',
  Dart: '#00b4ab',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Astro: '#ff5a03',
  MDX: '#fcb32c',
}

const colorFor = (lang: string | null) =>
  lang ? LANG_COLORS[lang] ?? 'var(--accent-2)' : 'var(--muted)'

function RepoCard({ repo }: { repo: GhRepo }) {
  return (
    <a className="repo" href={repo.html_url} target="_blank" rel="noreferrer">
      <span className="repo__name">
        {repo.name}
        <Arrow size={11} />
      </span>
      <span className="repo__desc">{repo.description ?? 'No description — the code speaks.'}</span>
      <span className="repo__meta">
        {repo.language ? (
          <span>
            <i className="dot" style={{ '--lang': colorFor(repo.language) } as CSSProperties} />
            {repo.language}
          </span>
        ) : null}
        <span>
          <Star /> {repo.stargazers_count}
        </span>
        <span>
          <Fork /> {repo.forks_count}
        </span>
        <span>{timeAgo(repo.pushed_at)}</span>
      </span>
    </a>
  )
}

function RepoSkeletons() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="repo" key={i} aria-hidden="true">
          <div className="skeleton" style={{ height: 14, width: `${40 + ((i * 13) % 35)}%` }} />
          <div className="skeleton" style={{ height: 10, width: '92%' }} />
          <div className="skeleton" style={{ height: 10, width: '70%' }} />
          <div className="skeleton" style={{ height: 10, width: '48%', marginTop: 'auto' }} />
        </div>
      ))}
    </>
  )
}

export function GitHubPanel() {
  const gh = useGitHub(site.github.username)
  const [lang, setLang] = useState('All')
  const [sort, setSort] = useState<'recent' | 'stars'>('recent')
  const [expanded, setExpanded] = useState(false)

  const languages = useMemo(() => {
    const counts = new Map<string, number>()
    gh.repos.forEach((repo) => {
      if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
    })
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name]) => name)
  }, [gh.repos])

  const visible = useMemo(() => {
    const filtered = lang === 'All' ? gh.repos : gh.repos.filter((r) => r.language === lang)
    const sorted = [...filtered].sort((a, b) =>
      sort === 'stars'
        ? b.stargazers_count - a.stargazers_count
        : new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
    )
    return sorted
  }, [gh.repos, lang, sort])

  const shown = expanded ? visible : visible.slice(0, 9)
  const loading = gh.status === 'loading'

  return (
    <section className="section" id="github">
      <div className="container">
        <SectionHead
          index="04 — Open source"
          title={
            <>
              Straight from the <em>GitHub API</em>.
            </>
          }
          lede="This panel is not a screenshot. It fetches the profile and repositories live from api.github.com, caches the response for ten minutes, and filters client-side."
        />

        <div className="gh">
          <div className="gh__head">
            {gh.profile ? (
              <div className="gh__avatar">
                <img src={gh.profile.avatar_url} alt={`${gh.profile.login} avatar`} loading="lazy" />
              </div>
            ) : (
              <div className="gh__avatar gh__avatar--skeleton" aria-hidden="true" />
            )}

            <div className="gh__identity">
              {gh.profile ? (
                <>
                  <h3>{gh.profile.name ?? gh.profile.login}</h3>
                  <a
                    className="gh__handle"
                    href={gh.profile.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @{gh.profile.login}
                  </a>
                  <p className="gh__bio">
                    {gh.profile.bio ?? 'No bio on GitHub. The commits do the talking.'}
                    {gh.profile.location ? ` · ${gh.profile.location}` : ''}
                  </p>
                </>
              ) : (
                <>
                  <div className="skeleton" style={{ height: 22, width: 190, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 11, width: 110 }} />
                </>
              )}
            </div>

            <div className="gh__counts">
              <div className="gh__count">
                <b>{gh.profile?.public_repos ?? '—'}</b>
                <span>repos</span>
              </div>
              <div className="gh__count">
                <b>{gh.profile?.followers ?? '—'}</b>
                <span>followers</span>
              </div>
            </div>
          </div>

          <div className="gh__toolbar">
            <button
              className={`filter${lang === 'All' ? ' is-on' : ''}`}
              onClick={() => setLang('All')}
            >
              All
            </button>
            {languages.map((name) => (
              <button
                key={name}
                className={`filter${lang === name ? ' is-on' : ''}`}
                onClick={() => setLang(name)}
              >
                <i className="dot" style={{ '--lang': colorFor(name) } as CSSProperties} />
                {name}
              </button>
            ))}

            <span className="gh__spacer" />

            <button
              className={`filter${sort === 'stars' ? ' is-on' : ''}`}
              onClick={() => setSort((s) => (s === 'stars' ? 'recent' : 'stars'))}
              title="Toggle sort order"
            >
              {sort === 'stars' ? '★ most starred' : '↻ recently pushed'}
            </button>
            <button
              className={`gh__refresh${loading ? ' is-spinning' : ''}`}
              onClick={gh.refresh}
              disabled={loading}
            >
              <Refresh /> sync
            </button>
          </div>

          <div className="gh__repos">
            {loading && !gh.repos.length ? <RepoSkeletons /> : null}

            {gh.status === 'error' ? (
              <div className="gh__state" role="alert">
                <strong>Couldn’t reach GitHub</strong>
                {gh.error}
                <div style={{ marginTop: '1rem' }}>
                  <button className="btn" onClick={gh.refresh}>
                    Try again
                  </button>
                </div>
              </div>
            ) : null}

            {!loading && gh.status === 'ready' && !shown.length ? (
              <div className="gh__empty">
                <strong>Nothing matches that filter</strong>
                Try another language, or clear the filter to see every public repository.
              </div>
            ) : null}

            {shown.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>

          <div className="gh__foot">
            <span>
              {gh.fetchedAt ? `synced ${timeAgo(new Date(gh.fetchedAt).toISOString())}` : 'waiting for github'}
              {gh.cached ? ' · cached' : ''} · {visible.length} repos
            </span>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {visible.length > 9 ? (
                <button className="gh__refresh" onClick={() => setExpanded((v) => !v)}>
                  {expanded ? 'show less' : `show all ${visible.length}`}
                </button>
              ) : null}
              <a href={`https://github.com/${site.github.username}`} target="_blank" rel="noreferrer">
                github.com/{site.github.username} <Arrow size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
